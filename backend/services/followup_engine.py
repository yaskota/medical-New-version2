def get_followup_questions(user_symptoms, followup_data, already_asked=None):
    """
    Generate disease-specific follow-up questions based on detected symptoms.
    
    Args:
        user_symptoms: List of symptoms detected from user input
        followup_data: Dictionary mapping symptoms to their follow-up questions
        already_asked: Set of symptoms already asked about (to avoid duplicates)
    
    Returns:
        List of question objects [{question, symptom}, ...]
    """
    if already_asked is None:
        already_asked = set()

    questions = []
    seen_symptoms = set(user_symptoms) | set(already_asked)

    for symptom in user_symptoms:
        if symptom in followup_data:
            symptom_questions = followup_data[symptom].get("questions", [])

            for q in symptom_questions:
                target_symptom = q["symptom"]

                # Don't ask about symptoms user already has or already asked
                if target_symptom not in seen_symptoms:
                    questions.append({
                        "question": q["question"],
                        "symptom": target_symptom,
                        "source_symptom": symptom
                    })
                    seen_symptoms.add(target_symptom)

    # Limit to a reasonable number of questions (max 5-6)
    return questions[:6]


def get_additional_questions(user_symptoms, diseases, followup_data, already_asked=None):
    """
    If initial follow-up questions weren't enough to narrow down diseases,
    generate additional questions based on candidate disease symptoms.
    
    Uses the disease database to find which unasked symptoms would best
    differentiate between candidate diseases.
    """
    if already_asked is None:
        already_asked = set()

    # Find candidate diseases (any with at least 1 matching symptom)
    candidates = []
    for disease in diseases:
        for s in user_symptoms:
            if s in disease["symptoms"]:
                candidates.append(disease)
                break

    if not candidates:
        return []

    # Count how many candidate diseases each unasked symptom appears in
    symptom_frequency = {}
    seen = set(user_symptoms) | set(already_asked)

    for disease in candidates:
        for s in disease["symptoms"]:
            if s not in seen:
                if s not in symptom_frequency:
                    symptom_frequency[s] = 0
                symptom_frequency[s] += 1

    if not symptom_frequency:
        return []

    # Sort by frequency (most discriminating symptoms first)
    sorted_symptoms = sorted(symptom_frequency.items(), key=lambda x: x[1], reverse=True)

    # Generate questions for top discriminating symptoms
    questions = []
    for symptom, freq in sorted_symptoms[:4]:
        questions.append({
            "question": f"Do you have {symptom.replace('_', ' ')}?",
            "symptom": symptom,
            "source_symptom": "disease_analysis"
        })

    return questions