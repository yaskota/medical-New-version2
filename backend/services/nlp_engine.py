import re

STOPWORDS = {
    "i", "am", "have", "has", "had", "the", "a", "an", "and", "or",
    "is", "are", "was", "were", "in", "on", "at", "my", "me", "to",
    "it", "do", "does", "did", "be", "been", "being", "of", "for",
    "with", "that", "this", "from", "but", "not", "so", "if", "got",
    "get", "getting", "some", "really", "very", "too", "also", "just",
    "feel", "feeling", "lot", "lots", "like", "since", "been", "having",
    "experiencing", "suffer", "suffering", "there", "think", "lately",
    "recently", "days", "day", "morning", "night", "today", "yesterday",
    "sometimes", "often", "always", "keep", "keeps", "can", "cant",
    "cannot", "much", "many", "little", "bit", "quite", "pretty"
}

# Multi-word symptom phrases to detect before tokenization
MULTI_WORD_SYMPTOMS = {
    "chest pain": "chest_pain",
    "body pain": "body_pain",
    "muscle pain": "body_pain",
    "body ache": "body_pain",
    "sore throat": "sore_throat",
    "throat pain": "sore_throat",
    "stomach pain": "stomach_pain",
    "stomach ache": "stomach_pain",
    "tummy pain": "stomach_pain",
    "belly pain": "stomach_pain",
    "abdominal pain": "stomach_pain",
    "runny nose": "runny_nose",
    "running nose": "runny_nose",
    "blocked nose": "nasal_congestion",
    "stuffy nose": "nasal_congestion",
    "nose block": "nasal_congestion",
    "joint pain": "joint_pain",
    "head pain": "headache",
    "head ache": "headache",
    "eye pain": "eye_pain",
    "back pain": "back_pain",
    "lower back pain": "back_pain",
    "burning chest": "burning_chest",
    "chest burning": "burning_chest",
    "loss of smell": "loss_of_smell",
    "cant smell": "loss_of_smell",
    "loss of taste": "loss_of_taste",
    "cant taste": "loss_of_taste",
    "blurred vision": "blurred_vision",
    "difficulty breathing": "difficulty_breathing",
    "shortness of breath": "difficulty_breathing",
    "breathing problem": "difficulty_breathing",
    "cant breathe": "difficulty_breathing",
    "red eyes": "red_eyes",
    "pink eye": "red_eyes",
    "itchy eyes": "itchy_eyes",
    "watery eyes": "watery_eyes",
    "itchy skin": "itchy_skin",
    "skin rash": "rash",
    "red spots": "rash",
    "burning urination": "burning_urination",
    "painful urination": "burning_urination",
    "frequent urination": "frequent_urination",
    "rapid heartbeat": "rapid_heartbeat",
    "heart racing": "rapid_heartbeat",
    "fast heartbeat": "rapid_heartbeat",
    "weight loss": "weight_loss",
    "losing weight": "weight_loss",
    "facial pain": "facial_pain",
    "face pain": "facial_pain",
    "sinus pain": "facial_pain",
    "loose motions": "diarrhea",
    "loose stools": "diarrhea",
    "light sensitivity": "light_sensitivity",
    "sensitive to light": "light_sensitivity",
    "sound sensitivity": "sound_sensitivity",
    "sensitive to sound": "sound_sensitivity",
    "acid reflux": "acidity",
    "gas trouble": "acidity",
    "no appetite": "loss_of_appetite",
    "not hungry": "loss_of_appetite",
    "lost appetite": "loss_of_appetite",
    "cant sleep": "insomnia",
    "no sleep": "insomnia",
    "sleep problem": "insomnia",
    "high temperature": "fever",
    "low energy": "fatigue",
    "very tired": "fatigue",
    "feel weak": "fatigue",
    "throwing up": "vomiting",
    "feeling sick": "nausea",
    "feel like vomiting": "nausea",
}


def clean_text(text):
    """Clean and normalize text input."""
    text = text.lower().strip()
    # Replace common punctuation but keep spaces
    text = re.sub(r'[^a-z\s]', ' ', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_multi_word(text):
    """Extract multi-word symptom phrases from text."""
    found = []
    remaining = text
    
    # Sort by length (longest first) to match longer phrases first
    sorted_phrases = sorted(MULTI_WORD_SYMPTOMS.keys(), key=len, reverse=True)
    
    for phrase in sorted_phrases:
        if phrase in remaining:
            found.append(MULTI_WORD_SYMPTOMS[phrase])
            remaining = remaining.replace(phrase, " ")
    
    return found, remaining


def tokenize(text):
    """Split text into tokens."""
    return [t for t in text.split() if t]


def remove_stopwords(tokens):
    """Remove common stop words."""
    return [t for t in tokens if t not in STOPWORDS]


def extract_tokens(text):
    """
    Main extraction function.
    First extracts multi-word symptoms, then tokenizes remaining text.
    Returns a list of normalized symptom tokens.
    """
    text = clean_text(text)
    
    # Step 1: Extract multi-word symptom phrases
    multi_word_symptoms, remaining_text = extract_multi_word(text)
    
    # Step 2: Tokenize remaining text
    tokens = tokenize(remaining_text)
    tokens = remove_stopwords(tokens)
    
    # Combine multi-word extractions with single-word tokens
    all_tokens = multi_word_symptoms + tokens
    
    return list(set(all_tokens))