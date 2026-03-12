def analyze_risk(disease_result, age, duration, age_rules, duration_rules):
    """
    Comprehensive risk analysis based on:
    - Disease base risk level
    - Patient age (children and elderly are higher risk)
    - Duration of symptoms
    - Disease-specific age thresholds
    
    Returns: risk_level ('low', 'moderate', 'high'), risk_factors list
    """
    risk_score = 0
    risk_factors = []

    # 1. Base disease risk
    base_risk = disease_result.get("base_risk", "moderate")
    if base_risk == "low":
        risk_score += 1
    elif base_risk == "moderate":
        risk_score += 2
    elif base_risk == "high":
        risk_score += 3
    
    risk_factors.append(f"Base disease risk: {base_risk}")

    # 2. Symptom match confidence
    score = disease_result.get("score", 0)
    if score >= 0.7:
        risk_score += 1
        risk_factors.append(f"High symptom match ({int(score * 100)}%)")

    # 3. Duration analysis
    if duration is not None:
        if duration <= 2:
            risk_factors.append("Recent onset (1-2 days) — likely early stage")
        elif duration <= 5:
            risk_score += 1
            risk_factors.append(f"Symptoms for {duration} days — moderate duration")
        elif duration <= 10:
            risk_score += 2
            risk_factors.append(f"Symptoms for {duration} days — prolonged illness")
        else:
            risk_score += 3
            risk_factors.append(f"Symptoms for {duration} days — critical duration, needs immediate attention")

    # 4. Age-based risk
    if age is not None:
        # Check general age vulnerability
        high_risk_ages = age_rules.get("high_risk_ages", {})
        
        child_range = high_risk_ages.get("child", {})
        elderly_range = high_risk_ages.get("elderly", {})
        
        if child_range and child_range.get("min", 0) <= age <= child_range.get("max", 5):
            risk_score += 2
            risk_factors.append(f"Young child (age {age}) — higher vulnerability")
        elif elderly_range and age >= elderly_range.get("min", 60):
            risk_score += 2
            risk_factors.append(f"Elderly patient (age {age}) — higher vulnerability")

        # Check disease-specific age risks
        disease_name = disease_result.get("disease", "")
        disease_age_risks = age_rules.get("disease_age_risks", [])
        
        for rule in disease_age_risks:
            if rule["disease"] == disease_name and age >= rule.get("risk_age", 999):
                risk_score += 1
                risk_factors.append(f"Age {age} exceeds risk threshold ({rule['risk_age']}) for {disease_name}")

    # Determine final risk level
    if risk_score >= 6:
        risk_level = "high"
    elif risk_score >= 3:
        risk_level = "moderate"
    else:
        risk_level = "low"

    return risk_level, risk_factors


def check_duration_risk(duration):
    """Simple duration risk classification."""
    if duration is None:
        return "unknown"
    if duration <= 2:
        return "mild"
    elif duration <= 5:
        return "moderate"
    elif duration <= 10:
        return "serious"
    else:
        return "critical"