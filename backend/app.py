"""
Medical Symptom Checker Chatbot — Backend API
==============================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import uuid

from services.nlp_engine import extract_symptoms
from services.disease_predictor import predict_disease
from services.followup_engine import get_smart_followup_questions
from services.risk_analyzer import analyze_risk
from services.emergency_checker import detect_emergency
from services.duration_checker import check_duration

app = Flask(__name__)
CORS(app)

def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

diseases = load_json("datasets/diseases.json")
emergency = load_json("datasets/emergency_symptoms.json")
followups = load_json("datasets/followup_questions.json")
duration_rules = load_json("datasets/duration_rules.json")
age_rules = load_json("datasets/age_risk_rules.json")

sessions = {}

def get_session(session_id):
    if session_id not in sessions:
        sessions[session_id] = {
            "stage": "initial", 
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
    if session_id in sessions:
        del sessions[session_id]
    return get_session(session_id)

@app.route("/api/session", methods=["POST"])
def create_session():
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
    data = request.json
    session_id = data.get("session_id")
    user_input = data.get("message", "").strip()

    if not session_id: return jsonify({"error": "session_id is required"}), 400

    session = get_session(session_id)
    stage = session["stage"]

    if stage == "initial": return handle_initial(session, session_id, user_input)
    elif stage == "followup": return handle_followup(session, session_id, user_input)
    elif stage == "duration": return handle_duration(session, session_id, user_input)
    elif stage == "age": return handle_age(session, session_id, user_input)
    elif stage == "result":
        session = reset_session(session_id)
        return handle_initial(session, session_id, user_input)

    return jsonify({"error": "Unknown stage"}), 400

@app.route("/api/reset", methods=["POST"])
def reset():
    data = request.json
    session_id = data.get("session_id")
    if session_id: reset_session(session_id)
    return jsonify({
        "message": "Session reset. Please describe your new symptoms.",
        "stage": "initial",
        "input_type": "text"
    })

# ─── NEW: DYNAMIC ROUTING HELPERS ────────────────────────────────────────────

def determine_next_step(session, session_id, message_prefix=""):
    """Automatically skips duration or age if the NLP engine already found them."""
    if session.get("duration") is None:
        session["stage"] = "duration"
        return jsonify({
            "session_id": session_id,
            "message": f"{message_prefix} Let me gather a bit more information.",
            "followup_question": "How many days have you had these symptoms?",
            "stage": "duration",
            "input_type": "number"
        })
    elif session.get("age") is None:
        session["stage"] = "age"
        return jsonify({
            "session_id": session_id,
            "message": f"{message_prefix} Got it.",
            "followup_question": "What is your age?",
            "stage": "age",
            "input_type": "number"
        })
    else:
        # We have both! Skip straight to final diagnosis.
        session["stage"] = "result"
        return generate_final_diagnosis(session, session_id)

def generate_final_diagnosis(session, session_id):
    """Generates the final AI prediction payload."""
    confirmed = session["confirmed_symptoms"]
    duration = session["duration"]
    age = session["age"]

    predictions = predict_disease(confirmed, diseases)

    if not predictions:
        return jsonify({
            "session_id": session_id,
            "message": "Based on your symptoms, I could not find a strong match. Please consult a doctor.",
            "stage": "result",
            "input_type": "text",
            "result": {
                "detected_symptoms": [s.replace("_", " ") for s in confirmed],
                "possible_disease": "Unknown",
                "risk_level": "unknown",
                "advice": "Please visit a healthcare professional.",
                "is_emergency": session["emergency_detected"]
            }
        })

    top = predictions[0]
    risk_level, risk_factors = analyze_risk(top, age, duration, age_rules, duration_rules)
    duration_risk = check_duration(duration)

    result = build_final_result(top, predictions, confirmed, age, duration, risk_level, risk_factors, duration_risk, session["emergency_detected"])
    return jsonify({"session_id": session_id, "stage": "result", "input_type": "text", "result": result})

# ─── STAGE HANDLERS ──────────────────────────────────────────────────────────

def handle_initial(session, session_id, user_input):
    # UNPACK ALL 4 VARIABLES FROM THE NEW NLP ENGINE
    confirmed, denied, ext_age, ext_duration = extract_symptoms(user_input)

    if not confirmed:
        return jsonify({
            "session_id": session_id,
            "message": "I couldn't identify any symptoms. Could you describe them more clearly? (e.g., 'I have a fever and headache for 2 days').",
            "stage": "initial",
            "input_type": "text",
            "detected_symptoms": []
        })

    # Save everything found to the session
    session["detected_symptoms"] = confirmed
    session["confirmed_symptoms"] = confirmed
    session["denied_symptoms"] = denied
    if ext_age is not None: session["age"] = ext_age
    if ext_duration is not None: session["duration"] = ext_duration

    emergency_symptoms = detect_emergency(confirmed, emergency)
    if emergency_symptoms:
        session["emergency_detected"] = True
        emergency_names = [s.replace("_", " ") for s in emergency_symptoms]
        
        questions = get_smart_followup_questions(confirmed, denied, diseases, followups, session.get("already_asked", set()))
        session["followup_questions"] = questions
        session["current_question_index"] = 0
        
        if "already_asked" not in session: session["already_asked"] = set()
        session["already_asked"].update({q["symptom"] for q in questions})
        
        if questions:
            session["stage"] = "followup"
            return jsonify({
                "session_id": session_id,
                "message": f"⚠️ EMERGENCY ALERT: I detected serious symptoms: {', '.join(emergency_names)}. Please seek immediate medical attention! I'll continue the assessment.",
                "followup_question": questions[0]["question"],
                "detected_symptoms": [s.replace("_", " ") for s in confirmed],
                "stage": "followup",
                "input_type": "yesno",
                "is_emergency": True,
                "question_progress": {"current": 1, "total": len(questions)}
            })
        else:
            return determine_next_step(session, session_id, f"⚠️ EMERGENCY ALERT: I detected serious symptoms: {', '.join(emergency_names)}.")

    questions = get_smart_followup_questions(confirmed, denied, diseases, followups, session.get("already_asked", set()))
    
    if not questions:
        symptom_names = [s.replace("_", " ") for s in confirmed]
        return determine_next_step(session, session_id, f"I detected the following symptoms: {', '.join(symptom_names)}.")

    session["followup_questions"] = questions
    session["current_question_index"] = 0
    if "already_asked" not in session: session["already_asked"] = set()
    session["already_asked"].update({q["symptom"] for q in questions})
    session["stage"] = "followup"

    symptom_names = [s.replace("_", " ") for s in confirmed]
    return jsonify({
        "session_id": session_id,
        "message": f"I detected the following symptoms: {', '.join(symptom_names)}. Let me ask you a few more questions.",
        "followup_question": questions[0]["question"],
        "detected_symptoms": symptom_names,
        "stage": "followup",
        "input_type": "yesno",
        "question_progress": {"current": 1, "total": len(questions)}
    })

def handle_followup(session, session_id, user_input):
    questions = session["followup_questions"]
    idx = session["current_question_index"]

    if idx >= len(questions):
        return determine_next_step(session, session_id, "Thank you for answering.")

    current_q = questions[idx]
    answer = user_input.lower().strip()

    if answer in ["yes", "y", "yeah", "yep", "ya", "true", "1"]:
        symptom = current_q["symptom"]
        if symptom not in session["confirmed_symptoms"]:
            session["confirmed_symptoms"].append(symptom)
    elif answer in ["no", "n", "nah", "nope", "false", "0"]:
        session["denied_symptoms"].append(current_q["symptom"])
    else:
        return jsonify({
            "session_id": session_id,
            "message": "Please answer with 'Yes' or 'No'.",
            "followup_question": current_q["question"],
            "stage": "followup",
            "input_type": "yesno",
            "question_progress": {"current": idx + 1, "total": len(questions)}
        })

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

    # All questions finished! Let the new helper decide where to go.
    confirmed_names = [s.replace("_", " ") for s in session["confirmed_symptoms"]]
    return determine_next_step(session, session_id, f"Thank you! Your confirmed symptoms are: {', '.join(confirmed_names)}.")

def handle_duration(session, session_id, user_input):
    try:
        duration = int(user_input.strip())
        if duration < 0 or duration > 365: raise ValueError("Invalid duration")
    except ValueError:
        return jsonify({
            "session_id": session_id,
            "message": "Please enter a valid number of days (e.g., 1, 3, 7).",
            "followup_question": "How many days have you had these symptoms?",
            "stage": "duration",
            "input_type": "number"
        })

    session["duration"] = duration
    return determine_next_step(session, session_id, f"You've had these symptoms for {duration} day(s).")

def handle_age(session, session_id, user_input):
    try:
        age = int(user_input.strip())
        if age < 0 or age > 150: raise ValueError("Invalid age")
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
    return generate_final_diagnosis(session, session_id)

def build_final_result(top_disease, all_predictions, symptoms, age, duration, risk_level, risk_factors, duration_risk, is_emergency):
    symptom_names = [s.replace("_", " ") for s in symptoms]

    if risk_level == "high" or is_emergency:
        warning = "⚠️ HIGH RISK — This condition may be dangerous. Please visit a hospital immediately!"
        advice_type = "emergency"
    elif risk_level == "moderate":
        warning = "⚡ MODERATE RISK — Monitor your symptoms carefully."
        advice_type = "moderate"
    else:
        warning = "✅ LOW RISK — This appears to be a manageable condition."
        advice_type = "low"

    other_diseases = [{"name": p["disease"], "confidence": f"{int(p['score'] * 100)}%", "risk": p["base_risk"]} for p in all_predictions[1:]]

    return {
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
        "patient_info": {"age": age, "duration_days": duration}
    }

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "diseases_loaded": len(diseases)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)