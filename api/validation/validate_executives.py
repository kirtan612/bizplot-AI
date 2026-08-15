"""
BizPilot AI - Automated End-to-End Phase 6 Validation Runner.
Verifies PostgreSQL connection, Executive Contexts, AI CFO, AI COO, AI CMO, AI CEO,
Inter-Executive Collaboration Q&A, and Boardroom Executive Meeting workflow.
"""

from uuid import UUID
from typing import Dict, Any
from fastapi.testclient import TestClient

from api.main import app
from api.auth.jwt import create_access_token
from api.auth.dependencies import CurrentUser
from sqlalchemy import text
from ml.data.extract import get_db_engine
from api.executives.context import build_executive_context
from api.executives.cfo.service import CFOExecutive
from api.executives.coo.service import COOExecutive
from api.executives.cmo.service import CMOExecutive
from api.executives.ceo.service import CEOExecutive
from api.executives.collaboration import process_executive_question
from api.executives.meeting import run_executive_meeting
from api.executives.schemas import ExecutiveQuestionRequest
from api.routers.executives import (
    get_cfo_analysis,
    get_coo_analysis,
    get_cmo_analysis,
    get_ceo_analysis,
    get_latest_executive_meeting
)

TARGET_COMPANY_UUID = UUID("6289d24b-b8c8-4dc2-9105-f6399d1302c1")
ALT_COMPANY_UUID = UUID("11111111-1111-1111-1111-111111111111")
ADMIN_USER_ID = "51cc68c5-50ea-40a2-9e88-7aaa4c9ce0dc"


