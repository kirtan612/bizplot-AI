import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  KeyRound,
  Bell,
  Sparkles,
  Camera,
  CheckCircle2,
  Lock,
  Globe,
  Smartphone,
  LogOut,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const { theme, tokens: t, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || 'Rhea');
  const [lastName, setLastName] = useState(user?.name.split(' ')[1] || 'Patel');
  const [email, setEmail] = useState(user?.email || 'rhea.patel@bizpilot.ai');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [jobTitle, setJobTitle] = useState('Managing Director & Founder');
  const [department, setDepartment] = useState('Executive Governance');

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Preferences State
  const [aiLiaison, setAiLiaison] = useState('AI CFO');
  const [notificationFrequency, setNotificationFrequency] = useState('Real-Time Digest');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const userInitial = firstName.charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', fontFamily: "'Inter', sans-serif" }}>
      {/* Toast Notification */}
      {isSaved && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: t.dark,
            color: t.darkText,
            padding: '12px 20px',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 100,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          <CheckCircle2 size={16} color={t.ok} />
          <span>Profile changes saved successfully</span>
        </div>
      )}

      {/* Hero Banner Card */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          padding: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        className="hover:shadow-lg"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar with Camera Icon */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: t.accent,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 4px 16px rgba(155, 126, 222, 0.4)',
              }}
            >
              {userInitial}
            </div>
            <button
              aria-label="Upload Avatar"
              title="Change profile picture"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: t.card,
                border: `1px solid ${t.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: t.textSub,
              }}
              className="hover:scale-110"
            >
              <Camera size={13} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                {firstName} {lastName}
              </h1>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: t.accentSoft,
                  color: t.accent,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {role?.name || 'OWNER'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
              {email} • {jobTitle}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, fontSize: 12, color: t.textFaint }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Building2 size={13} /> Ahmedabad Steel & Piping Corp
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={13} color={t.ok} /> Full Owner Privileges
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 999,
            border: `1px solid ${t.border}`,
            background: t.accentSoft,
            color: t.warn,
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'transform 0.15s ease',
          }}
          className="hover:scale-105"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: 8, borderBottom: `1px solid ${t.border}`, paddingBottom: 2 }}>
        {[
          { id: 'profile', label: 'Personal Information', icon: User },
          { id: 'security', label: 'Security & Auth', icon: KeyRound },
          { id: 'preferences', label: 'AI & System Preferences', icon: Sparkles },
        ].map((tb) => {
          const Icon = tb.icon;
          const active = activeTab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: '16px 16px 0 0',
                border: 'none',
                background: active ? t.card : 'transparent',
                borderTop: active ? `2px solid ${t.accent}` : '2px solid transparent',
                borderLeft: active ? `1px solid ${t.border}` : '1px solid transparent',
                borderRight: active ? `1px solid ${t.border}` : '1px solid transparent',
                color: active ? t.text : t.textSub,
                fontSize: 13,
                fontWeight: active ? 700 : 600,
                fontFamily: "'Manrope', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={15} color={active ? t.accent : t.textSub} />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Box */}
      <form onSubmit={handleSave}>
        {activeTab === 'profile' && (
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 28,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: `1px solid ${t.border}`,
                    background: t.page,
                    color: t.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: `1px solid ${t.border}`,
                    background: t.page,
                    color: t.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: 14,
                      border: `1px solid ${t.border}`,
                      background: t.page,
                      color: t.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                  <Mail size={15} color={t.textSub} style={{ position: 'absolute', left: 12, top: 12 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: 14,
                      border: `1px solid ${t.border}`,
                      background: t.page,
                      color: t.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                  <Phone size={15} color={t.textSub} style={{ position: 'absolute', left: 12, top: 12 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: `1px solid ${t.border}`,
                    background: t.page,
                    color: t.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: `1px solid ${t.border}`,
                    background: t.page,
                    color: t.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  borderRadius: 999,
                  background: t.dark,
                  color: t.darkText,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Manrope', sans-serif",
                  transition: 'transform 0.15s ease',
                }}
                className="hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 28,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                Update Password
              </h3>
              <p style={{ margin: '2px 0 16px', fontSize: 12.5, color: t.textSub }}>
                Ensure your password contains at least 8 characters with numbers and special symbols.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      border: `1px solid ${t.border}`,
                      background: t.page,
                      color: t.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      border: `1px solid ${t.border}`,
                      background: t.page,
                      color: t.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      border: `1px solid ${t.border}`,
                      background: t.page,
                      color: t.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: t.textSub }}>
                    Require an authenticator code (TOTP) during sign in for enhanced company security.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: twoFactorEnabled ? t.accentSoft : t.page,
                    border: `1px solid ${t.border}`,
                    color: twoFactorEnabled ? t.accent : t.textSub,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  borderRadius: 999,
                  background: t.dark,
                  color: t.darkText,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Manrope', sans-serif",
                  transition: 'transform 0.15s ease',
                }}
                className="hover:scale-105"
              >
                Update Security Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 28,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
              AI Executive & System Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                  Primary AI Executive Liaison
                </label>
                <select
                  value={aiLiaison}
                  onChange={(e) => setAiLiaison(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: `1px solid ${t.border}`,
                    background: t.page,
                    color: t.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <option value="AI CFO">AI CFO (Financial Operations & Margins)</option>
                  <option value="AI Supply Chain">AI Supply Chain Officer (Stock & Logistics)</option>
                  <option value="AI Sales">AI Chief Commercial Officer (Revenue & Pipeline)</option>
                  <option value="AI HR">AI Chief People Officer (Team Telemetry)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 }}>
                  AI Alert Notification Frequency
                </label>
                <select
                  value={notificationFrequency}
                  onChange={(e) => setNotificationFrequency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: `1px solid ${t.border}`,
                    background: t.page,
                    color: t.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <option value="Real-Time Digest">Real-Time Digest (Instant Critical Alerts)</option>
                  <option value="Hourly Briefing">Hourly Briefing Summary</option>
                  <option value="Daily Executive Report">Daily Executive Summary Only</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: `1px solid ${t.border}` }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                  Interface Theme
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: t.textSub }}>
                  Currently using <strong>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  background: t.accentSoft,
                  color: t.accent,
                  border: `1px solid ${t.border}`,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  borderRadius: 999,
                  background: t.dark,
                  color: t.darkText,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Manrope', sans-serif",
                  transition: 'transform 0.15s ease',
                }}
                className="hover:scale-105"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
