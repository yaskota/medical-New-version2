def calculate_gini(group_size):
    """
    Calculate Gini Impurity for a group of unique diseases.
    Since each candidate disease is a unique outcome, the probability 
    of any single disease is 1 / group_size.
    """
    if group_size <= 0: return 0.0
    return 1.0 - (1.0 / group_size)

def get_smart_followup_questions(confirmed_symptoms, denied_symptoms, diseases_db, followup_dict, already_asked=None):
    """
    Uses Information Gain (Gini Impurity) to determine the mathematical 
    best next symptom to ask the user, halving the candidate diseases efficiently.
    """
    if already_asked is None:
        already_asked = set()
        
    seen_symptoms = set(confirmed_symptoms) | set(denied_symptoms) | set(already_asked)
    
    # 1. Identify Candidate Diseases
    candidates = []
    for disease in diseases_db:
        disease_symptoms = set(disease.get("symptoms", []))
        
        if not confirmed_symptoms:
            candidates.append(disease)
        else:
            # Only consider diseases that match at least one confirmed symptom
            # AND do not contain symptoms the user explicitly denied.
            if disease_symptoms.intersection(set(confirmed_symptoms)):
                candidates.append(disease)
                
    if not candidates:
        candidates = diseases_db  # Fallback to all if no overlap
        
    N = len(candidates)
    if N <= 1:
        return [] # Perfect confidence achieved, no more questions needed
        
    # 2. Gather all unasked symptoms from these candidate diseases
    symptom_counts = {}
    for disease in candidates:
        for sym in disease.get("symptoms", []):
            if sym not in seen_symptoms:
                symptom_counts[sym] = symptom_counts.get(sym, 0) + 1
                
    if not symptom_counts:
        return []
        
    # 3. Calculate Information Gain for each symptom
    parent_gini = calculate_gini(N)
    symptom_ig = []
    
    for sym, count_yes in symptom_counts.items():
        count_no = N - count_yes
        
        weight_yes = count_yes / N
        weight_no = count_no / N
        
        # Gini of the two resulting branches
        gini_yes = calculate_gini(count_yes)
        gini_no = calculate_gini(count_no)
        
        # Calculate Information Gain
        expected_child_gini = (weight_yes * gini_yes) + (weight_no * gini_no)
        info_gain = parent_gini - expected_child_gini
        
        symptom_ig.append((sym, info_gain))
        
    # 4. Sort symptoms by highest Information Gain
    symptom_ig.sort(key=lambda x: x[1], reverse=True)
    
    # 5. Format the best questions
    questions = []
    for sym, ig in symptom_ig[:5]: # Top 5 mathematically optimal questions
        natural_question = None
        
        # Try to pull a human-sounding question from the JSON
        for source, data in followup_dict.items():
            for q in data.get("questions", []):
                if q["symptom"] == sym:
                    natural_question = q["question"]
                    break
            if natural_question:
                break
        
        # Fallback if no natural question exists in the JSON
        if not natural_question:
            natural_name = sym.replace("_", " ")
            natural_question = f"Are you experiencing any {natural_name}?"
            
        questions.append({
            "question": natural_question,
            "symptom": sym,
            "info_gain": round(ig, 3) # Stored for debugging/logging
        })
        
    return questions