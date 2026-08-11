import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StockAlert {
  id: string;
  item: string;
  remaining: string;
}

const MOCK_STOCK_ALERTS: StockAlert[] = [
  { id: '1', item: '50x50 Hollow Section', remaining: '0.00 Kg remaining' },
  { id: '2', item: '4" Seamless ASTM A53', remaining: '15.00 Kg remaining' },
  { id: '3', item: '3" ERW Pipe IS 1239', remaining: '25.00 Kg remaining' },
  { id: '4', item: '1/2" GI Pipe IS 1239', remaining: '200.00 Kg remaining' },
];

export const LowStockAlertsPanel: React.FC = () => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 28,
        padding: 22,
        borderLeft: `4px solid ${t.warn}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="hover:-translate-y-1 hover:shadow-lg"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <CircleAlert size={16} color={t.warn} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
          Low Stock Alerts
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_STOCK_ALERTS.map((alert) => (
          <div key={alert.id} style={{ paddingBottom: 10, borderBottom: `1px solid ${t.border}` }} className="group">
            <h4 style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }} className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {alert.item}
            </h4>
            <p style={{ margin: '2px 0 6px', fontSize: 11.5, color: t.textFaint, fontFamily: "'Inter', sans-serif" }}>
              {alert.remaining}
            </p>
            <button
              onClick={() => navigate('/app/inventory')}
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 600,
                color: t.warn,
                background: t.accentSoft,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'transform 0.15s ease, background 0.15s ease',
              }}
              className="hover:scale-105"
            >
              Restock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
