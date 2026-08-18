"""
BizPilot AI - Alias launcher for Phase 11 RAG & Knowledge Retrieval Validation.
Runnable via: python -m app.rag.validation.validate_rag
"""

import sys
from api.validation.validate_rag import validate_phase_11_rag

if __name__ == "__main__":
    success = validate_phase_11_rag()
    sys.exit(0 if success else 1)
