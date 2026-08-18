"""
BizPilot AI - Phase 12 Agent Capability & Permission Matrix.
Defines backend-enforced data access boundaries and tool permission policies for CFO, COO, CMO, CEO.
"""

from typing import Dict, List, Any


AGENT_CAPABILITY_MATRIX: Dict[str, Dict[str, str]] = {
    "CFO": {
        "financial_sql": "FULL",
        "cashflow_ml": "FULL",
        "retention_ml": "FULL",
        "customer_data": "FULL",
        "supplier_data": "FULL",
        "financial_documents": "FULL",
        "operational_documents": "LIMITED",
        "marketing_documents": "NONE",
    },
    "COO": {
        "financial_sql": "LIMITED",
        "cashflow_ml": "LIMITED",
        "retention_ml": "LIMITED",
        "customer_data": "FULL",
        "supplier_data": "FULL",
        "financial_documents": "LIMITED",
        "operational_documents": "FULL",
        "marketing_documents": "LIMITED",
    },
    "CMO": {
        "financial_sql": "LIMITED",
        "cashflow_ml": "NONE",
        "retention_ml": "FULL",
        "customer_data": "FULL",
        "supplier_data": "LIMITED",
        "financial_documents": "NONE",
        "operational_documents": "LIMITED",
        "marketing_documents": "FULL",
    },
    "CEO": {
        "financial_sql": "SUMMARIZED",
        "cashflow_ml": "SUMMARIZED",
        "retention_ml": "SUMMARIZED",
        "customer_data": "AUTHORIZED",
        "supplier_data": "AUTHORIZED",
        "financial_documents": "AUTHORIZED",
        "operational_documents": "AUTHORIZED",
        "marketing_documents": "AUTHORIZED",
    }
}


def verify_agent_permission(agent_role: str, domain: str) -> bool:
    """Verifies if an agent role is authorized to access a given data domain."""
    role_caps = AGENT_CAPABILITY_MATRIX.get(agent_role, {})
    level = role_caps.get(domain, "NONE")
    return level in ["FULL", "LIMITED", "SUMMARIZED", "AUTHORIZED"]
