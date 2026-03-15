import os
import json
import spacy
import re  # <--- NEW: Regular Expressions module
from spacy.util import is_package
from spacy.cli import download
from thefuzz import process, fuzz

if not is_package("en_core_web_sm"):
    download("en_core_web_sm")

class MedicalNLP:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.vocab = {}
        self._load_vocab()
        
        self.negation_words = {
            "no", "not", "dont", "do not", "never", "without", 
            "deny", "denies", "none", "zero", "cant", "cannot"
        }

    def _load_vocab(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        syn_path = os.path.join(base_dir, 'datasets', 'symptom_synonyms.json')
        with open(syn_path, 'r', encoding='utf-8') as f:
            synonyms_db = json.load(f)

        for standard_symptom, syn_list in synonyms_db.items():
            self.vocab[standard_symptom.replace("_", " ")] = standard_symptom
            for syn in syn_list:
                self.vocab[syn.lower()] = standard_symptom

    def extract_symptoms(self, text):
        """
        Extracts symptoms, handles typos, detects negations,
        AND automatically extracts Age and Duration.
        """
        text_lower = text.lower().strip()
        doc = self.nlp(text_lower)
        
        # ==========================================
        # NEW: EXTRACT AGE AND DURATION FROM CONTEXT
        # ==========================================
        age = None
        duration_days = None
        
        # 1. Look for Age (e.g., "25 years old", "age 25", "i am 25", "25 y/o")
        age_match = re.search(r'\b(?:age\s*|i am\s*|i\'m\s*)?(\d{1,3})\s*(?:years?\s*old|y/o|yo)?\b', text_lower)
        if age_match:
            try:
                parsed_age = int(age_match.group(1))
                if 0 < parsed_age < 120:  # Sanity check
                    age = parsed_age
            except ValueError:
                pass

        # 2. Look for Duration (e.g., "3 days", "1 week", "2 months")
        duration_match = re.search(r'\b(\d+)\s*(day|week|month|year)s?\b', text_lower)
        if duration_match:
            try:
                num = int(duration_match.group(1))
                unit = duration_match.group(2)
                if unit == 'day': duration_days = num
                elif unit == 'week': duration_days = num * 7
                elif unit == 'month': duration_days = num * 30
                elif unit == 'year': duration_days = num * 365
            except ValueError:
                pass
        
        # 3. Fallback duration words if regex misses
        if duration_days is None:
            if 'yesterday' in text_lower: duration_days = 1
            elif 'today' in text_lower: duration_days = 0
            elif 'a week' in text_lower: duration_days = 7
            elif 'a month' in text_lower: duration_days = 30

        # ==========================================
        # EXISTING SYMPTOM EXTRACTION
        # ==========================================
        phrases = []
        for chunk in doc.noun_chunks:
            phrases.append((chunk.text, chunk.root.i))
            
        for token in doc:
            if token.pos_ in ["ADJ", "VERB", "NOUN"] and token.text not in [p[0] for p in phrases]:
                phrases.append((token.text, token.i))

        confirmed = set()
        denied = set()
        vocab_keys = list(self.vocab.keys())

        for phrase, root_index in phrases:
            match = process.extractOne(phrase, vocab_keys, scorer=fuzz.token_set_ratio)
            if match and match[1] >= 80:
                matched_symptom = self.vocab[match[0]]
                if self._check_negation(doc, root_index):   
                    denied.add(matched_symptom)
                else:
                    if matched_symptom not in denied:
                        confirmed.add(matched_symptom)
        
        # WE NOW RETURN 4 VALUES!
        return list(confirmed), list(denied), age, duration_days

    def _check_negation(self, doc, token_index):
        token = doc[token_index]
        for child in token.children:
            if child.dep_ == "neg" or child.text in self.negation_words: return True
        for ancestor in token.ancestors:
            if ancestor.lemma_ in ["have", "feel", "experience", "suffer"]:
                for child in ancestor.children:
                    if child.dep_ == "neg" or child.text in self.negation_words: return True
        start = max(0, token_index - 3)
        preceding_tokens = [t.text for t in doc[start:token_index]]
        if any(neg in preceding_tokens for neg in self.negation_words): return True
        return False

nlp_engine = MedicalNLP()

def extract_symptoms(text):
    return nlp_engine.extract_symptoms(text)