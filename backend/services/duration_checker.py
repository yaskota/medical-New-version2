def check_duration(duration):
    """Classify symptom duration into risk levels."""
    if duration is None:
        return "unknown"
    
    duration = int(duration)
    
    if duration <= 2:
        return "mild"
    elif duration <= 5:
        return "moderate"
    elif duration <= 10:
        return "serious"
    else:
        return "critical"
