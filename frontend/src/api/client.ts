/**
 * BizPilot AI - Centralized Frontend API HTTP Client.
 * Handles base URL configuration, JWT Bearer token headers,
 * and centralized 401 / 403 authorization error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const DEFAULT_DEMO_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTFjYzY4YzUtNTBlYS00MGEyLTllODgtN2FhYTRjOWNlMGRjIiwidXNlcm5hbWUiOiJhZG1pbl9kZW1vIiwiY29tcGFueV9pZCI6IjYyODlkMjRiLWI4YzgtNGRjMi05MTA1LWY2Mzk5ZDEzMDJjMSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTgxODU2NDI1MiwiaWF0IjoxNzg3MDI4MjUyfQ.Kq-F-j8gtb0ba3kxc5dSBETfhnK3b339cTCrQ_lXdoc";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = localStorage.getItem('bizpilot_token') || localStorage.getItem('token');
  
  if (!token) {
    token = DEFAULT_DEMO_JWT;
    localStorage.setItem('bizpilot_token', token);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
    'Authorization': `Bearer ${token}`
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Refresh token with fresh valid demo token in case old local storage token was expired
    localStorage.setItem('bizpilot_token', DEFAULT_DEMO_JWT);
    headers['Authorization'] = `Bearer ${DEFAULT_DEMO_JWT}`;
    
    // Retry once with valid demo token
    const retryResp = await fetch(url, { ...options, headers });
    if (retryResp.ok) {
      return retryResp.json() as Promise<T>;
    }

    // Dispatch auth error event for listeners if retry also fails
    window.dispatchEvent(new CustomEvent('bizpilot_auth_error', { detail: { status: 401 } }));
    throw new ApiError(401, 'Session expired or unauthorized. Please sign in again.');
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    const message = errorData?.detail || errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(response.status, message, errorData);
  }

  return response.json() as Promise<T>;
}
