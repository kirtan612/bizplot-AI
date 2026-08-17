"""
BizPilot AI - FastAPI Router for Phase 8 Data Normalization.
Provides REST APIs for triggering data normalization, viewing preview mappings,
fetching normalization reports, and reviewing low-confidence records.
"""

from uuid import UUID
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query

from api.auth.dependencies import get_current_user, CurrentUser
from api.normalization.schemas import NormalizationReport, NormalizationPreviewResponse
from api.normalization.services import (
    normalize_ingestion_job,
    preview_ingestion_normalization
)

router = APIRouter(prefix="/normalization", tags=["Data Normalization"])


@router.post("/run/{ingestion_id}", response_model=NormalizationReport)
def run_normalization(
    ingestion_id: str,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Triggers Phase 8 data normalization for a Phase 7 raw ingestion job."""
    try:
        return normalize_ingestion_job(current_user.company_id, ingestion_id)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Normalization failed: {str(e)}")


@router.get("/preview/{ingestion_id}", response_model=NormalizationPreviewResponse)
def get_normalization_preview(
    ingestion_id: str,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Previews schema detection & sample field mappings before executing normalization."""
    try:
        return preview_ingestion_normalization(current_user.company_id, ingestion_id)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Preview failed: {str(e)}")
