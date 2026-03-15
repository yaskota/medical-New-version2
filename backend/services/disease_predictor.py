import json
import os
import random
from collections import Counter

# 1. SCRATCH IMPLEMENTATION OF DECISION TREE
class Node:
    def __init__(self, feature_index=None, threshold=None, left=None, right=None, value=None):
        self.feature_index = feature_index  # Index of symptom
        self.threshold = threshold          # 0.5 (doesn't have / has symptom)
        self.left = left                    # Left child Node
        self.right = right                  # Right child Node
        self.value = value                  # Disease prediction (only for leaf nodes)

class ScratchDecisionTree:
    def __init__(self, min_samples_split=2, max_depth=10):
        self.min_samples_split = min_samples_split
        self.max_depth = max_depth
        self.root = None

    def fit(self, X, Y):
        self.root = self._build_tree(X, Y, 0)

    def _build_tree(self, X, Y, depth):
        num_samples = len(X)
        num_features = len(X[0]) if num_samples > 0 else 0

        # Base cases for recursion
        if num_samples >= self.min_samples_split and depth <= self.max_depth:
            best_split = self._get_best_split(X, Y, num_features)
            if best_split and best_split.get("info_gain", 0) > 0:
                left_subtree = self._build_tree(best_split["X_left"], best_split["Y_left"], depth + 1)
                right_subtree = self._build_tree(best_split["X_right"], best_split["Y_right"], depth + 1)
                return Node(best_split["feature_index"], best_split["threshold"], left_subtree, right_subtree)

        # Leaf Node
        leaf_value = self._calculate_leaf_value(Y)
        return Node(value=leaf_value)

    def _get_best_split(self, X, Y, num_features):
        best_split = {}
        max_info_gain = -float("inf")

        for feature_index in range(num_features):
            threshold = 0.5
            X_left, Y_left, X_right, Y_right = self._split(X, Y, feature_index, threshold)
            
            if len(X_left) > 0 and len(X_right) > 0:
                y_parent = Y
                info_gain = self._information_gain(y_parent, Y_left, Y_right)
                
                if info_gain > max_info_gain:
                    best_split = {
                        "feature_index": feature_index,
                        "threshold": threshold,
                        "X_left": X_left, "Y_left": Y_left,
                        "X_right": X_right, "Y_right": Y_right,
                        "info_gain": info_gain
                    }
                    max_info_gain = info_gain
        return best_split

    def _split(self, X, Y, feature_index, threshold):
        X_left, Y_left, X_right, Y_right = [], [], [], []
        for i in range(len(X)):
            if X[i][feature_index] <= threshold:
                X_left.append(X[i])
                Y_left.append(Y[i])
            else:
                X_right.append(X[i])
                Y_right.append(Y[i])
        return X_left, Y_left, X_right, Y_right

    def _information_gain(self, parent, l_child, r_child):
        weight_l = len(l_child) / len(parent)
        weight_r = len(r_child) / len(parent)
        gain = self._gini(parent) - (weight_l * self._gini(l_child) + weight_r * self._gini(r_child))
        return gain

    def _gini(self, Y):
        classes = list(set(Y))
        gini = 1.0
        for cls in classes:
            p = Y.count(cls) / len(Y)
            gini -= p ** 2
        return gini

    def _calculate_leaf_value(self, Y):
        if not Y: return None
        Y = list(Y)
        return max(set(Y), key=Y.count)

    def predict(self, X):
        return [self._make_prediction(x, self.root) for x in X]

    def _make_prediction(self, x, tree):
        if tree.value is not None: return tree.value
        feature_val = x[tree.feature_index]
        if feature_val <= tree.threshold:
            return self._make_prediction(x, tree.left)
        else:
            return self._make_prediction(x, tree.right)

