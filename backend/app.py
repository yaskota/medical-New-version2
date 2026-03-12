"""
Medical Symptom Checker Chatbot — Backend API
==============================================
A structured diagnostic flow chatbot that:
1. Extracts symptoms from user text
2. Asks disease-specific follow-up questions
3. Collects duration and age information
4. Performs risk analysis
5. Provides medical advice based on risk level
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import uuid

from services.nlp_engine import extract_tokens
from services.synonym_mapper import normalize_symptoms
from services.disease_predictor import predict_disease
from services.followup_engine import get_followup_questions, get_additional_questions
from services.risk_analyzer import analyze_risk
from services.emergency_checker import detect_emergency
from services.duration_checker import check_duration

app = Flask(__name__)
CORS(app)

# ─── Load Datasets ───────────────────────────────────────────────────────────

def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


diseases = load_json("datasets/diseases.json")
synonyms = load_json("datasets/symptom_synonyms.json")
emergency = load_json("datasets/emergency_symptoms.json")
followups = load_json("datasets/followup_questions.json")
duration_rules = load_json("datasets/duration_rules.json")
age_rules = load_json("datasets/age_risk_rules.json")

# ─── In-Memory Session Store ─────────────────────────────────────────────────

sessions = {}


def get_session(session_id):
    """Get or create a session."""
    if session_id not in sessions:
        sessions[session_id] = {
            "stage": "initial",          # initial -> followup -> duration -> age -> result
            "detected_symptoms": [],
            "confirmed_symptoms": [],
            "denied_symptoms": [],
            "followup_questions": [],
            "current_question_index": 0,
            "already_asked": set(),
            "duration": None,
            "age": None,
            "predictions": [],
            "emergency_detected": False,
        }
    return sessions[session_id]


def reset_session(session_id):
    """Reset a session for a new conversation."""
    if session_id in sessions:
        del sessions[session_id]
    return get_session(session_id)


# ─── API Routes ──────────────────────────────────────────────────────────────

@app.route("/api/session", methods=["POST"])
def create_session():
    """Create a new chat session."""
    session_id = str(uuid.uuid4())
    get_session(session_id)
    return jsonify({
        "session_id": session_id,
        "message": "Hello! I'm your Medical Symptom Checker. Please describe your symptoms and I'll help you understand what might be going on.",
        "stage": "initial",
        "input_type": "text"
    })


@app.route("/api/chat", methods=["POST"])
def chat():
    """Main chat endpoint — handles all conversation stages."""
    data = request.json
    session_id = data.get("session_id")
    user_input = data.get("message", "").strip()

    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

    session = get_session(session_id)
    stage = session["stage"]

    # ─── Stage 1: Initial symptom input ──────────────────────────────────
    if stage == "initial":
        return handle_initial(session, session_id, user_input)

    # ─── Stage 2: Follow-up questions (Yes/No) ──────────────────────────
    elif stage == "followup":
        return handle_followup(session, session_id, user_input)

    # ─── Stage 3: Duration question ──────────────────────────────────────
    elif stage == "duration":
        return handle_duration(session, session_id, user_input)

    # ─── Stage 4: Age question ───────────────────────────────────────────
    elif stage == "age":
        return handle_age(session, session_id, user_input)

    # ─── Stage 5: Done — user can restart ────────────────────────────────
    elif stage == "result":
        session = reset_session(session_id)
        return handle_initial(session, session_id, user_input)

    return jsonify({"error": "Unknown stage"}), 400


@app.route("/api/reset", methods=["POST"])
def reset():
    """Reset a chat session."""
    data = request.json
    session_id = data.get("session_id")
    if session_id:
        reset_session(session_id)
    return jsonify({
        "message": "Session reset. Please describe your new symptoms.",
        "stage": "initial",
        "input_type": "text"
    })


# ─── Stage Handlers ──────────────────────────────────────────────────────────

def handle_initial(session, session_id, user_input):
    """Process initial user symptom description."""
    # Extract and normalize symptoms 
    tokens = extract_tokens(user_input)
    symptoms = normalize_symptoms(tokens, synonyms)

    if not symptoms:
        return jsonify({
            "session_id": session_id,
            "message": "I couldn't identify any symptoms from your message. Could you please describe your symptoms more clearly? For example: 'I have fever and headache' or 'I feel nauseous with stomach pain'.",
            "stage": "initial",
            "input_type": "text",
            "detected_symptoms": []
        })

    session["detected_symptoms"] = symptoms
    session["confirmed_symptoms"] = list(symptoms)

    # Check for emergency symptoms
    emergency_symptoms = detect_emergency(symptoms, emergency)
    if emergency_symptoms:
        session["emergency_detected"] = True
        emergency_names = [s.replace("_", " ") for s in emergency_symptoms]
        
        # Still proceed with questions but flag emergency
        session["stage"] = "followup"
        
        # Generate follow-up questions
        questions = get_followup_questions(symptoms, followups)
        if not questions:
            questions = get_additional_questions(symptoms, diseases, followups)
        
        session["followup_questions"] = questions
        session["current_question_index"] = 0
        session["already_asked"] = {q["symptom"] for q in questions}
        
        if questions:
            return jsonify({
                "session_id": session_id,
                "message": f"⚠️ EMERGENCY ALERT: I detected potentially serious symptoms: {', '.join(emergency_names)}. Please seek immediate medical attention! I'll continue the assessment, but please prioritize visiting a hospital.",
                "followup_question": questions[0]["question"],
                "detected_symptoms": [s.replace("_", " ") for s in symptoms],
                "stage": "followup",
                "input_type": "yesno",
                "is_emergency": True,
                "question_progress": {"current": 1, "total": len(questions)}
            })
        else:
            # No followup questions — skip to duration
            session["stage"] = "duration"
            return jsonify({
                "session_id": session_id,
                "message": f"⚠️ EMERGENCY ALERT: I detected potentially serious symptoms: {', '.join(emergency_names)}. Please seek immediate medical attention!",
                "followup_question": "How many days have you had these symptoms?",
                "detected_symptoms": [s.replace("_", " ") for s in symptoms],
                "stage": "duration",
                "input_type": "number",
                "is_emergency": True
            })

    # Generate follow-up questions based on detected symptoms
    questions = get_followup_questions(symptoms, followups)
    
    if not questions:
        # Try disease-based questions if symptom-based ones not available
        questions = get_additional_questions(symptoms, diseases, followups)
    
    if not questions:
        # No questions available — skip directly to duration
        session["stage"] = "duration"
        symptom_names = [s.replace("_", " ") for s in symptoms]
        return jsonify({
            "session_id": session_id,
            "message": f"I detected the following symptoms: {', '.join(symptom_names)}. Let me gather a bit more information.",
            "followup_question": "How many days have you had these symptoms?",
            "detected_symptoms": symptom_names,
            "stage": "duration",
            "input_type": "number"
        })

    session["followup_questions"] = questions
    session["current_question_index"] = 0
    session["already_asked"] = {q["symptom"] for q in questions}
    session["stage"] = "followup"

    symptom_names = [s.replace("_", " ") for s in symptoms]

    return jsonify({
        "session_id": session_id,
        "message": f"I detected the following symptoms: {', '.join(symptom_names)}. Let me ask you a few more questions to narrow down the possible condition.",
        "followup_question": questions[0]["question"],
        "detected_symptoms": symptom_names,
        "stage": "followup",
        "input_type": "yesno",
        "question_progress": {"current": 1, "total": len(questions)}
    })


def handle_followup(session, session_id, user_input):
    """Process Yes/No answers to follow-up questions."""
    questions = session["followup_questions"]
    idx = session["current_question_index"]

    if idx >= len(questions):
        # Shouldn't happen, but handle gracefully
        session["stage"] = "duration"
        return jsonify({
            "session_id": session_id,
            "message": "Thank you for answering the questions.",
            "followup_question": "How many days have you had these symptoms?",
            "stage": "duration",
            "input_type": "number"
        })

    current_q = questions[idx]
    answer = user_input.lower().strip()

    # Process user's answer
    if answer in ["yes", "y", "yeah", "yep", "ya", "true", "1"]:
        symptom = current_q["symptom"]
        if symptom not in session["confirmed_symptoms"]:
            session["confirmed_symptoms"].append(symptom)
    elif answer in ["no", "n", "nah", "nope", "false", "0"]:
        session["denied_symptoms"].append(current_q["symptom"])
    else:
        # Could not parse — ask again
        return jsonify({
            "session_id": session_id,
            "message": "Please answer with 'Yes' or 'No'.",
            "followup_question": current_q["question"],
            "stage": "followup",
            "input_type": "yesno",
            "question_progress": {"current": idx + 1, "total": len(questions)}
        })

    # Move to next question
    next_idx = idx + 1
    session["current_question_index"] = next_idx

    if next_idx < len(questions):
        next_q = questions[next_idx]
        return jsonify({
            "session_id": session_id,
            "message": "Got it.",
            "followup_question": next_q["question"],
            "stage": "followup",
            "input_type": "yesno",
            "question_progress": {"current": next_idx + 1, "total": len(questions)}
        })

    # All questions answered — move to duration stage
    session["stage"] = "duration"
    confirmed_names = [s.replace("_", " ") for s in session["confirmed_symptoms"]]
    
    return jsonify({
        "session_id": session_id,
        "message": f"Thank you! Based on your responses, your confirmed symptoms are: {', '.join(confirmed_names)}.",
        "followup_question": "How many days have you had these symptoms?",
        "confirmed_symptoms": confirmed_names,
        "stage": "duration",
        "input_type": "number"
    })


def handle_duration(session, session_id, user_input):
    """Process duration input."""
    try:
        duration = int(user_input.strip())
        if duration < 0 or duration > 365:
            raise ValueError("Invalid duration")
    except ValueError:
        return jsonify({
            "session_id": session_id,
            "message": "Please enter a valid number of days (e.g., 1, 3, 7).",
            "followup_question": "How many days have you had these symptoms?",
            "stage": "duration",
            "input_type": "number"
        })

    session["duration"] = duration
    session["stage"] = "age"

    return jsonify({
        "session_id": session_id,
        "message": f"You've had these symptoms for {duration} day(s).",
        "followup_question": "What is your age?",
        "stage": "age",
        "input_type": "number"
    })


def handle_age(session, session_id, user_input):
    """Process age input and generate final diagnosis."""
    try:
        age = int(user_input.strip())
        if age < 0 or age > 150:
            raise ValueError("Invalid age")
    except ValueError:
        return jsonify({
            "session_id": session_id,
            "message": "Please enter a valid age (e.g., 25, 42, 65).",
            "followup_question": "What is your age?",
            "stage": "age",
            "input_type": "number"
        })

    session["age"] = age
    session["stage"] = "result"

    # ─── Final Disease Prediction ────────────────────────────────────────
    confirmed = session["confirmed_symptoms"]
    duration = session["duration"]

    # Predict diseases
    predictions = predict_disease(confirmed, diseases)

    if not predictions:
        return jsonify({
            "session_id": session_id,
            "message": "Based on your symptoms, I could not find a strong match in my database. I recommend consulting a healthcare professional for a proper diagnosis.",
            "stage": "result",
            "input_type": "text",
            "result": {
                "detected_symptoms": [s.replace("_", " ") for s in confirmed],
                "possible_disease": "Unknown — consult a doctor",
                "risk_level": "unknown",
                "advice": "Please visit a healthcare professional for proper diagnosis and treatment.",
                "is_emergency": session["emergency_detected"]
            }
        })

    # Analyze risk for top prediction
    top = predictions[0]
    risk_level, risk_factors = analyze_risk(top, age, duration, age_rules, duration_rules)
    duration_risk = check_duration(duration)

    # Build final response
    result = build_final_result(
        top, predictions, confirmed, age, duration,
        risk_level, risk_factors, duration_risk,
        session["emergency_detected"]
    )

    return jsonify({
        "session_id": session_id,
        "stage": "result",
        "input_type": "text",
        "result": result
    })


def build_final_result(top_disease, all_predictions, symptoms, age, duration,
                       risk_level, risk_factors, duration_risk, is_emergency):
    """Build the final diagnostic result."""
    
    symptom_names = [s.replace("_", " ") for s in symptoms]

    # Determine advice based on risk level
    if risk_level == "high" or is_emergency:
        warning = "⚠️ HIGH RISK — This condition may be dangerous. Please visit a hospital or consult a doctor immediately!"
        advice_type = "emergency"
    elif risk_level == "moderate":
        warning = "⚡ MODERATE RISK — Monitor your symptoms carefully. If they worsen, consult a doctor promptly."
        advice_type = "moderate"
    else:
        warning = "✅ LOW RISK — This appears to be a manageable condition. Follow the home remedies and precautions below."
        advice_type = "low"

    # Build other possible diseases list
    other_diseases = []
    for pred in all_predictions[1:]:
        other_diseases.append({
            "name": pred["disease"],
            "confidence": f"{int(pred['score'] * 100)}%",
            "risk": pred["base_risk"]
        })

    result = {
        "detected_symptoms": symptom_names,
        "possible_disease": top_disease["disease"],
        "confidence": f"{int(top_disease['score'] * 100)}%",
        "matched_symptoms": [s.replace("_", " ") for s in top_disease.get("matched_symptoms", [])],
        "risk_level": risk_level,
        "risk_factors": risk_factors,
        "duration_risk": duration_risk,
        "warning": warning,
        "advice_type": advice_type,
        "precautions": top_disease.get("precautions", []),
        "home_remedies": top_disease.get("home_remedies", []),
        "medicines": top_disease.get("medicines", []),
        "other_possible_diseases": other_diseases,
        "is_emergency": is_emergency,
        "patient_info": {
            "age": age,
            "duration_days": duration
        }
    }

    return result


# ─── Health Check ─────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "diseases_loaded": len(diseases)})


# ─── Run Server ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("  Medical Symptom Checker Chatbot — Backend Server")
    print(f"  Loaded {len(diseases)} diseases")
    print(f"  Loaded {len(followups)} symptom follow-up categories")
    print(f"  Loaded {len(emergency)} emergency symptoms")
    print("=" * 60)
    app.run(debug=True, port=5000)