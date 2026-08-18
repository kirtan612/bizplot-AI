"""
BizPilot AI - Pydantic Schemas for Phase 11 RAG & Knowledge Retrieval.
"""

from uuid import UUID
from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class CitationDTO(BaseModel):
    source_id: str
    document_id: Optional[str] = None
    document_name: str
    page_number: Optional[int] = None
    section_title: Optional[str] = None
    knowledge_id: Optional[str] = None
    relevance_score: float
    source_type: str = "DOCUMENT"

    model_config = ConfigDict(from_attributes=True)


class RAGQueryRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=1000)
    top_k: int = Field(default=5, ge=1, le=20)
    document_type_filter: Optional[str] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    include_historical: bool = False


class RAGQueryResponse(BaseModel):
    query: str
    query_type: str  # DOCUMENT, STRUCTURED, PREDICTIVE, MIXED
    answer: str
    confidence: str  # HIGH, MEDIUM, LOW, NO_CONTEXT
    sources: List[CitationDTO] = []
    retrieval_count: int = 0
    execution_time_ms: float = 0.0

    model_config = ConfigDict(from_attributes=True)


class RAGIndexRequest(BaseModel):
    force_reindex: bool = False


class RAGIndexReport(BaseModel):
    status: str
    documents_scanned: int
    chunks_created: int
    embeddings_generated: int
    completed_at: datetime


class RAGEvalReport(BaseModel):
    total_eval_queries: int
    hit_rate_at_k: float  # e.g. 0.96 (96%)
    recall_at_k: float    # e.g. 0.94 (94%)
    grounded_answer_rate: float # e.g. 0.98 (98%)
    zero_cross_tenant_violations: bool = True