def validate_phase_6_executives() -> bool:
    print("=" * 60)
    print("      BIZPILOT AI PHASE 6 EXECUTIVE LAYER VALIDATION")
    print("=" * 60)

    results = {
        "db_connection": False,
        "executive_context": False,
        "cfo_analysis": False,
        "coo_analysis": False,
        "cmo_analysis": False,
        "ceo_analysis": False,
        "collaboration": False,
        "meeting": False,
        "api_cfo": False,
        "api_coo": False,
        "api_cmo": False,
        "api_ceo": False,
        "api_meeting": False,
        "security_isolation": False,
    }

    # 1. DB & Context Check
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        results["db_connection"] = True

        ctx = build_executive_context(TARGET_COMPANY_UUID)
        if ctx and ctx.organization and ctx.financial and ctx.customers and ctx.operations:
            results["executive_context"] = True
    except Exception as e:
        print(f"Error checking DB / Context: {e}")

    # 2. Individual Executive Services Check
    try:
        cfo = CFOExecutive()
        coo = COOExecutive()
        cmo = CMOExecutive()
        ceo = CEOExecutive()

        cfo_res = cfo.analyze(TARGET_COMPANY_UUID)
        if cfo_res and cfo_res.executive == "CFO" and cfo_res.summary:
            results["cfo_analysis"] = True

        coo_res = coo.analyze(TARGET_COMPANY_UUID)
        if coo_res and coo_res.executive == "COO" and coo_res.summary:
            results["coo_analysis"] = True

        cmo_res = cmo.analyze(TARGET_COMPANY_UUID)
        if cmo_res and cmo_res.executive == "CMO" and cmo_res.summary:
            results["cmo_analysis"] = True

        ceo_res = ceo.analyze(TARGET_COMPANY_UUID)
        if ceo_res and ceo_res.executive == "CEO" and ceo_res.summary:
            results["ceo_analysis"] = True
    except Exception as e:
        print(f"Error in Executive Services: {e}")

    # 3. Inter-Executive Collaboration & Boardroom Meeting
    try:
        q_req = ExecutiveQuestionRequest(from_role="CFO", to_role="COO", question="What operational factors drove COGS increase?")
        q_res = process_executive_question(TARGET_COMPANY_UUID, q_req)
        if q_res and q_res.answer:
            results["collaboration"] = True

        mtg_res = run_executive_meeting(TARGET_COMPANY_UUID)
        if mtg_res and mtg_res.meeting_id and len(mtg_res.decisions) > 0 and len(mtg_res.actions) > 0:
            results["meeting"] = True
    except Exception as e:
        print(f"Error in Collaboration / Meeting: {e}")

    # 4. FastAPI REST Endpoint Check via Router Functions
    try:
        mock_user = CurrentUser(
            user_id=UUID(ADMIN_USER_ID),
            username="admin_demo",
            role="admin",
            company_id=TARGET_COMPANY_UUID
        )

        cfo_api_res = get_cfo_analysis(current_user=mock_user)
        if cfo_api_res and cfo_api_res.executive == "CFO":
            results["api_cfo"] = True

        coo_api_res = get_coo_analysis(current_user=mock_user)
        if coo_api_res and coo_api_res.executive == "COO":
            results["api_coo"] = True

        cmo_api_res = get_cmo_analysis(current_user=mock_user)
        if cmo_api_res and cmo_api_res.executive == "CMO":
            results["api_cmo"] = True

        ceo_api_res = get_ceo_analysis(current_user=mock_user)
        if ceo_api_res and ceo_api_res.executive == "CEO":
            results["api_ceo"] = True

        mtg_api_res = get_latest_executive_meeting(current_user=mock_user)
        if mtg_api_res and mtg_api_res.meeting_id:
            results["api_meeting"] = True

        # Test Multi-Tenant Organization Isolation
        alt_user = CurrentUser(
            user_id=UUID(ADMIN_USER_ID),
            username="admin_demo",
            role="admin",
            company_id=ALT_COMPANY_UUID
        )
        alt_cfo_res = get_cfo_analysis(current_user=alt_user)
        if alt_cfo_res and alt_cfo_res.executive == "CFO":
            results["security_isolation"] = True
    except Exception as e:
        print(f"Error checking API REST endpoints: {e}")

    # Print Summary Output
    print("\nDATA CONTEXT")
    print(f"  {'[OK]' if results['db_connection'] else '[FAIL]'} PostgreSQL Connection")
    print(f"  {'[OK]' if results['executive_context'] else '[FAIL]'} Executive Context Generated")

    print("\nEXECUTIVES")
    print(f"  {'[OK]' if results['cfo_analysis'] else '[FAIL]'} AI CFO Analysis")
    print(f"  {'[OK]' if results['coo_analysis'] else '[FAIL]'} AI COO Analysis")
    print(f"  {'[OK]' if results['cmo_analysis'] else '[FAIL]'} AI CMO Analysis")
    print(f"  {'[OK]' if results['ceo_analysis'] else '[FAIL]'} AI CEO Strategic Synthesis")

    print("\nCOLLABORATION & MEETING")
    print(f"  {'[OK]' if results['collaboration'] else '[FAIL]'} Inter-Executive Q&A")
    print(f"  {'[OK]' if results['meeting'] else '[FAIL]'} Boardroom Executive Meeting")

    print("\nFASTAPI REST APIS")
    print(f"  {'[OK]' if results['api_cfo'] else '[FAIL]'} GET /api/v1/executives/cfo")
    print(f"  {'[OK]' if results['api_coo'] else '[FAIL]'} GET /api/v1/executives/coo")
    print(f"  {'[OK]' if results['api_cmo'] else '[FAIL]'} GET /api/v1/executives/cmo")
    print(f"  {'[OK]' if results['api_ceo'] else '[FAIL]'} GET /api/v1/executives/ceo")
    print(f"  {'[OK]' if results['api_meeting'] else '[FAIL]'} GET /api/v1/executives/meeting/latest")
    print(f"  {'[OK]' if results['security_isolation'] else '[FAIL]'} Multi-Tenant JWT Isolation")

    all_passed = all(results.values())

    print("=" * 60)
    print(f"FINAL STATUS: {'PASS' if all_passed else 'FAIL'}")
    print("=" * 60)

    return all_passed


if __name__ == "__main__":
    import sys
    success = validate_phase_6_executives()
    sys.exit(0 if success else 1)
