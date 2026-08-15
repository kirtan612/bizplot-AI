"""
BizPilot AI - Inter-Executive Collaboration Q&A Service.
Enables structured question and answer exchanges between executives (CFO <-> COO <-> CMO <-> CEO).
"""

from uuid import UUID
from typing import Dict, Any
from api.executives.schemas import ExecutiveQuestionRequest, ExecutiveQuestionResponse
from api.executives.cfo.service import CFOExecutive
from api.executives.coo.service import COOExecutive
from api.executives.cmo.service import CMOExecutive
from api.executives.ceo.service import CEOExecutive

_EXECUTIVES = {
    "CFO": CFOExecutive(),
    "COO": COOExecutive(),
    "CMO": CMOExecutive(),
    "CEO": CEOExecutive(),
}


def process_executive_question(company_id: UUID, req: ExecutiveQuestionRequest) -> ExecutiveQuestionResponse:
    """Route inter-executive question to the target executive service."""
    to_role = req.to_role.upper()
    exec_instance = _EXECUTIVES.get(to_role)
    if not exec_instance:
        exec_instance = _EXECUTIVES["CEO"]

    return exec_instance.ask_question(company_id, req.from_role, req.question)
