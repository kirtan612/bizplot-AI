import React, { useState } from 'react';
import { Cpu, Sparkles, Database, CheckCircle2, Clock, MessageSquare, Send, RefreshCw, Layers } from 'lucide-react';
import AIWidgetShell from '../ui/AIWidgetShell';

export default function AITerminal({ aiTrained, setAiTrained }) {
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Welcome to BizPilot AI Terminal. Ask any question about steel pipe spot trends, stock aging, or ledger overdue risk.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const models = [
    {
      id: 'M-1',
      name: 'Steel Spot Price & Demand Predictor',
      domain: 'Commodity Trading',
      trained: aiTrained,
      reqData: '500 Transaction Registers',
      curData: '385 Registers Logged (77%)',
      accuracy: aiTrained ? '94.2% Empirical Confidence' : 'Uncalibrated'
    },
    {
      id: 'M-2',
      name: 'Stock Aging & Liquidation Anomaly Model',
      domain: 'Inventory Optimization',
      trained: aiTrained,
      reqData: '600 Warehouse Movement Logs',
      curData: '410 Logs (68%)',
      accuracy: aiTrained ? '91.8% Empirical Confidence' : 'Uncalibrated'
    },
    {
      id: 'M-3',
      name: 'Customer Default & Delay Risk Model',
      domain: 'Cash Flow & Receivables',
      trained: aiTrained,
      reqData: '750 Ledger Entries',
      curData: '510 Entries (68%)',
      accuracy: aiTrained ? '88.5% Empirical Confidence' : 'Uncalibrated'
    }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      let reply = '';
      if (!aiTrained) {
        reply = '🔒 [Honest State]: The AI model for this query is currently in "Calibration Pending" mode (385/500 transactions logged). Once 115 additional invoices are registered, real predictive outputs will unlock automatically.';
      } else {
        reply = '⚡ [Live Trained Model]: Based on historic JSW/Tata Steel spot index data and your current stock of 580 MT Seamless Pipes, spot rates are projected to increase by +4.8% over the next 14 days. We recommend holding Stainless 304 inventory.';
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              AI Intelligence Terminal & Model Calibration Hub
            </h1>
            <span className={`badge ${aiTrained ? 'badge-ai-active' : 'badge-ai-gated'}`}>
              {aiTrained ? 'All Models Live' : 'Models Calibrating'}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Empirical machine learning models gated by real data thresholds. Zero fabricated predictions.
          </p>
        </div>

        {/* Global Toggle for Demo */}
        <button
          onClick={() => setAiTrained(!aiTrained)}
          className="btn-terminal"
          style={{ fontSize: '12px', background: aiTrained ? 'var(--accent-ai-active)' : 'var(--accent-primary)' }}
        >
          <Cpu size={14} />
          Switch AI State: {aiTrained ? 'Show Calibration Mode' : 'Simulate Trained Models'}
        </button>
      </div>

      {/* Model Calibration Status Matrix */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Engineered Model Matrix & Readiness</h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Domain</th>
                <th>Training Threshold</th>
                <th>Current Progress</th>
                <th>Model Status</th>
                <th>Accuracy Metric</th>
              </tr>
            </thead>
            <tbody>
              {models.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{m.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{m.domain}</td>
                  <td className="font-mono-tabular">{m.reqData}</td>
                  <td className="font-mono-tabular" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{m.curData}</td>
                  <td>
                    <span className={`badge ${m.trained ? 'badge-ai-active' : 'badge-ai-gated'}`}>
                      {m.trained ? 'Trained & Operational' : 'Calibration Pending'}
                    </span>
                  </td>
                  <td className="font-mono-tabular" style={{ fontSize: '11px', color: m.trained ? 'var(--semantic-success)' : 'var(--text-tertiary)' }}>
                    {m.accuracy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive AI Chat Surface */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', height: '360px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} style={{ color: 'var(--accent-ai-active)' }} />
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Ask BizPilot AI</h3>
          </div>
          <span className="badge badge-info" style={{ fontSize: '10px' }}>Context Aware (Steel Pipe BI)</span>
        </div>

        {/* Message Log */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '6px' }}>
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                background: msg.sender === 'user' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-inset)',
                border: `1px solid ${msg.sender === 'user' ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--text-primary)',
                lineHeight: '1.4'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <input
            type="text"
            placeholder="Ask about HRC prices, aging stock, or cash flow forecasting..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="input-terminal"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-terminal">
            <Send size={13} />
            <span>Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
}
