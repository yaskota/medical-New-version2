def detect_emergency(symptoms, emergency_list):
    """
    Check if any detected symptoms indicate a medical emergency.
    Returns the list of emergency symptoms found, or empty list if none.
    """
    emergency_found = []
    
    for s in symptoms:
        if s in emergency_list:
            emergency_found.append(s)
    
    return emergency_found