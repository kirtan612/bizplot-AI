from typing import Any, Optional
from pydantic import BaseModel


class ValidationResult(BaseModel):
    """Result of a single business validation rule check."""
    
    rule_id: str
    passed: bool
    message: str
    row_reference: Optional[Any] = None
