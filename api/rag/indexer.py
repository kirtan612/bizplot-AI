"""
BizPilot AI - Document Indexer Pipeline.
Indexes organization documents into document_chunks with dense vector embeddings.
"""

from uuid import UUID
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from src.db.models.canonical import CanonicalDocument
from api.rag.chunker import chunk_document_text
from api.rag.vector_store import VectorStore
from api.rag.schemas import RAGIndexReport


def index_organization_documents(db: Session, company_id: UUID, force_reindex: bool = False) -> RAGIndexReport:
    """
    Scans and indexes canonical documents into DocumentChunk vector storage.
    """
    vector_store = VectorStore()
    docs = db.query(CanonicalDocument).filter(CanonicalDocument.company_id == company_id).all()
    
    docs_scanned = 0
    chunks_created = 0
    embeddings_gen = 0

    for d in docs:
        docs_scanned += 1
        # Extract text or metadata description
        text_content = f"Document Title: {d.file_name}\nDocument Type: {d.document_type}\nSource: {d.source_type}\nDate: {d.document_date or 'Recent'}\nStatus: {d.status}\nMetadata: {d.doc_metadata or {}}"

        # Generate Chunks
        chunk_dtos = chunk_document_text(
            content_text=text_content,
            company_id=company_id,
            document_id=d.id,
            ingestion_id=str(d.ingestion_id) if d.ingestion_id else None,
            access_classification="CONFIDENTIAL" if d.document_type in ["INVOICE", "BANK_STATEMENT", "FINANCIAL_REPORT"] else "INTERNAL"
        )

        if chunk_dtos:
            stored = vector_store.store_chunks(db, chunk_dtos)
            chunks_created += stored
            embeddings_gen += stored

    return RAGIndexReport(
        status="COMPLETED",
        documents_scanned=docs_scanned,
        chunks_created=chunks_created,
        embeddings_generated=embeddings_gen,
        completed_at=datetime.utcnow()
    )
