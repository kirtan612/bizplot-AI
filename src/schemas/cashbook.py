"""
Cashbook Schema
Generated from: 10_Cashbook.md, Status: Draft v1.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from decimal import Decimal
from datetime import datetime, date
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class TransactionType(str, Enum):
    RECEIPT = "Receipt"
    PAYMENT = "Payment"


class PartyType(str, Enum):
    CUSTOMER = "Customer"
    SUPPLIER = "Supplier"
    EXPENSE = "Expense"
    CAPITAL = "Capital"


class PaymentMode(str, Enum):
    BANK_TRANSFER = "Bank Transfer"
    CHEQUE = "Cheque"
    CASH = "Cash"
    UPI = "UPI"


class CashbookModel(BaseModel):
    """Schema for a cash or bank receipt/payment entry."""
    
    entry_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    entry_date: date = Field(
        description="Transaction voucher date"
    )
    voucher_number: str = Field(
        description="Sequential transaction voucher number (format: VOU-{YYYY}{MM}-{SEQ})"
    )
    transaction_type: TransactionType = Field(
        description="Direction of cash flow (Receipt = Cash In, Payment = Cash Out)"
    )
    party_type: PartyType = Field(
        description="Entity type associated with transaction"
    )
    party_id: Optional[uuid.UUID] = Field(
        default=None,
        description="Foreign key referencing Customer Master or Supplier Master (null if Expense/Capital)"
    )
    party_name: str = Field(
        description="Name of party or expense ledger head"
    )
    payment_mode: PaymentMode = Field(
        description="Payment mode utilized"
    )
    amount: Decimal = Field(
        description="Transaction value in ₹"
    )
    reference_invoice_number: Optional[str] = Field(
        default=None,
        description="Foreign key referencing Sales Register or Purchase Register invoice (optional)"
    )
    opening_balance: Decimal = Field(
        description="Cash/bank balance prior to transaction"
    )
    closing_balance: Decimal = Field(
        description="Cash/bank balance after transaction (Receipt = Opening + Amount, Payment = Opening - Amount)"
    )
    narration: str = Field(
        description="Human-readable transaction description"
    )
    created_at: datetime = Field(
        description="Row creation time (timezone-aware UTC)"
    )
    updated_at: datetime = Field(
        description="Last modification time (timezone-aware UTC)"
    )

    model_config = ConfigDict(
        use_enum_values=True,
        json_schema_serialization_defaults_required=True
    )
