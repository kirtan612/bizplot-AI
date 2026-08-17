"""
BizPilot AI - FastAPI Main Application Entrance & Router Wiring.

Mounts routers under /api:
  /api/auth       -> Authentication & Token Issuance
  /api/products   -> Product Master
  /api/suppliers  -> Supplier Master
  /api/customers  -> Customer Master
  /api/company    -> Company Master
  /api/purchases  -> Purchase Register
  /api/sales      -> Sales Register
  /api/cashbook   -> Cashbook (Admin Only)
"""

import sys
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure project root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from api.auth.router import router as auth_router
from api.routers.master_data import router as master_data_router
from api.routers.transactions import router as transactions_router
from api.routers.inventory import router as inventory_router
from api.routers.dashboard import router as dashboard_router
from api.routers.predictions import router as predictions_router
from api.routers.ai import router as ai_router
from api.routers.executives import router as executives_router
from api.routers.ingestion import router as ingestion_router
from api.routers.normalization import router as normalization_router
from api.routers.canonical import router as canonical_router

app = FastAPI(
    title="BizPilot AI API",
    description="FastAPI Backend for GI/MS Steel Pipe Distribution & Analytics System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire Routers under /api prefix
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(master_data_router, prefix="/api", tags=["Master Data"])
app.include_router(transactions_router, prefix="/api", tags=["Transaction Registers"])
app.include_router(inventory_router, prefix="/api", tags=["Inventory"])
app.include_router(dashboard_router, prefix="/api", tags=["Dashboard"])
app.include_router(predictions_router, prefix="/api", tags=["AI Predictions (Legacy)"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI Engine"])
app.include_router(executives_router, prefix="/api/v1", tags=["AI Executives"])
app.include_router(executives_router, prefix="/api", tags=["AI Executives"])
app.include_router(ingestion_router, prefix="/api/v1", tags=["Enterprise Data Ingestion"])
app.include_router(ingestion_router, prefix="/api", tags=["Enterprise Data Ingestion"])
app.include_router(normalization_router, prefix="/api/v1", tags=["Data Normalization"])
app.include_router(normalization_router, prefix="/api", tags=["Data Normalization"])
app.include_router(canonical_router, prefix="/api/v1", tags=["Canonical Business Data"])
app.include_router(canonical_router, prefix="/api", tags=["Canonical Business Data"])


@app.get("/api/health", tags=["Health"])
def health_check():
    """Service health check endpoint."""
    return {"status": "ok", "service": "BizPilot AI API"}


@app.get("/", tags=["Health"])
def root():
    """Root redirect / information endpoint."""
    return {
        "message": "Welcome to BizPilot AI API",
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
