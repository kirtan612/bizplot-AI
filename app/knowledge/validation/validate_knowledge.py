"""
BizPilot AI - Alias launcher for Phase 10 Company Knowledge Layer Validation.
Runnable via: python -m app.knowledge.validation.validate_knowledge
"""

import sys
from api.validation.validate_knowledge import validate_phase_10_knowledge

if __name__ == "__main__":
    success = validate_phase_10_knowledge()
    sys.exit(0 if success else 1)
