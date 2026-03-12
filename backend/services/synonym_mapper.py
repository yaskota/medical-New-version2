def normalize_symptoms(tokens, synonyms):
    """
    Map user tokens to standardized symptom names using synonym dictionary.
    A token can match either the symptom key itself or any of its synonyms.
    """
    normalized = set()

    for token in tokens:
        # Check if token is already a standard symptom name
        if token in synonyms:
            normalized.add(token)
            continue

        # Check if token matches any synonym value
        for symptom, synonym_list in synonyms.items():
            if token in synonym_list:
                normalized.add(symptom)
                break
        else:
            # If token doesn't match any synonym, keep it as-is
            # (it might already be a valid symptom from multi-word extraction)
            normalized.add(token)

    return list(normalized)