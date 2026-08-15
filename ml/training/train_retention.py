"""
BizPilot AI - Customer Retention Model Training & Selection Script
"""

import os
import sys
import json
from datetime import datetime
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, RandomizedSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix
)
from sklearn.pipeline import Pipeline

try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/retention"))
os.makedirs(MODELS_DIR, exist_ok=True)
DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/customer_retention.csv"))


def load_and_preprocess_retention_data():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Customer Retention dataset missing at {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    
    # Exclude non-predictive metadata string columns and raw date strings
    exclude_cols = ['customer_id', 'company_id', 'customer_code', 'customer_name', 
                    'city', 'state', 'pincode', 'payment_behavior_tier', 'customer_type',
                    'first_purchase_date', 'last_purchase_date', 'onboarding_date', 'churned']
    
    feature_cols = [c for c in df.columns if c not in exclude_cols]
    
    X = df[feature_cols].copy()
    X = X.select_dtypes(include=[np.number])
    feature_cols = list(X.columns)
    y = df['churned'].copy()
    
    # Fill any missing values if present
    X = X.fillna(0.0)

    # Stratified Train/Val/Test Split (70% Train, 15% Val, 15% Test)
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        X, y, test_size=0.15, stratify=y, random_state=42
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=0.1765, stratify=y_train_val, random_state=42 # 0.1765 * 0.85 approx 15% of total
    )

    return X_train, X_val, X_test, y_train, y_val, y_test, feature_cols, X_train_val, y_train_val


def evaluate_classifier(model, X_eval, y_eval):
    preds = model.predict(X_eval)
    probs = model.predict_proba(X_eval)[:, 1] if hasattr(model, "predict_proba") else preds
    
    acc = accuracy_score(y_eval, preds)
    prec = precision_score(y_eval, preds, zero_division=0)
    rec = recall_score(y_eval, preds, zero_division=0)
    f1 = f1_score(y_eval, preds, zero_division=0)
    
    try:
        roc_auc = roc_auc_score(y_eval, probs)
    except ValueError:
        roc_auc = 0.5
        
    try:
        pr_auc = average_precision_score(y_eval, probs)
    except ValueError:
        pr_auc = 0.0

    return {
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1": round(float(f1), 4),
        "roc_auc": round(float(roc_auc), 4),
        "pr_auc": round(float(pr_auc), 4),
        "confusion_matrix": confusion_matrix(y_eval, preds).tolist()
    }


def train_and_select_retention_model():
    print("=" * 80)
    print("      PROBLEM 1: CUSTOMER RETENTION (BINARY CLASSIFICATION)")
    print("=" * 80)
    
    X_train, X_val, X_test, y_train, y_val, y_test, feature_cols, X_train_val, y_train_val = load_and_preprocess_retention_data()
    print(f"Data Split -> Train: {len(X_train)} | Validation: {len(X_val)} | Test: {len(X_test)}")
    print(f"Feature Count: {len(feature_cols)} | Churn Class Ratio: {y_train_val.mean()*100:.1f}% Positive")

    # Define Candidate Models
    candidates = {
        "Logistic Regression": Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'))
        ]),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'),
    }

    if HAS_XGB:
        candidates["XGBoost"] = XGBClassifier(n_estimators=100, max_depth=4, eval_metric='logloss', random_state=42, scale_pos_weight=4)

    results = {}
    print("\n--- Candidate Models Evaluation on Validation Set ---")
    for name, pipeline in candidates.items():
        pipeline.fit(X_train, y_train)
        metrics = evaluate_classifier(pipeline, X_val, y_val)
        results[name] = {
            "model": pipeline,
            "metrics": metrics
        }
        print(f"  {name:<22} | F1: {metrics['f1']:.4f} | Recall: {metrics['recall']:.4f} | ROC-AUC: {metrics['roc_auc']:.4f} | PR-AUC: {metrics['pr_auc']:.4f}")

    # Select Best Candidate based on F1 score and Recall
    best_name = max(results, key=lambda k: (results[k]['metrics']['f1'], results[k]['metrics']['recall'], results[k]['metrics']['roc_auc']))
    best_candidate = results[best_name]['model']
    print(f"\n[OK] Winner Selected based on Validation Metrics: {best_name}")

    # Hyperparameter Tuning on Train+Val data
    print("\n--- Hyperparameter Tuning on Best Candidate ---")
    if best_name == "XGBoost":
        param_dist = {
            'max_depth': [3, 4, 5, 6],
            'learning_rate': [0.01, 0.05, 0.1, 0.2],
            'n_estimators': [50, 100, 150],
            'subsample': [0.7, 0.8, 1.0],
            'colsample_bytree': [0.7, 0.8, 1.0]
        }
        search = RandomizedSearchCV(
            XGBClassifier(eval_metric='logloss', random_state=42, scale_pos_weight=4),
            param_distributions=param_dist, n_iter=10, cv=StratifiedKFold(n_splits=3),
            scoring='f1', random_state=42
        )
        search.fit(X_train_val, y_train_val)
        final_model = search.best_estimator_
        best_params = search.best_params_
    elif best_name == "Random Forest":
        param_dist = {
            'n_estimators': [50, 100, 150],
            'max_depth': [3, 5, 8, None],
            'min_samples_split': [2, 5, 10]
        }
        search = RandomizedSearchCV(
            RandomForestClassifier(random_state=42, class_weight='balanced'),
            param_distributions=param_dist, n_iter=8, cv=StratifiedKFold(n_splits=3),
            scoring='f1', random_state=42
        )
        search.fit(X_train_val, y_train_val)
        final_model = search.best_estimator_
        best_params = search.best_params_
    else:
        # Logistic Regression
        final_model = best_candidate
        final_model.fit(X_train_val, y_train_val)
        best_params = {"C": 1.0}

    # Final Unbiased Evaluation on Untouched Test Set
    final_test_metrics = evaluate_classifier(final_model, X_test, y_test)
    print("\n===================================================================")
    print(f"      FINAL UNTOUCHED TEST SET METRICS ({best_name})")
    print("===================================================================")
    print(f"  Accuracy:  {final_test_metrics['accuracy']:.4f}")
    print(f"  Precision: {final_test_metrics['precision']:.4f}")
    print(f"  Recall:    {final_test_metrics['recall']:.4f}")
    print(f"  F1 Score:  {final_test_metrics['f1']:.4f}")
    print(f"  ROC-AUC:   {final_test_metrics['roc_auc']:.4f}")
    print(f"  PR-AUC:    {final_test_metrics['pr_auc']:.4f}")
    print(f"  Confusion Matrix: {final_test_metrics['confusion_matrix']}")
    print("===================================================================")

    # Serialize Model & Save Metadata
    model_path = os.path.join(MODELS_DIR, "retention_model_v1.pkl")
    meta_path = os.path.join(MODELS_DIR, "metadata.json")

    joblib.dump(final_model, model_path)
    
    metadata = {
        "model_name": "customer_retention",
        "version": "1.0",
        "algorithm": best_name,
        "features": feature_cols,
        "target": "churned",
        "training_date": datetime.now().isoformat(),
        "dataset_version": "customer_retention_v1",
        "best_params": best_params,
        "validation_metrics": results[best_name]['metrics'],
        "final_test_metrics": final_test_metrics,
        "status": "candidate"
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n  [OK] Saved final model to: {model_path}")
    print(f"  [OK] Saved model metadata to: {meta_path}\n")

    return final_model, metadata, results, X_test, y_test


if __name__ == "__main__":
    train_and_select_retention_model()
