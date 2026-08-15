"""
BizPilot AI - Alias launcher for Phase 4 AI API Validation.
Runnable via: python -m app.ai.validation.validate_ai_api
"""

import sys
from api.validation.validate_ai_api import validate_phase_4_ai_api

if __name__ == "__main__":
    success = validate_phase_4_ai_api()
    sys.exit(0 if success else 1)
