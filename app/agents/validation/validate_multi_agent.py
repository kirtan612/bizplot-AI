"""
BizPilot AI - Alias launcher for Phase 12 Multi-Agent Intelligence Validation.
Runnable via: python -m app.agents.validation.validate_multi_agent
"""

import sys
from api.validation.validate_multi_agent import validate_phase_12_multi_agent

if __name__ == "__main__":
    success = validate_phase_12_multi_agent()
    sys.exit(0 if success else 1)
