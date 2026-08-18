"""
BizPilot AI - Tenant-Isolated Vector Store Engine.
Performs pre-filtered organization & RBAC permission vector retrieval against PostgreSQL document_chunks.
"""

from uuid import UUID
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from src.db.models.rag import DocumentChunk
from api.rag.embedding import DenseEmbeddingEngine, compute_cosine_similarity
from api.rag.chunker import DocumentChunkDTO


class VectorStore:
    """PostgreSQL Vector Storage & Search Engine."""
    
    def __init__(self):
        self.embedding_engine = DenseEmbeddingEngine()

    def store_chunks(self, db: Session, chunk_dtos: List[DocumentChunkDTO]) -> int:
        """Stores chunk DTOs with dense embedding vectors into database."""
        stored_count = 0
        for dto in chunk_dtos:
            # Check content hash duplicate
            existing = db.query(DocumentChunk).filter(
                DocumentChunk.company_id == dto.company_id,
                DocumentChunk.content_hash == dto.content_hash,
                DocumentChunk.is_active == True
            ).first()

            if not existing:
                vector = self.embedding_engine.embed_text(dto.content)
                chunk = DocumentChunk(
                    company_id=dto.company_id,
                    document_id=dto.document_id,
                    knowledge_id=dto.knowledge_id,
                    ingestion_id=dto.ingestion_id,
                    chunk_index=dto.chunk_index,
                    page_number=dto.page_number,
                    section_title=dto.section_title,
                    content=dto.content,
                    access_classification=dto.access_classification,
                    embedding_json=vector,
                    content_hash=dto.content_hash,
                    is_active=True
                )
                db.add(chunk)
                stored_count += 1

        db.commit()
        return stored_count

    def search_similarity(
        self,
        db: Session,
        company_id: UUID,
        query_text: str,
        allowed_visibilities: List[str],
        top_k: int = 5,
        document_type_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Performs pre-filtered tenant & RBAC permission vector similarity search.
        Guarantees zero cross-tenant retrieval.
        """
        query_vec = self.embedding_engine.embed_text(query_text)

        # Pre-filter query strictly by tenant boundary & access classification
        query = db.query(DocumentChunk).filter(
            DocumentChunk.company_id == company_id,
            DocumentChunk.is_active == True,
            DocumentChunk.access_classification.in_(allowed_visibilities)
        )

        chunks = query.all()
        scored_results = []

        query_words = set(query_text.lower().split())

        for chunk in chunks:
            vector = chunk.embedding_json if isinstance(chunk.embedding_json, list) else []
            sim_score = compute_cosine_similarity(query_vec, vector)

            # Hybrid keyword boost
            chunk_words = set(chunk.content.lower().split())
            common_words = query_words.intersection(chunk_words)
            keyword_score = len(common_words) / max(1, len(query_words))
            
            # Combine semantic similarity (70%) + keyword match (30%)
            final_score = round((sim_score * 0.70) + (keyword_score * 0.30), 4)

            scored_results.append({
                "chunk": chunk,
                "score": final_score
            })

        # Sort by relevance score
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]

    def invalidate_document_chunks(self, db: Session, company_id: UUID, document_id: UUID) -> int:
        """Instantly revokes document chunks when document access is deleted or revoked."""
        revoked = db.query(DocumentChunk).filter(
            DocumentChunk.company_id == company_id,
            DocumentChunk.document_id == document_id,
            DocumentChunk.is_active == True
        ).update({"is_active": False})
        db.commit()
        return revoked
