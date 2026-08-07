import React, { useState } from 'react';
import LandingPage from './landing/LandingPage';
import AuthPage from './auth/AuthPage';
import AppLayout from './layouts/AppLayout/AppLayout';
import ShellContent from './layouts/AppLayout/ShellContent';

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'auth' | 'app'

  // Landing Page Mode
  if (viewMode === 'landing') {
    return <LandingPage onNavigateToApp={() => setViewMode('auth')} />;
  }

  // Enterprise Auth & Onboarding Mode
  if (viewMode === 'auth') {
    return (
      <AuthPage
        initialView="login"
        onNavigateHome={() => setViewMode('landing')}
        onAuthComplete={() => setViewMode('app')}
      />
    );
  }

  // Internal BizPilot AI Operating System App Shell
  return (
    <AppLayout>
      <ShellContent onExitToLanding={() => setViewMode('landing')} />
    </AppLayout>
  );
}
