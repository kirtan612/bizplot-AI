"""
BizPilot AI - AI & ML Prediction Pydantic Response Schemas.
Strongly typed response models for Customer Retention, Profit Forecasting,
Cashflow Risk Forecasting, AI Insights, and Deterministic Recommendations.
"""

from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class ModelInfo(BaseModel):
    """Metadata representation for production ML models."""
    name: str = Field(description="Name of the machine learning model")
    version: str = Field(description="Model version string (e.g. '1.0')")
    algorithm: Optional[str] = Field(default=None, description="Candidate algorithm name (e.g. 'Random Forest')")
    status: str = Field(default="production", description="Deployment status ('production', 'candidate', 'unavailable')")

    model_config = ConfigDict(use_enum_values=True)


class FactorContribution(BaseModel):
    """Model-important feature contribution explanation item."""
    feature: str = Field(description="Name of the input feature")
    value: Optional[float] = Field(default=None, description="Current value of the feature for this entity")
    importance: float = Field(description="Relative model importance weight (0.0 to 1.0)")
    impact: str = Field(default="HIGH", description="Impact assessment: 'HIGH', 'MEDIUM', or 'LOW'")

    model_config = ConfigDict(use_enum_values=True)


class RetentionCustomerItem(BaseModel):
    """Customer retention item for list views."""
    customer_id: UUID = Field(description="Customer primary key UUID")
    customer_code: str = Field(description="Unique business customer code")
    customer_name: str = Field(description="Business customer name")
    churn_probability: float = Field(description="Model predicted probability of churn (0.0 to 1.0)")
    predicted_class: int = Field(description="Binary classification (0 = Active, 1 = Churned/At-Risk)")
    risk_level: str = Field(description="Categorical risk tier: 'LOW', 'MEDIUM', or 'HIGH'")
    days_since_last_purchase: int = Field(description="Recency days since last invoice date")

    model_config = ConfigDict(use_enum_values=True)


class RetentionPredictionResponse(BaseModel):
    """Single customer retention prediction detail response."""
    customer_id: UUID = Field(description="Customer primary key UUID")
    customer_code: str = Field(description="Unique customer code")
    customer_name: str = Field(description="Business customer name")
    churn_probability: float = Field(description="Model predicted probability of churn (0.0 to 1.0)")
    predicted_class: int = Field(description="Binary churn prediction (0 or 1)")
    risk_level: str = Field(description="Risk assessment: 'LOW', 'MEDIUM', or 'HIGH'")
    prediction_timestamp: datetime = Field(default_factory=datetime.now, description="Timestamp of inference")
    model: ModelInfo = Field(description="Model version and metadata")
    top_factors: List[FactorContribution] = Field(default_factory=list, description="Model-important factors")
    recommendation: List[str] = Field(default_factory=list, description="Deterministic business action items")

    model_config = ConfigDict(use_enum_values=True)


class RetentionOverviewResponse(BaseModel):
    """Aggregate customer retention metrics overview across active customer portfolio."""
    total_customers: int = Field(description="Total active customer accounts")
    high_risk_count: int = Field(description="Count of customers with HIGH churn risk")
    medium_risk_count: int = Field(description="Count of customers with MEDIUM churn risk")
    low_risk_count: int = Field(description="Count of customers with LOW churn risk")
    overall_churn_rate_pct: float = Field(description="Percentage of portfolio at HIGH churn risk")
    high_risk_customers: List[RetentionCustomerItem] = Field(default_factory=list, description="Top high-risk customers")
    model: ModelInfo = Field(description="Production retention model metadata")

    model_config = ConfigDict(use_enum_values=True)


class ProfitDriverItem(BaseModel):
    """Model-important driver item for profit forecasting."""
    feature: str = Field(description="Name of financial feature driver")
    importance: float = Field(description="Feature importance weight (0.0 to 1.0)")
    description: Optional[str] = Field(default=None, description="Business description of financial driver")

    model_config = ConfigDict(use_enum_values=True)


class ProfitForecastResponse(BaseModel):
    """Monthly financial profit forecast response."""
    status: str = Field(default="SUCCESS", description="Forecast status: 'SUCCESS' or 'INSUFFICIENT_DATA'")
    current_profit: float = Field(description="Current month operating profit in INR")
    predicted_profit: float = Field(description="Predicted next-month operating profit in INR")
    change_amount: float = Field(description="Absolute profit change (predicted - current) in INR")
    change_percentage: float = Field(description="Percentage profit change MoM")
    risk_level: str = Field(description="Profit trend risk assessment: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'")
    forecast_period: str = Field(description="Forecast target month string (e.g. '2026-04-01')")
    model: ModelInfo = Field(description="Profit model version and metadata")
    top_drivers: List[ProfitDriverItem] = Field(default_factory=list, description="Top forecast contributors")
    recommendations: List[str] = Field(default_factory=list, description="Deterministic profit optimization actions")

    model_config = ConfigDict(use_enum_values=True)


