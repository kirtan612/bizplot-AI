import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GlobalSearchModal } from './layout/GlobalSearchModal';
import { Sparkles, Settings, Sun, Moon, Bell, Search, ChevronDown, Check, User, LogOut } from 'lucide-react';
import type { Permission } from '../types/auth';
import { MOCK_AI_ALERTS } from '../mock/alertData';

interface NavItem {
  label: string;
  path: string;
  permission: Permission;
}

const RoleSwitcherDropdown: React.FC = () => {
  const { role, switchDemoRole } = useAuth();
  const { tokens: t } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roles = [
    { id: 'OWNER', label: 'Owner' },
    { id: 'MANAGER', label: 'Manager' },
    { id: 'ACCOUNTANT', label: 'Accountant' },
    { id: 'EMPLOYEE', label: 'Employee' },
  ];

  const currentRoleLabel = roles.find((r) => r.id === (role?.name || 'OWNER'))?.label || 'Owner';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch Role"
        title="Switch demo role"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: t.accentSoft,
          borderRadius: 999,
          padding: '5px 12px',
          height: 30,
          border: 'none',
          cursor: 'pointer',
          color: t.text,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "'Manrope', sans-serif",
          outline: 'none',
          transition: 'all 0.15s ease',
        }}
        className="hover:scale-102"
      >
        <span>{currentRoleLabel}</span>
        <ChevronDown
          size={12}
          color={t.textSub}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 0,
            minWidth: 140,
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 16,
            boxShadow: t.mode === 'light' ? '0 8px 24px rgba(0,0,0,0.1)' : '0 8px 24px rgba(0,0,0,0.5)',
            padding: 6,
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {roles.map((r) => {
            const isSelected = (role?.name || 'OWNER') === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  switchDemoRole(r.id as any);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: isSelected ? t.accentSoft : 'transparent',
                  color: isSelected ? t.accent : t.text,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 700 : 600,
                  fontFamily: "'Manrope', sans-serif",
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                }}
                className={isSelected ? '' : 'hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300'}
              >
                <span>{r.label}</span>
                {isSelected && <Check size={13} color={t.accent} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const UserMenuDropdown: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const { tokens: t } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'R';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Menu"
        title="User profile & options"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: t.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: 12,
          fontFamily: "'Manrope', sans-serif",
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          margin: 0,
          lineHeight: '30px',
          outline: 'none',
          boxShadow: '0 2px 6px rgba(155, 126, 222, 0.3)',
          transition: 'transform 0.15s ease',
        }}
        className="hover:scale-105"
      >
        <span style={{ display: 'block', width: '100%', textAlign: 'center', lineHeight: '30px' }}>{userInitial}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 40,
            width: 220,
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 18,
            boxShadow: t.mode === 'light' ? '0 12px 32px rgba(0,0,0,0.12)' : '0 12px 32px rgba(0,0,0,0.6)',
            padding: 12,
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ padding: '4px 8px 8px', borderBottom: `1px solid ${t.border}`, marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
              {user?.name || 'Rhea Patel'}
            </div>
            <div style={{ fontSize: 11, color: t.textSub, marginTop: 1 }} className="truncate">
              {user?.email || 'rhea.patel@bizpilot.ai'}
            </div>
            <span
              style={{
                display: 'inline-block',
                marginTop: 6,
                padding: '2px 8px',
                borderRadius: 999,
                background: t.accentSoft,
                color: t.accent,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {role?.name || 'OWNER'}
            </span>
          </div>

          <button
            onClick={() => {
              navigate('/app/profile');
              setIsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 10,
              border: 'none',
              background: 'transparent',
              color: t.text,
              fontSize: 12.5,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
            className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            <User size={14} />
            <span>View Profile</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 10,
              border: 'none',
              background: 'transparent',
              color: t.warn,
              fontSize: 12.5,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
            className="hover:bg-amber-500/10 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const AppLayout: React.FC = () => {
  const { hasPermission } = useAuth();
  const { theme, tokens: t, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close notifications popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotificationsOpen]);

  const navItems: NavItem[] = [
    { label: 'AI Executives', path: '/app/executives', permission: 'ai.executive_center.view' },
    { label: 'Boardroom', path: '/app/executive-room', permission: 'ai.executive_room.view' },
    { label: 'Sales', path: '/app/sales', permission: 'sales.view' },
    { label: 'Customers', path: '/app/customers', permission: 'customers.view' },
    { label: 'Inventory', path: '/app/inventory', permission: 'inventory.view' },
    { label: 'Finance', path: '/app/finance', permission: 'finance.view' },
    { label: 'Reports', path: '/app/reports', permission: 'reports.view' },
    { label: 'Team', path: '/team', permission: 'users.view' },
  ];

  const visibleNav = navItems.filter((item) => hasPermission(item.permission));

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const criticalAlertCount = MOCK_AI_ALERTS.filter((a) => a.category === 'Critical').length;

  return (
    <div
      style={{
        background: t.page,
        color: t.text,
        minHeight: '100vh',
        padding: '22px 32px',
        fontFamily: "'Inter', sans-serif",
        transition: 'background 0.2s ease',
      }}
    >
      {/* TopNav Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        {/* Brand Pill */}
        <div
          onClick={() => navigate('/app')}
          title="Go to Dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 999,
            padding: '8px 16px 8px 12px',
            flexShrink: 0,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'transform 0.15s ease, border-color 0.15s ease',
          }}
          className="hover:scale-102 hover:border-purple-300 dark:hover:border-purple-800"
        >
          <div style={{ width: 22, height: 22, borderRadius: 7, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={12} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: -0.3, color: t.text }}>
            BizPilot
          </span>
        </div>

        {/* Navigation Pills */}
        <nav
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 999,
            padding: 4,
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            flexWrap: 'wrap',
          }}
        >
          {visibleNav.map((item) => {
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  background: active ? t.dark : 'transparent',
                  color: active ? t.darkText : t.textSub,
                  transition: 'all 0.15s ease',
                }}
                className={active ? '' : 'hover:text-purple-600 dark:hover:text-purple-300'}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Cohesive, Perfectly Centered Right Action Bar Container */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 999,
            padding: '4px 6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            flexShrink: 0,
          }}
        >
          {/* Quick Search Icon Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            title="Search data (Cmd+K)"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              color: t.textSub,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              margin: 0,
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
            className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300"
          >
            <Search size={14} />
          </button>

          {/* Custom Sleek Role Switcher Dropdown */}
          <RoleSwitcherDropdown />

          {/* Settings Button */}
          <button
            onClick={() => navigate('/settings/roles')}
            aria-label="Settings"
            title="Security & Roles"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              color: t.textSub,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              margin: 0,
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
            className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300"
          >
            <Settings size={14} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Switch light/dark theme"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              color: t.textSub,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              margin: 0,
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
            className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300"
          >
            {theme === 'light' ? <Moon size={14} color={t.textSub} /> : <Sun size={14} color={t.textSub} />}
          </button>

          {/* Notifications Button */}
          <div ref={notificationsRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="Notifications"
              title="AI Notifications"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: t.textSub,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                margin: 0,
                outline: 'none',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300"
            >
              <Bell size={14} color={t.textSub} />
              {criticalAlertCount > 0 && (
                <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', background: t.warn }} />
              )}
            </button>

            {isNotificationsOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 40,
                  width: 320,
                  background: t.card,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  boxShadow: t.mode === 'light' ? '0 12px 32px rgba(0,0,0,0.12)' : '0 12px 32px rgba(0,0,0,0.6)',
                  padding: 16,
                  zIndex: 50,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>AI Alerts</span>
                  <span style={{ fontSize: 11, color: t.accent, fontWeight: 600 }}>{MOCK_AI_ALERTS.length} new</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
                  {MOCK_AI_ALERTS.map((alt) => (
                    <div key={alt.id} style={{ padding: 10, borderRadius: 12, background: t.accentSoft, border: `1px solid ${t.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: t.text }}>
                        <span>{alt.title}</span>
                        <span style={{ fontSize: 10, color: t.textSub }}>{alt.timestamp}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 11.5, color: t.textSub, lineHeight: 1.4 }}>{alt.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu Dropdown Popover */}
          <UserMenuDropdown />
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Viewport Content */}
      <main style={{ width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
};
