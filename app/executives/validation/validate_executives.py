"""
BizPilot AI - Alias launcher for Phase 6 Executive Layer Validation.
Runnable via: python -m app.executives.validation.validate_executives
"""

import sys
from api.validation.validate_executives import validate_phase_6_executives

if __name__ == "__main__":
    success = validate_phase_6_executives()
    sys.exit(0 if success else 1)