class ProfitOverviewResponse(BaseModel):
    """High-level financial profit forecasting summary overview."""
    status: str = Field(default="SUCCESS", description="Status string ('SUCCESS' or 'INSUFFICIENT_DATA')")
    current_profit: float = Field(description="Current month operating net profit in INR")
    predicted_profit: float = Field(description="Predicted next-month operating net profit in INR")
    change_amount: float = Field(description="Forecasted change amount in INR")
    change_percentage: float = Field(description="Forecasted change percentage MoM")
    risk_level: str = Field(description="Risk assessment tier")
    historical_periods_count: int = Field(description="Number of historical monthly periods evaluated")
    model: ModelInfo = Field(description="Production profit model metadata")

    model_config = ConfigDict(use_enum_values=True)


class CashflowForecastResponse(BaseModel):
    """Monthly cashflow liquidity forecast and risk response."""
    status: str = Field(default="SUCCESS", description="Forecast status: 'SUCCESS' or 'INSUFFICIENT_DATA'")
    current_cash: float = Field(description="Current net cash closing balance in INR")
    predicted_cash: float = Field(description="Predicted next-month closing cash balance in INR")
    change_amount: float = Field(description="Absolute cash change in INR")
    change_percentage: float = Field(description="Percentage cash change MoM")
    risk_level: str = Field(description="Liquidity risk assessment: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'")
    min_cash_threshold: float = Field(description="Configured business minimum cash safety threshold in INR")
    forecast_period: str = Field(description="Target month string")
    model: ModelInfo = Field(description="Production cashflow model metadata")
    top_drivers: List[ProfitDriverItem] = Field(default_factory=list, description="Top liquidity drivers")
    recommendations: List[str] = Field(default_factory=list, description="Deterministic working capital recommendations")

    model_config = ConfigDict(use_enum_values=True)


class CashflowRiskResponse(BaseModel):
    """Detailed cashflow risk and deficit analysis response."""
    status: str = Field(default="SUCCESS", description="Status string")
    risk_level: str = Field(description="Liquidity risk level: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'")
    current_cash: float = Field(description="Current cash position in INR")
    predicted_cash: float = Field(description="Predicted cash balance in INR")
    projected_deficit: float = Field(description="Projected deficit below safety threshold in INR (0 if safe)")
    min_cash_threshold: float = Field(description="Configured safety threshold in INR")
    recommendations: List[str] = Field(default_factory=list, description="Prioritized cash management actions")

    model_config = ConfigDict(use_enum_values=True)


class CashflowOverviewResponse(BaseModel):
    """Cashflow forecasting overview response."""
    status: str = Field(default="SUCCESS", description="Status string")
    current_cash: float = Field(description="Current cash closing balance in INR")
    predicted_cash: float = Field(description="Predicted closing cash balance in INR")
    net_change: float = Field(description="Net cashflow change in INR")
    risk_level: str = Field(description="Cash risk level")
    model: ModelInfo = Field(description="Production cashflow model metadata")

    model_config = ConfigDict(use_enum_values=True)


class FinancialInsightSummary(BaseModel):
    """Sub-object summary for financial insights."""
    profit_risk: str = Field(description="Profit risk assessment tier")
    predicted_profit_change_pct: float = Field(description="Forecasted profit MoM change percentage")


class CashflowInsightSummary(BaseModel):
    """Sub-object summary for cashflow insights."""
    risk: str = Field(description="Cashflow risk assessment tier")
    predicted_cash_change_pct: float = Field(description="Forecasted cash MoM change percentage")


class CustomerInsightSummary(BaseModel):
    """Sub-object summary for customer retention insights."""
    high_churn_customers: int = Field(description="Count of high-risk churn customers")
    overall_churn_rate_pct: float = Field(description="Percentage of customer portfolio at risk")


class AIInsightResponse(BaseModel):
    """Combined executive AI insights endpoint response."""
    financial: FinancialInsightSummary = Field(description="Financial profit insights")
    cashflow: CashflowInsightSummary = Field(description="Cashflow liquidity insights")
    customers: CustomerInsightSummary = Field(description="Customer retention insights")
    priority: str = Field(description="Overall business priority level: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'")

    model_config = ConfigDict(use_enum_values=True)


class AIRecommendationItem(BaseModel):
    """Individual deterministic recommendation action item."""
    priority: str = Field(description="Action priority: 'HIGH', 'MEDIUM', or 'LOW'")
    area: str = Field(description="Business operational area: 'RETENTION', 'PROFIT', 'CASHFLOW', 'WORKING_CAPITAL'")
    title: str = Field(description="Short actionable recommendation title")
    reason: str = Field(description="Traceable business reason for recommendation")
    source: str = Field(description="Source model or engine ('retention_model', 'profit_forecast', 'cashflow_forecast')")

    model_config = ConfigDict(use_enum_values=True)


class AIRecommendationResponse(BaseModel):
    """Combined prioritized recommendations endpoint response."""
    total_count: int = Field(description="Total count of active recommendations")
    recommendations: List[AIRecommendationItem] = Field(default_factory=list, description="Prioritized recommendations")

    model_config = ConfigDict(use_enum_values=True)


class InsufficientDataResponse(BaseModel):
    """Controlled response payload when an organization lacks sufficient historical DB records."""
    status: str = Field(default="INSUFFICIENT_DATA", description="Status code indicating data insufficiency")
    message: str = Field(description="Human-readable explanation of missing data requirements")

    model_config = ConfigDict(use_enum_values=True)
