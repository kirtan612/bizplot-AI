"""
BizPilot AI - FastAPI Router for Phase 7 Enterprise Data Ingestion.
Exposes REST endpoints for secure multi-tenant file uploads, ingestion status tracking,
job history, retry mechanisms, controlled deletion, and enterprise connector catalogs.
"""

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query, status
from typing import List, Optional
from uuid import UUID

from api.auth.dependencies import get_current_user, CurrentUser
from api.ingestion.schemas import (
    IngestionJobResponse,
    IngestionListResponse,
    ConnectorStatusInfo
)
from api.ingestion.services import (
    process_ingestion_upload,
    get_ingestion_job_status,
    list_organization_ingestions,
    retry_ingestion_job,
    delete_ingestion_job
)
from api.ingestion.registry import registry

router = APIRouter(prefix="/ingestion", tags=["Enterprise Data Ingestion"])


@router.post("/upload", response_model=IngestionJobResponse, status_code=status.HTTP_201_CREATED)
async def upload_ingestion_file(
    file: UploadFile = File(...),
    source_type: Optional[str] = Form(None),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Secure authenticated multi-tenant file upload endpoint.
    Validates file signature, size limit, calculates SHA-256 hash, stores raw file in tenant isolated storage,
    and creates tracked ingestion job.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required.")

    try:
        content = await file.read()
        return process_ingestion_upload(
            company_id=current_user.company_id,
            filename=file.filename,
            content=content,
            user_id=current_user.user_id,
            override_source_type=source_type
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion processing error: {str(e)}")


@router.get("/connectors", response_model=List[ConnectorStatusInfo])
def get_connectors(current_user: CurrentUser = Depends(get_current_user)):
    """List available enterprise connectors and their connection statuses."""
    return registry.get_connector_catalog()


@router.get("/{ingestion_id}", response_model=IngestionJobResponse)
def get_ingestion_status(
    ingestion_id: str,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get status and metadata for an ingestion job by ID (organization-scoped)."""
    try:
        return get_ingestion_job_status(current_user.company_id, ingestion_id)
    except KeyError as ke:
        raise HTTPException(status_code=404, detail=str(ke))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=IngestionListResponse)
def list_ingestions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get paginated organization-scoped ingestion job history."""
    try:
        return list_organization_ingestions(current_user.company_id, page=page, page_size=page_size)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{ingestion_id}/retry", response_model=IngestionJobResponse)
def retry_ingestion(
    ingestion_id: str,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Retry a recoverable failed ingestion job."""
    try:
        return retry_ingestion_job(current_user.company_id, ingestion_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except KeyError as ke:
        raise HTTPException(status_code=404, detail=str(ke))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{ingestion_id}")
def delete_ingestion(
    ingestion_id: str,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Delete an ingestion job and clear its raw storage (organization-scoped)."""
    try:
        success = delete_ingestion_job(current_user.company_id, ingestion_id)
        return {"status": "DELETED", "ingestion_id": ingestion_id, "success": success}
    except KeyError as ke:
        raise HTTPException(status_code=404, detail=str(ke))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
