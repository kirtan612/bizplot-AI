"""
BizPilot AI - Executive Boardroom Meeting Workflow Service.
Orchestrates deterministic boardroom meeting flow:
CFO -> COO -> CMO -> Inter-Executive Q&A -> CEO Strategic Synthesis & Action Items.
"""

from uuid import UUID
from datetime import datetime
import uuid
from typing import Dict, Any, List

from api.executives.context import build_executive_context
from api.executives.cfo.service import CFOExecutive
from api.executives.coo.service import COOExecutive
from api.executives.cmo.service import CMOExecutive
from api.executives.ceo.service import CEOExecutive
from api.executives.schemas import (
    ExecutiveMeetingResponse,
    ExecutiveStatus,
    RiskLevel,
    StrategicDecision,
    ActionItem,
    BoardroomMessage
)

cfo = CFOExecutive()
coo = COOExecutive()
cmo = CMOExecutive()
ceo = CEOExecutive()


def run_executive_meeting(company_id: UUID) -> ExecutiveMeetingResponse:
    """Execute complete deterministic boardroom meeting for company."""
    meeting_id = f"mtg-{uuid.uuid4().hex[:8]}"
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    # 1. Run Executive Analyses
    cfo_res = cfo.analyze(company_id)
    coo_res = coo.analyze(company_id)
    cmo_res = cmo.analyze(company_id)

    # 2. Run CEO Strategic Synthesis
    ceo_res = ceo.analyze(company_id)

    # 3. Build Boardroom Dialogue Messages
    messages: List[BoardroomMessage] = [
        BoardroomMessage(
            from_executive="CEO",
            to_executive="ALL",
            message="Welcome to the Executive Boardroom Sync. Let us review Q2 financial, operational, and retention telemetry.",
            timestamp=now_str
        ),
        BoardroomMessage(
            from_executive="CFO",
            to_executive="ALL",
            message=f"Financial Brief: {cfo_res.summary}",
            timestamp=now_str
        ),
        BoardroomMessage(
            from_executive="COO",
            to_executive="ALL",
            message=f"Operations Brief: {coo_res.summary}",
            timestamp=now_str
        ),
        BoardroomMessage(
            from_executive="CMO",
            to_executive="ALL",
            message=f"Retention Brief: {cmo_res.summary}",
            timestamp=now_str
        )
    ]

    # Inter-executive Q&A messages
    if cfo_res.questions_for_executives:
        cfo_q = cfo_res.questions_for_executives[0]
        coo_ans = coo.ask_question(company_id, "CFO", cfo_q.question)
        messages.append(BoardroomMessage(
            from_executive="CFO",
            to_executive=cfo_q.to_executive,
            message=f"Question: {cfo_q.question}",
            timestamp=now_str
        ))
        messages.append(BoardroomMessage(
            from_executive=cfo_q.to_executive,
            to_executive="CFO",
            message=f"Response: {coo_ans.answer}",
            timestamp=now_str
        ))

    messages.append(BoardroomMessage(
        from_executive="CEO",
        to_executive="ALL",
        message=f"Strategic Synthesis: {ceo_res.summary}",
        timestamp=now_str
    ))

    # 4. Formulate Strategic Decisions & Action Items
    top_risks = [
        f"Financial: Operating profit change {cfo_res.key_findings[0] if cfo_res.key_findings else 'Monitored'}",
        f"Operations: {coo_res.key_findings[0] if coo_res.key_findings else 'Monitored'}",
        f"Retention: {cmo_res.key_findings[0] if cmo_res.key_findings else 'Monitored'}"
    ]

    decisions = [
        StrategicDecision(
            priority=ceo_res.risk_level,
            decision="Establish Vendor Procurement Taskforce to Audit Raw Material COGS Volatility",
            reason="Directly addresses primary profit driver identified by ML Regressor model."
        ),
        StrategicDecision(
            priority=cmo_res.risk_level,
            decision="Authorize Targeted Volume Tier Discounts for Top At-Risk Distributor Accounts",
            reason="Prevents revenue loss across high-value recurring accounts showing 45+ day purchase gaps."
        )
    ]

    actions = [
        ActionItem(
            owner="CFO",
            action="Implement weekly cashflow liquidity tracking and negotiate extended vendor payment terms.",
            target_timeline="Immediate (14 Days)"
        ),
        ActionItem(
            owner="COO",
            action="Consolidate regional steel distributor freight routes to reduce logistics overhead.",
            target_timeline="Within 30 Days"
        ),
        ActionItem(
            owner="CMO",
            action="Initiate direct executive relationship visits to top 6 high-churn risk distributor accounts.",
            target_timeline="Within 7 Days"
        )
    ]

    exec_summaries = {
        "CFO": cfo_res.summary,
        "COO": coo_res.summary,
        "CMO": cmo_res.summary,
        "CEO": ceo_res.summary
    }

    priorities = [p.title for p in ceo_res.priorities] if ceo_res.priorities else ["Margin Optimization", "Retention Stabilization"]

    return ExecutiveMeetingResponse(
        meeting_id=meeting_id,
        organization_id=str(company_id),
        started_at=now_str,
        company_status=ceo_res.status,
        summary=ceo_res.summary,
        top_risks=top_risks,
        executive_summaries=exec_summaries,
        strategic_priorities=priorities,
        decisions=decisions,
        actions=actions,
        messages=messages
    )