# ==========================================
# 2. SCRATCH IMPLEMENTATION OF RANDOM FOREST
# ==========================================
class ScratchRandomForest:
    def __init__(self, n_trees=10, min_samples_split=2, max_depth=10):
        self.n_trees = n_trees
        self.min_samples_split = min_samples_split
        self.max_depth = max_depth
        self.trees = []

    def fit(self, X, Y):
        self.trees = []
        for _ in range(self.n_trees):
            tree = ScratchDecisionTree(min_samples_split=self.min_samples_split, max_depth=self.max_depth)
            X_sample, Y_sample = self._bootstrap_sample(X, Y)
            tree.fit(X_sample, Y_sample)
            self.trees.append(tree)

    def _bootstrap_sample(self, X, Y):
        n_samples = len(X)
        X_sample, Y_sample = [], []
        for _ in range(n_samples):
            idx = random.randint(0, n_samples - 1)
            X_sample.append(X[idx])
            Y_sample.append(Y[idx])
        return X_sample, Y_sample

    def predict_proba(self, X):
        tree_preds = [tree.predict(X) for tree in self.trees]
        tree_preds = list(map(list, zip(*tree_preds)))
        
        probabilities = []
        for preds in tree_preds:
            counts = Counter(preds)
            total = len(preds)
            prob_dict = {disease: (count / total) * 100 for disease, count in counts.items()}
            probabilities.append(prob_dict)
        return probabilities

# ==========================================
# 3. INTEGRATION WITH YOUR FLASK SYSTEM
# ==========================================
class CustomDiseasePredictor:
    def __init__(self):
        self.model = ScratchRandomForest(n_trees=15, max_depth=15)
        self.all_symptoms = []
        self.diseases_dict = {}
        self.is_trained = False
        
        self._load_and_train()

    def _load_and_train(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.join(base_dir, 'datasets', 'diseases.json')
        
        with open(db_path, 'r', encoding="utf-8") as f:
            diseases_db = json.load(f)

        # Create a dictionary map for easy lookup during prediction
        self.diseases_dict = {d["disease"]: d for d in diseases_db}

        # Extract all unique symptoms
        symptom_set = set()
        for data in diseases_db:
            for symptom in data.get("symptoms", []):
                symptom_set.add(symptom)
        
        self.all_symptoms = sorted(list(symptom_set))
        
        X_train = []
        Y_train = []
        
        for data in diseases_db:
            disease_name = data.get("disease")
            disease_symptoms = data.get("symptoms", [])
            
            # Perfect patient
            perfect_vector = [1 if sym in disease_symptoms else 0 for sym in self.all_symptoms]
            X_train.append(perfect_vector)
            Y_train.append(disease_name)
            
            # Synthetic partial patients
            for _ in range(5): 
                partial_vector = []
                for sym in self.all_symptoms:
                    if sym in disease_symptoms:
                        partial_vector.append(1 if random.random() > 0.3 else 0)
                    else:
                        partial_vector.append(0)
                X_train.append(partial_vector)
                Y_train.append(disease_name)

        self.model.fit(X_train, Y_train)
        self.is_trained = True

    def predict(self, extracted_symptoms):
        if not self.is_trained or not extracted_symptoms:
            return []

        user_vector = [1 if sym in extracted_symptoms else 0 for sym in self.all_symptoms]
        probabilities = self.model.predict_proba([user_vector])[0]
        
        results = []
        for disease_name, prob in probabilities.items():
            if prob > 0:
                disease_data = self.diseases_dict.get(disease_name, {})
                matched = [s for s in extracted_symptoms if s in disease_data.get("symptoms", [])]
                
                # Format to match exactly what app.py expects
                results.append({
                    "disease": disease_name,
                    "score": prob / 100.0,  # app.py expects a float between 0 and 1
                    "match_count": len(matched),
                    "total_symptoms": len(disease_data.get("symptoms", [])),
                    "matched_symptoms": matched,
                    "precautions": disease_data.get("precautions", []),
                    "home_remedies": disease_data.get("home_remedies", []),
                    "medicines": disease_data.get("medicines", []),
                    "base_risk": disease_data.get("base_risk", "moderate"),
                    "category": disease_data.get("category", "general")
                })
        
        results = sorted(results, key=lambda x: x["score"], reverse=True)
        return results[:3]

# Export singleton instance
predictor_instance = CustomDiseasePredictor()

# Function matching the exact signature imported in app.py
def predict_disease(symptoms, diseases=None):
    # We ignore the passed 'diseases' list and use our custom trained model
    return predictor_instance.predict(symptoms)