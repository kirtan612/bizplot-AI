"""
BizPilot AI - Centralized Model Loader & Registry Service.

Provides in-memory cached loading of Phase 3 trained models and metadata.
Models are loaded once into memory on application startup / first access and retained.
API requests invoke in-memory inference without loading from disk per request.
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, Tuple, Optional
import joblib

logger = logging.getLogger("bizpilot.ai.model_loader")

# Base directory paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
ML_MODELS_DIR = PROJECT_ROOT / "ml" / "models"

# In-memory global model cache
_MODEL_CACHE: Dict[str, Any] = {}
_METADATA_CACHE: Dict[str, Dict[str, Any]] = {}


def get_model_path_and_meta(model_key: str) -> Tuple[Path, Path]:
    """
    Resolves directory paths for a given model key ('retention', 'profit', 'cashflow').
    """
    model_dir = ML_MODELS_DIR / model_key
    if model_key == "retention":
        model_file = model_dir / "retention_model_v1.pkl"
    elif model_key == "profit":
        model_file = model_dir / "profit_model_v1.pkl"
    elif model_key == "cashflow":
        model_file = model_dir / "cashflow_model_v1.pkl"
    else:
        model_file = model_dir / f"{model_key}_model_v1.pkl"

    meta_file = model_dir / "metadata.json"
    return model_file, meta_file


def is_model_available(model_key: str) -> bool:
    """
    Checks if model pickle and metadata files exist and are readable.
    """
    model_file, meta_file = get_model_path_and_meta(model_key)
    return model_file.exists() and meta_file.exists() and model_file.stat().st_size > 0


def load_model(model_key: str) -> Tuple[Any, Dict[str, Any]]:
    """
    Loads and caches in memory a serialized model and its associated metadata JSON.
    Returns (model_object, metadata_dict).
    """
    if model_key in _MODEL_CACHE and model_key in _METADATA_CACHE:
        return _MODEL_CACHE[model_key], _METADATA_CACHE[model_key]

    model_file, meta_file = get_model_path_and_meta(model_key)

    if not model_file.exists():
        raise FileNotFoundError(f"Model file for '{model_key}' not found at {model_file}")

    if not meta_file.exists():
        raise FileNotFoundError(f"Metadata file for '{model_key}' not found at {meta_file}")

    try:
        model = joblib.load(model_file)
        with open(meta_file, "r", encoding="utf-8") as f:
            metadata = json.load(f)

        _MODEL_CACHE[model_key] = model
        _METADATA_CACHE[model_key] = metadata
        logger.info(f"Loaded AI Model '{model_key}' ({metadata.get('algorithm', 'Unknown')}) into memory.")
        return model, metadata
    except Exception as e:
        logger.error(f"Failed to load AI Model '{model_key}': {e}")
        raise RuntimeError(f"Failed to load AI Model '{model_key}': {e}") from e


def preload_all_models():
    """
    Preloads all available Phase 3 models into memory on application startup.
    """
    for key in ["retention", "profit", "cashflow"]:
        if is_model_available(key):
            try:
                load_model(key)
            except Exception as e:
                logger.warning(f"Could not preload model '{key}': {e}")


def get_model_registry_info() -> Dict[str, Any]:
    """
    Returns runtime metadata summary for all production models in registry.
    """
    registry = {}
    for key in ["retention", "profit", "cashflow"]:
        if is_model_available(key):
            _, meta = load_model(key)
            registry[key] = {
                "model_name": meta.get("model_name", key),
                "version": meta.get("version", "1.0"),
                "algorithm": meta.get("algorithm", "Unknown"),
                "dataset_version": meta.get("dataset_version", "v1"),
                "training_date": meta.get("training_date"),
                "status": "production",
                "test_metrics": meta.get("final_test_metrics", {})
            }
        else:
            registry[key] = {
                "model_name": key,
                "status": "unavailable",
                "message": f"Artifact for '{key}' missing."
            }
    return registry
