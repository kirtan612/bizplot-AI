import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { Permission } from '../../types/auth';

export const AccessRestrictedPage: React.FC<{ requiredPermission?: Permission }> = ({
  requiredPermission = 'dashboard.view',
}) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { tokens: t } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: t.accentSoft,
          color: t.warn,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <ShieldAlert size={28} />
      </div>

      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
        Access Restricted
      </h1>
      <p style={{ margin: '6px 0 0', fontSize: 13, color: t.textSub, maxWidth: 420, lineHeight: 1.5 }}>
        Your active role (<strong style={{ color: t.accent }}>{role?.name || 'EMPLOYEE'}</strong>) does not have the permission grant (
        <code style={{ fontSize: 11, background: t.accentSoft, padding: '2px 8px', borderRadius: 999, color: t.accent }}>
          {requiredPermission}
        </code>
        ) required to view this business module.
      </p>

      <button
        onClick={() => navigate('/app')}
        style={{
          marginTop: 24,
          padding: '10px 20px',
          borderRadius: 999,
          background: t.dark,
          color: t.darkText,
          border: 'none',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <ArrowLeft size={14} />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
