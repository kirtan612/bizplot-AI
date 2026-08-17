/**
 * BizPilot AI - Ingestion API Client.
 * Communicates with FastAPI backend /api/v1/ingestion endpoints.
 */

import { apiFetch } from './client';

export interface IngestionSheetMetadata {
  name: string;
  rows: number;
  columns: number;
  headers: string[];
}

export interface IngestionJobResponse {
  id: string;
  organization_id: string;
  source_type: string;
  source_name: string;
  status: 'PENDING' | 'VALIDATING' | 'PROCESSING' | 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'CANCELLED' | 'TEXT_EXTRACTION_REQUIRED' | 'OCR_REQUIRED';
  file_name: string;
  file_size_bytes: number;
  content_hash?: string;
  record_count: number;
  sheets: IngestionSheetMetadata[];
  started_at?: string;
  completed_at?: string;
  created_at: string;
  error_message?: string;
  metadata: Record<string, any>;
}

export interface IngestionListResponse {
  total: number;
  page: number;
  page_size: number;
  items: IngestionJobResponse[];
}

export interface ConnectorStatusInfo {
  id: string;
  name: string;
  category: string;
  source_type: string;
  status: 'CONNECTED' | 'AVAILABLE' | 'DEVELOPMENT CONNECTOR' | 'COMING SOON';
  description: string;
  is_live: boolean;
}

export async function uploadIngestionFile(file: File, sourceType?: string): Promise<IngestionJobResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (sourceType) {
    formData.append('source_type', sourceType);
  }

  return apiFetch<IngestionJobResponse>('/v1/ingestion/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getIngestionConnectors(): Promise<ConnectorStatusInfo[]> {
  return apiFetch<ConnectorStatusInfo[]>('/v1/ingestion/connectors');
}

export async function getIngestionStatus(ingestionId: string): Promise<IngestionJobResponse> {
  return apiFetch<IngestionJobResponse>(`/v1/ingestion/${ingestionId}`);
}

export async function listIngestions(page: number = 1, pageSize: number = 20): Promise<IngestionListResponse> {
  return apiFetch<IngestionListResponse>(`/v1/ingestion?page=${page}&page_size=${pageSize}`);
}

export async function retryIngestion(ingestionId: string): Promise<IngestionJobResponse> {
  return apiFetch<IngestionJobResponse>(`/v1/ingestion/${ingestionId}/retry`, {
    method: 'POST',
  });
}

export async function deleteIngestion(ingestionId: string): Promise<{ status: string; ingestion_id: string; success: boolean }> {
  return apiFetch<{ status: string; ingestion_id: string; success: boolean }>(`/v1/ingestion/${ingestionId}`, {
    method: 'DELETE',
  });
}
