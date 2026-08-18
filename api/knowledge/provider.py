"""
BizPilot AI - KnowledgeProvider Abstraction for Phase 10 Company Knowledge Layer.
Provides metadata, entity, relational, temporal, and provenance knowledge retrieval methods.
Enforces Phase 9 Security RBAC permissions and multi-tenant organization isolation.
Prepared abstraction for Phase 11 RAG extension.
"""

from uuid import UUID
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from api.auth.dependencies import CurrentUser
from api.security.permissions import has_permission
from src.db.models.knowledge import CompanyKnowledgeItem, KnowledgeRelationship, KnowledgeSource, KnowledgeConflict


class KnowledgeProvider:
    """
    Unified Knowledge Access Provider abstraction.
    Enforces Organization Tenant Scoping & RBAC Access Control.
    """

    def __init__(self, db: Session, user: CurrentUser):
        self.db = db
        self.user = user
        self.company_id = user.company_id

    def _verify_permission(self, required_permission: str) -> None:
        """Enforces RBAC permission check."""
        if not has_permission(self.user.role, required_permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Knowledge access requires permission '{required_permission}' which role '{self.user.role}' lacks."
            )

    def get_by_id(self, knowledge_id: UUID) -> CompanyKnowledgeItem:
        """Retrieves a specific Knowledge Item by ID ensuring company_id isolation."""
        item = self.db.query(CompanyKnowledgeItem).filter(
            CompanyKnowledgeItem.id == knowledge_id,
            CompanyKnowledgeItem.company_id == self.company_id
        ).first()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Knowledge item not found or access denied."
            )

        # Check visibility permission
        if item.visibility == "RESTRICTED":
            self._verify_permission("bank.view")
        elif item.visibility == "CONFIDENTIAL":
            self._verify_permission("invoices.view")

        return item

    def get_by_entity(self, entity_type: str, entity_id: str) -> List[CompanyKnowledgeItem]:
        """Retrieves Knowledge Items linked to a specific entity_type and entity_id."""
        return self.db.query(CompanyKnowledgeItem).filter(
            CompanyKnowledgeItem.company_id == self.company_id,
            CompanyKnowledgeItem.entity_type == entity_type,
            CompanyKnowledgeItem.entity_id == entity_id
        ).all()

    def get_by_source(self, source_type: str, ingestion_id: Optional[str] = None) -> List[CompanyKnowledgeItem]:
        """Retrieves Knowledge Items filtered by source_type and optional ingestion_id."""
        query = self.db.query(CompanyKnowledgeItem).filter(
            CompanyKnowledgeItem.company_id == self.company_id,
            CompanyKnowledgeItem.source_type == source_type
        )
        if ingestion_id:
            query = query.filter(CompanyKnowledgeItem.ingestion_id == ingestion_id)
        return query.all()

    def get_related(self, knowledge_id: UUID) -> List[Dict[str, Any]]:
        """Retrieves knowledge items related to the target knowledge item via KnowledgeRelationships."""
        item = self.get_by_id(knowledge_id)
        rel_records = self.db.query(KnowledgeRelationship).filter(
            KnowledgeRelationship.company_id == self.company_id,
            (KnowledgeRelationship.source_knowledge_id == item.id) | (KnowledgeRelationship.target_knowledge_id == item.id)
        ).all()

        results = []
        for r in rel_records:
            other_id = r.target_knowledge_id if r.source_knowledge_id == item.id else r.source_knowledge_id
            other_item = self.db.query(CompanyKnowledgeItem).filter(CompanyKnowledgeItem.id == other_id).first()
            if other_item:
                results.append({
                    "relationship_id": str(r.id),
                    "relationship_type": r.relationship_type,
                    "related_item": {
                        "id": str(other_item.id),
                        "title": other_item.title,
                        "entity_type": other_item.entity_type,
                        "entity_id": other_item.entity_id,
                    },
                    "confidence": float(r.confidence)
                })
        return results

    def get_current(self, entity_type: Optional[str] = None) -> List[CompanyKnowledgeItem]:
        """Retrieves active current (is_current = True) knowledge items."""
        query = self.db.query(CompanyKnowledgeItem).filter(
            CompanyKnowledgeItem.company_id == self.company_id,
            CompanyKnowledgeItem.is_current == True
        )
        if entity_type:
            query = query.filter(CompanyKnowledgeItem.entity_type == entity_type)
        return query.all()

    def get_historical(self, entity_type: Optional[str] = None) -> List[CompanyKnowledgeItem]:
        """Retrieves historical/superseded (is_current = False) knowledge items."""
        query = self.db.query(CompanyKnowledgeItem).filter(
            CompanyKnowledgeItem.company_id == self.company_id,
            CompanyKnowledgeItem.is_current == False
        )
        if entity_type:
            query = query.filter(CompanyKnowledgeItem.entity_type == entity_type)
        return query.all()

    def semantic_search(self, query_text: str, top_k: int = 5):
        """
        Placeholder method for Phase 11 RAG integration.
        Semantic vector search is explicitly NOT implemented in Phase 10.
        """
        raise NotImplementedError("RAG semantic retrieval will be introduced in Phase 11.")
