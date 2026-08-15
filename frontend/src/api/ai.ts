/**
 * BizPilot AI - API Services Layer for AI Predictions & Dashboard Telemetry.
 */

import { apiFetch } from './client';
import type {
  RetentionOverviewResponse,
  RetentionPredictionResponse,
  ProfitOverviewResponse,
  ProfitForecastResponse,
  ProfitDriverItem,
  CashflowOverviewResponse,
  CashflowForecastResponse,
  CashflowRiskResponse,
  AIInsightResponse,
  AIRecommendationResponse,
  ExecutiveAnalysisResponse,
  ExecutiveQuestionResponse,
  ExecutiveMeetingResponse,
} from '../types/ai';

export interface DashboardKPIs {
  total_active_products: number;
  products_below_reorder: number;
  sales_last_30_days: number;
  purchases_last_30_days: number;
  cash_position?: number;
}

export interface RecentActivity {
  activity_type: 'purchase' | 'sale' | 'cashbook';
  activity_id: string;
  reference_number: string;
  activity_date: string;
  party_name: string;
  amount: number;
  details?: string;
}

// ==============================================================================
// CUSTOMER RETENTION AI API CALLS
// ==============================================================================

export async function getRetentionOverview(): Promise<RetentionOverviewResponse> {
  return apiFetch<RetentionOverviewResponse>('/v1/ai/retention/overview');
}

export async function getRetentionCustomers(
  page: number = 1, 
  pageSize: number = 20, 
  risk?: string
): Promise<{ total: number; page: number; page_size: number; items: any[]; model: any }> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  if (risk) {
    queryParams.append('risk', risk);
  }
  return apiFetch(`/v1/ai/retention/customers?${queryParams.toString()}`);
}

export async function getRetentionCustomerDetail(customerId: string): Promise<RetentionPredictionResponse> {
  return apiFetch<RetentionPredictionResponse>(`/v1/ai/retention/customers/${customerId}`);
}

// ==============================================================================
// FINANCIAL PROFIT FORECASTING AI API CALLS
// ==============================================================================

export async function getProfitOverview(): Promise<ProfitOverviewResponse> {
  return apiFetch<ProfitOverviewResponse>('/v1/ai/profit/overview');
}

export async function getProfitForecast(): Promise<ProfitForecastResponse> {
  return apiFetch<ProfitForecastResponse>('/v1/ai/profit/forecast');
}

export async function getProfitDrivers(): Promise<ProfitDriverItem[]> {
  return apiFetch<ProfitDriverItem[]>('/v1/ai/profit/drivers');
}

// ==============================================================================
// CASHFLOW FORECASTING AI API CALLS
// ==============================================================================

export async function getCashflowOverview(): Promise<CashflowOverviewResponse> {
  return apiFetch<CashflowOverviewResponse>('/v1/ai/cashflow/overview');
}

export async function getCashflowForecast(minThreshold: number = 40000000.0): Promise<CashflowForecastResponse> {
  return apiFetch<CashflowForecastResponse>(`/v1/ai/cashflow/forecast?min_threshold=${minThreshold}`);
}

export async function getCashflowRisk(minThreshold: number = 40000000.0): Promise<CashflowRiskResponse> {
  return apiFetch<CashflowRiskResponse>(`/v1/ai/cashflow/risk?min_threshold=${minThreshold}`);
}

// ==============================================================================
// COMBINED EXECUTIVE AI INSIGHTS & RECOMMENDATIONS
// ==============================================================================

export async function getAIInsights(): Promise<AIInsightResponse> {
  return apiFetch<AIInsightResponse>('/v1/ai/insights');
}

export async function getAIRecommendations(): Promise<AIRecommendationResponse> {
  return apiFetch<AIRecommendationResponse>('/v1/ai/recommendations');
}

// ==============================================================================
// DASHBOARD GENERAL KPIS & RECENT TRANSACTIONS
// ==============================================================================

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  return apiFetch<DashboardKPIs>('/dashboard/kpis');
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  return apiFetch<RecentActivity[]>('/dashboard/recent-activity');
}

// ==============================================================================
// PHASE 6 AI EXECUTIVE LAYER CALLS
// ==============================================================================

export async function getCFOAnalysis(): Promise<ExecutiveAnalysisResponse> {
  return apiFetch<ExecutiveAnalysisResponse>('/v1/executives/cfo');
}

export async function getCOOAnalysis(): Promise<ExecutiveAnalysisResponse> {
  return apiFetch<ExecutiveAnalysisResponse>('/v1/executives/coo');
}

export async function getCMOAnalysis(): Promise<ExecutiveAnalysisResponse> {
  return apiFetch<ExecutiveAnalysisResponse>('/v1/executives/cmo');
}

export async function getCEOAnalysis(): Promise<ExecutiveAnalysisResponse> {
  return apiFetch<ExecutiveAnalysisResponse>('/v1/executives/ceo');
}

export async function askExecutiveQuestion(fromRole: string, toRole: string, question: string): Promise<ExecutiveQuestionResponse> {
  return apiFetch<ExecutiveQuestionResponse>('/v1/executives/collaboration/ask', {
    method: 'POST',
    body: JSON.stringify({ from_role: fromRole, to_role: toRole, question }),
  });
}

export async function runExecutiveMeeting(): Promise<ExecutiveMeetingResponse> {
  return apiFetch<ExecutiveMeetingResponse>('/v1/executives/meeting/start', {
    method: 'POST',
  });
}

export async function getLatestExecutiveMeeting(): Promise<ExecutiveMeetingResponse> {
  return apiFetch<ExecutiveMeetingResponse>('/v1/executives/meeting/latest');
}
