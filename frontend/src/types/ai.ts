/**
 * BizPilot AI - TypeScript Interfaces for Phase 4 & Phase 5 AI Prediction API Payloads.
 */

export interface ModelInfo {
  name: string;
  version: string;
  algorithm?: string;
  status: 'production' | 'candidate' | 'unavailable';
}

export interface FactorContribution {
  feature: string;
  value?: number;
  importance: number;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RetentionCustomerItem {
  customer_id: string;
  customer_code: string;
  customer_name: string;
  churn_probability: number;
  predicted_class: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  days_since_last_purchase: number;
}

export interface RetentionPredictionResponse {
  customer_id: string;
  customer_code: string;
  customer_name: string;
  churn_probability: number;
  predicted_class: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  prediction_timestamp: string;
  model: ModelInfo;
  top_factors: FactorContribution[];
  recommendation: string[];
}

export interface RetentionOverviewResponse {
  total_customers: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  overall_churn_rate_pct: number;
  high_risk_customers: RetentionCustomerItem[];
  model: ModelInfo;
}

export interface ProfitDriverItem {
  feature: string;
  importance: number;
  description?: string;
}

export interface ProfitForecastResponse {
  status: 'SUCCESS' | 'INSUFFICIENT_DATA';
  current_profit: number;
  predicted_profit: number;
  change_amount: number;
  change_percentage: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  forecast_period: string;
  model: ModelInfo;
  top_drivers: ProfitDriverItem[];
  recommendations: string[];
}

export interface ProfitOverviewResponse {
  status: 'SUCCESS' | 'INSUFFICIENT_DATA';
  current_profit: number;
  predicted_profit: number;
  change_amount: number;
  change_percentage: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  historical_periods_count: number;
  model: ModelInfo;
}

export interface CashflowForecastResponse {
  status: 'SUCCESS' | 'INSUFFICIENT_DATA';
  current_cash: number;
  predicted_cash: number;
  change_amount: number;
  change_percentage: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  min_cash_threshold: number;
  forecast_period: string;
  model: ModelInfo;
  top_drivers: ProfitDriverItem[];
  recommendations: string[];
}

export interface CashflowRiskResponse {
  status: 'SUCCESS' | 'INSUFFICIENT_DATA';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  current_cash: number;
  predicted_cash: number;
  projected_deficit: number;
  min_cash_threshold: number;
  recommendations: string[];
}

export interface CashflowOverviewResponse {
  status: 'SUCCESS' | 'INSUFFICIENT_DATA';
  current_cash: number;
  predicted_cash: number;
  net_change: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  model: ModelInfo;
}

export interface FinancialInsightSummary {
  profit_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predicted_profit_change_pct: number;
}

export interface CashflowInsightSummary {
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predicted_cash_change_pct: number;
}

export interface CustomerInsightSummary {
  high_churn_customers: number;
  overall_churn_rate_pct: number;
}

export interface AIInsightResponse {
  financial: FinancialInsightSummary;
  cashflow: CashflowInsightSummary;
  customers: CustomerInsightSummary;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AIRecommendationItem {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  area: 'RETENTION' | 'PROFIT' | 'CASHFLOW' | 'WORKING_CAPITAL';
  title: string;
  reason: string;
  source: string;
}

export interface AIRecommendationResponse {
  total_count: number;
  recommendations: AIRecommendationItem[];
}

export interface InsufficientDataResponse {
  status: 'INSUFFICIENT_DATA';
  message: string;
}

// ==============================================================================
// PHASE 6 AI EXECUTIVE LAYER TYPES
// ==============================================================================

export interface ExecutivePriorityItem {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  reason: string;
}

export interface ExecutiveRecommendationItem {
  title: string;
  reason: string;
  source: string;
  area?: string;
}

export interface ExecutiveQuestionItem {
  to_executive: string;
  question: string;
}

export interface ExecutiveAnalysisResponse {
  executive: 'CFO' | 'COO' | 'CMO' | 'CEO' | string;
  name: string;
  status: 'OPTIMAL' | 'ATTENTION_REQUIRED' | 'CRITICAL_RISK' | 'INSUFFICIENT_DATA';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  key_findings: string[];
  priorities: ExecutivePriorityItem[];
  recommendations: ExecutiveRecommendationItem[];
  questions_for_executives: ExecutiveQuestionItem[];
  model_info: {
    name: string;
    version: string;
    status: string;
  };
}

export interface ExecutiveQuestionResponse {
  from_role: string;
  to_role: string;
  question: string;
  answer: string;
  supporting_findings: string[];
}

export interface StrategicDecisionItem {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision: string;
  reason: string;
}

export interface ActionItem {
  owner: string;
  action: string;
  target_timeline: string;
}

export interface BoardroomMessage {
  from_executive: string;
  to_executive: string;
  message: string;
  timestamp: string;
}

export interface ExecutiveMeetingResponse {
  meeting_id: string;
  organization_id: string;
  started_at: string;
  company_status: 'OPTIMAL' | 'ATTENTION_REQUIRED' | 'CRITICAL_RISK' | 'INSUFFICIENT_DATA';
  summary: string;
  top_risks: string[];
  executive_summaries: Record<string, string>;
  strategic_priorities: string[];
  decisions: StrategicDecisionItem[];
  actions: ActionItem[];
  messages: BoardroomMessage[];
}
