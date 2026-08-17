"""
BizPilot AI - Alias launcher for Phase 8 Data Normalization Validation.
Runnable via: python -m app.normalization.validation.validate_normalization
"""

import sys
from api.validation.validate_normalization import validate_phase_8_normalization

if __name__ == "__main__":
    success = validate_phase_8_normalization()
    sys.exit(0 if success else 1)
