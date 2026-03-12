def predict_disease(symptoms, diseases):
    """
    Match user symptoms against disease database.
    Returns top diseases ranked by match score.
    Only includes diseases that meet minimum match threshold.
    """
    if not symptoms:
        return []

    results = []

    for disease in diseases:
        disease_symptoms = disease["symptoms"]
        min_match = disease.get("min_match", 2)

        # Count matching symptoms
        matched = [s for s in symptoms if s in disease_symptoms]
        match_count = len(matched)

        if match_count == 0:
            continue

        # Calculate confidence score (0 to 1)
        score = match_count / len(disease_symptoms)

        # Only include if minimum match is met
        if match_count >= min_match or score >= 0.4:
            results.append({
                "disease": disease["disease"],
                "score": round(score, 2),
                "match_count": match_count,
                "total_symptoms": len(disease_symptoms),
                "matched_symptoms": matched,
                "precautions": disease.get("precautions", []),
                "home_remedies": disease.get("home_remedies", []),
                "medicines": disease.get("medicines", []),
                "base_risk": disease.get("base_risk", "moderate"),
                "category": disease.get("category", "general")
            })

    # Sort by score (highest first)
    results.sort(key=lambda x: x["score"], reverse=True)

    # Return top 3 matches
    return results[:3]