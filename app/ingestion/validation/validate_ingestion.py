"""
BizPilot AI - Alias launcher for Phase 7 Enterprise Data Ingestion Validation.
Runnable via: python -m app.ingestion.validation.validate_ingestion
"""

import sys
from api.validation.validate_ingestion import validate_phase_7_ingestion

if __name__ == "__main__":
    success = validate_phase_7_ingestion()
    sys.exit(0 if success else 1)
