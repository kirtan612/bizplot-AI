"""
BizPilot AI - Alias launcher for Phase 9 Enterprise Security Audit.
Runnable via: python -m app.security.validation.run_security_audit
"""

import sys
from api.validation.validate_security import validate_phase_9_security

if __name__ == "__main__":
    success = validate_phase_9_security()
    sys.exit(0 if success else 1)
