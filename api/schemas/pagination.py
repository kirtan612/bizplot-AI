"""
Generic Pagination Envelope and Query Helper for FastAPI Endpoints.
"""

import math
from typing import Generic, List, TypeVar, Any, Dict
from pydantic import BaseModel, Field
from sqlalchemy.orm import Query

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard pagination envelope required across all list endpoints."""
    total: int = Field(description="Total matching items count across all pages")
    page: int = Field(description="Current page index (1-based)")
    page_size: int = Field(description="Items per page (max 100)")
    total_pages: int = Field(description="Total calculated pages count")
    items: List[T] = Field(description="List of item objects for current page")


def build_paginated_response(
    query: Query,
    page: int = 1,
    page_size: int = 20,
    transform_item_func: Any = None
) -> Dict[str, Any]:
    """
    Paginate a SQLAlchemy query with hard max page_size cap of 100.
    Returns dictionary payload matching PaginatedResponse shape.
    """
    safe_page = max(1, page)
    safe_page_size = min(max(1, page_size), 100)

    total = query.count()
    total_pages = math.ceil(total / safe_page_size) if total > 0 else 0

    raw_items = (
        query.offset((safe_page - 1) * safe_page_size)
        .limit(safe_page_size)
        .all()
    )

    if transform_item_func:
        items = [transform_item_func(item) for item in raw_items]
    else:
        items = raw_items

    return {
        "total": total,
        "page": safe_page,
        "page_size": safe_page_size,
        "total_pages": total_pages,
        "items": items,
    }
