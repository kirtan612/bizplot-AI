import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  RotateCcw,
  Sparkles,
  Link,
  Lock,
  Layers,
  FileCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  uploadIngestionFile,
  getIngestionConnectors,
  listIngestions,
  retryIngestion,
  deleteIngestion,
} from '../../api/ingestion';
import type { IngestionJobResponse, ConnectorStatusInfo } from '../../api/ingestion';

export const DataSourcesPage: React.FC = () => {
  const { tokens: t } = useTheme();

  const [connectors, setConnectors] = useState<ConnectorStatusInfo[]>([]);
  const [ingestions, setIngestions] = useState<IngestionJobResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [connData, ingData] = await Promise.all([
        getIngestionConnectors(),
        listIngestions(1, 20)
      ]);
      setConnectors(connData);
      setIngestions(ingData.items);
    } catch (e) {
      console.error('Error fetching ingestion data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        setUploadError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 50 MB limit.`);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await uploadIngestionFile(selectedFile);
      setUploadSuccess(`Successfully ingested '${res.file_name}' (${res.record_count} records processed).`);
      setSelectedFile(null);
      fetchData();
    } catch (e: any) {
      setUploadError(e?.message || 'File upload and ingestion failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleRetry = async (jobId: string) => {
    try {
      await retryIngestion(jobId);
      fetchData();
    } catch (e: any) {
      alert(e?.message || 'Failed to retry ingestion.');
    }
  };

  const handleDelete = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this raw ingestion job?')) {
      try {
        await deleteIngestion(jobId);
        fetchData();
      } catch (e: any) {
        alert(e?.message || 'Failed to delete ingestion job.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={12} /> COMPLETED
          </span>
        );
      case 'PROCESSING':
      case 'VALIDATING':
        return (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={12} className="animate-spin" /> {status}
          </span>
        );
      case 'OCR_REQUIRED':
      case 'TEXT_EXTRACTION_REQUIRED':
        return (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={12} /> OCR REQUIRED
          </span>
        );
      case 'FAILED':
        return (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={12} /> FAILED
          </span>
        );
      default:
        return (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(107, 114, 128, 0.15)', color: '#6B7280' }}>
            {status}
          </span>
        );
    }
  };

  const getConnectorBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>CONNECTED</span>;
      case 'AVAILABLE':
        return <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}>AVAILABLE</span>;
      case 'DEVELOPMENT CONNECTOR':
        return <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>DEV CONNECTOR</span>;
      default:
        return <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(107, 114, 128, 0.2)', color: '#9CA3AF' }}>COMING SOON</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', fontFamily: "'Inter', sans-serif" }}>
      {/* Header Banner */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          padding: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
        }}
        className="flex-col sm:flex-row"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              ENTERPRISE DATA INGESTION
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Data Import & Enterprise Connectors
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Securely upload Excel, CSV, PDF documents, and view enterprise connector statuses.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12, color: t.ok, fontWeight: 700 }}>
          <Lock size={14} color={t.ok} />
          <span>Tenant Isolated & SHA-256 Hashed</span>
        </div>
      </div>

      {/* File Upload Zone */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: t.text }}>Upload Enterprise Business Files</h3>

        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${selectedFile ? t.accent : t.border}`,
            borderRadius: 20,
            padding: 32,
            textAlign: 'center',
            background: selectedFile ? t.accentSoft : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          className="hover:border-purple-400"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <UploadCloud size={36} color={t.accent} style={{ margin: '0 auto 12px' }} />
          <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: t.text }}>
            {selectedFile ? selectedFile.name : 'Click or Drag & Drop File to Upload'}
          </h4>
          <p style={{ margin: 0, fontSize: 12, color: t.textSub }}>
            Supports Excel (.xlsx, .xls), CSV (.csv), and PDF (.pdf) up to 50 MB
          </p>
        </div>

        {uploadError && (
          <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {selectedFile && (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              onClick={() => setSelectedFile(null)}
              style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${t.border}`, background: 'transparent', color: t.textSub, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={uploading}
              style={{ padding: '8px 20px', borderRadius: 999, border: 'none', background: t.accent, color: '#000', fontSize: 12.5, fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {uploading ? <RefreshCw size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              <span>{uploading ? 'Processing Ingestion...' : 'Confirm Upload & Ingest'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Enterprise Connectors Catalog */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.text }}>Enterprise Connectors Catalog</h3>
          <span style={{ fontSize: 11, color: t.textSub, fontWeight: 600 }}>Real Connection Statuses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectors.map((conn) => (
            <div key={conn.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: t.textFaint }}>{conn.category}</span>
                {getConnectorBadge(conn.status)}
              </div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: t.text }}>{conn.name}</h4>
              <p style={{ margin: 0, fontSize: 12, color: t.textSub, lineHeight: 1.4 }}>{conn.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Ingestion History */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.text }}>Recent Ingestion History</h3>
          <button onClick={fetchData} style={{ background: 'transparent', border: 'none', color: t.accent, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: t.textSub }}>
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <span>Loading ingestion history...</span>
          </div>
        ) : ingestions.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: t.textSub, fontSize: 13 }}>
            No files ingested yet. Upload an Excel, CSV, or PDF file above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}`, textAlign: 'left', color: t.textFaint }}>
                  <th style={{ padding: '10px 12px' }}>SOURCE</th>
                  <th style={{ padding: '10px 12px' }}>FILE NAME</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px' }}>RECORDS</th>
                  <th style={{ padding: '10px 12px' }}>SHA-256 HASH</th>
                  <th style={{ padding: '10px 12px' }}>DATE</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {ingestions.map((job) => (
                  <tr key={job.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                    <td style={{ padding: '12px 12px', fontWeight: 700, color: t.text }}>{job.source_type}</td>
                    <td style={{ padding: '12px 12px', color: t.text }}>{job.file_name}</td>
                    <td style={{ padding: '12px 12px' }}>{getStatusBadge(job.status)}</td>
                    <td style={{ padding: '12px 12px', color: t.textSub }}>{job.record_count.toLocaleString()}</td>
                    <td style={{ padding: '12px 12px', fontFamily: 'monospace', fontSize: 11, color: t.textFaint }}>
                      {job.content_hash ? `${job.content_hash.substring(0, 10)}...` : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 12px', color: t.textFaint, fontSize: 11 }}>{job.created_at}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        {job.status === 'FAILED' && (
                          <button onClick={() => handleRetry(job.id)} title="Retry" style={{ background: 'transparent', border: 'none', color: t.accent, cursor: 'pointer' }}>
                            <RotateCcw size={15} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(job.id)} title="Delete" style={{ background: 'transparent', border: 'none', color: t.warn, cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
