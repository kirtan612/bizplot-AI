"""
BizPilot AI - Query Classification Router.
Routes incoming questions to SQL Business Services, ML Predictions, RAG Retrieval, or Combined Mixed Synthesis.
"""

import re
from typing import Dict, Any


class QueryRouter:
    """Classifies user natural language query to optimal data path."""
    
    STRUCTURED_KEYWORDS = {
        "revenue", "sales", "total sales", "total revenue", "invoice amount", "customer count",
        "supplier count", "inventory stock", "cashbook", "profit", "profit margin", "order total", "tax amount"
    }

    PREDICTIVE_KEYWORDS = {
        "forecast", "predict", "next month", "future cashflow", "churn risk", "retention probability",
        "expected revenue", "projected profit", "prediction", "trend next quarter"
    }

    DOCUMENT_KEYWORDS = {
        "contract", "agreement", "policy", "payment terms", "clause", "document", "pdf",
        "file", "terms and conditions", "warranty", "specification", "hsn code rule"
    }

    def classify_query(self, query_text: str) -> str:
        """Classifies query into STRUCTURED, PREDICTIVE, DOCUMENT, or MIXED."""
        query_lower = query_text.lower()

        has_structured = any(k in query_lower for k in self.STRUCTURED_KEYWORDS) or bool(re.search(r"\b(how many|what is the total|sum of|count of)\b", query_lower))
        has_predictive = any(k in query_lower for k in self.PREDICTIVE_KEYWORDS) or bool(re.search(r"\b(will|expected|forecast|projected)\b", query_lower))
        has_document = any(k in query_lower for k in self.DOCUMENT_KEYWORDS) or bool(re.search(r"\b(say about|contract|clause|according to document)\b", query_lower))

        # Mixed query detection
        matches_count = sum([has_structured, has_predictive, has_document])
        if matches_count >= 2:
            return "MIXED"

        if has_predictive:
            return "PREDICTIVE"
        if has_structured:
            return "STRUCTURED"
        if has_document:
            return "DOCUMENT"

        # Default fallback to DOCUMENT search for natural language company questions
        return "DOCUMENT"
