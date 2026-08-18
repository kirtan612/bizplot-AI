import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Sleek Branded Preloader Component
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
    <div className="w-10 h-10 border-2 border-[#CF9EFF]/30 border-t-[#CF9EFF] rounded-full animate-spin" />
    <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase animate-pulse">
      BIZPILOT AI
    </span>
  </div>
);

// Public Landing Page & Auth Routes (Code Split)
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const SignInPage = lazy(() => import('./pages/auth/SignInPage').then(m => ({ default: m.SignInPage })));
const RegisterChoicePage = lazy(() => import('./pages/auth/RegisterChoicePage').then(m => ({ default: m.RegisterChoicePage })));
const CreateCompanyPage = lazy(() => import('./pages/auth/CreateCompanyPage').then(m => ({ default: m.CreateCompanyPage })));
const JoinCompanyPage = lazy(() => import('./pages/auth/JoinCompanyPage').then(m => ({ default: m.JoinCompanyPage })));
const AcceptInvitationPage = lazy(() => import('./pages/auth/AcceptInvitationPage').then(m => ({ default: m.AcceptInvitationPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));

// App Module & AI Executive Command Center Pages (Code Split)
const DashboardPage = lazy(() => import('./pages/app/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ExecutiveCenterPage = lazy(() => import('./pages/app/ExecutiveCenterPage').then(m => ({ default: m.ExecutiveCenterPage })));
const ExecutiveWorkspacePage = lazy(() => import('./pages/app/ExecutiveWorkspacePage').then(m => ({ default: m.ExecutiveWorkspacePage })));
const ExecutiveRoomPage = lazy(() => import('./pages/app/ExecutiveRoomPage').then(m => ({ default: m.ExecutiveRoomPage })));

const SalesPage = lazy(() => import('./pages/app/SalesPage').then(m => ({ default: m.SalesPage })));
const CustomersPage = lazy(() => import('./pages/app/CustomersPage').then(m => ({ default: m.CustomersPage })));
const InventoryPage = lazy(() => import('./pages/app/InventoryPage').then(m => ({ default: m.InventoryPage })));
const PurchasesPage = lazy(() => import('./pages/app/PurchasesPage').then(m => ({ default: m.PurchasesPage })));
const InvoicesPage = lazy(() => import('./pages/app/InvoicesPage').then(m => ({ default: m.InvoicesPage })));
const ExpensesPage = lazy(() => import('./pages/app/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const FinancePage = lazy(() => import('./pages/app/FinancePage').then(m => ({ default: m.FinancePage })));
const CashflowPage = lazy(() => import('./pages/app/CashflowPage').then(m => ({ default: m.CashflowPage })));
const ReportsPage = lazy(() => import('./pages/app/ReportsPage').then(m => ({ default: m.ReportsPage })));
const AIInsightsPage = lazy(() => import('./pages/app/AIInsightsPage').then(m => ({ default: m.AIInsightsPage })));
const DataSourcesPage = lazy(() => import('./pages/app/DataSourcesPage').then(m => ({ default: m.DataSourcesPage })));
const CompanyKnowledgePage = lazy(() => import('./pages/app/CompanyKnowledgePage').then(m => ({ default: m.CompanyKnowledgePage })));
const ProfilePage = lazy(() => import('./pages/app/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Governance & Settings Pages (Code Split)
const TeamManagementPage = lazy(() => import('./pages/app/TeamManagementPage').then(m => ({ default: m.TeamManagementPage })));
const RoleManagementPage = lazy(() => import('./pages/app/RoleManagementPage').then(m => ({ default: m.RoleManagementPage })));

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/register" element={<RegisterChoicePage />} />
            <Route path="/create-company" element={<CreateCompanyPage />} />
            <Route path="/join-company" element={<JoinCompanyPage />} />
            <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Multi-Tenant App Layout */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route
                path="executives"
                element={
                  <ProtectedRoute requiredPermission="ai.executive_center.view">
                    <ExecutiveCenterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ai/:executiveId"
                element={
                  <ProtectedRoute>
                    <ExecutiveWorkspacePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="executive-room"
                element={
                  <ProtectedRoute requiredPermission="ai.executive_room.view">
                    <ExecutiveRoomPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ai-insights"
                element={
                  <ProtectedRoute requiredPermission="ai.insights.view">
                    <AIInsightsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="data-sources"
                element={
                  <ProtectedRoute requiredPermission="dashboard.view">
                    <DataSourcesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="company-knowledge"
                element={
                  <ProtectedRoute requiredPermission="dashboard.view">
                    <CompanyKnowledgePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sales"
                element={
                  <ProtectedRoute requiredPermission="sales.view">
                    <SalesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customers"
                element={
                  <ProtectedRoute requiredPermission="customers.view">
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="inventory"
                element={
                  <ProtectedRoute requiredPermission="inventory.view">
                    <InventoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="purchases"
                element={
                  <ProtectedRoute requiredPermission="purchases.view">
                    <PurchasesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="invoices"
                element={
                  <ProtectedRoute requiredPermission="invoices.view">
                    <InvoicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="expenses"
                element={
                  <ProtectedRoute requiredPermission="expenses.view">
                    <ExpensesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="finance"
                element={
                  <ProtectedRoute requiredPermission="finance.view">
                    <FinancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cashflow"
                element={
                  <ProtectedRoute requiredPermission="cashflow.view">
                    <CashflowPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute requiredPermission="reports.view">
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Protected Governance Routes */}
            <Route
              path="/team"
              element={
                <ProtectedRoute requiredPermission="users.view">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeamManagementPage />} />
            </Route>

            <Route
              path="/settings/roles"
              element={
                <ProtectedRoute requiredPermission="roles.view">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RoleManagementPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
