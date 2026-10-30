import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CreateWorkflowModal from './components/CreateWorkflowModal';

import Dashboard from './pages/Dashboard';
import Workflows from './pages/Workflows';
import WorkflowBuilder from './pages/WorkflowBuilder';
import Executions from './pages/Executions';
import ExecutionHistory from './pages/ExecutionHistory';
import ApiKeys from './pages/ApiKeys';
import Tenants from './pages/Tenants';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Protected App Shell with responsive Sidebar, Topbar, and globally accessible Create Modal
function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // If unauthenticated in production, can redirect to login.
  // For demo convenience, allow viewing or redirect:
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar onOpenCreateWorkflow={() => setIsCreateModalOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ onOpenCreateWorkflow: () => setIsCreateModalOpen(true) }} />
        </main>
      </div>

      {/* Global Quick Create Modal */}
      <CreateWorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Application Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route
                path="/"
                element={
                  <OutletConsumerComponent>
                    {({ onOpenCreateWorkflow }) => <Dashboard onOpenCreateWorkflow={onOpenCreateWorkflow} />}
                  </OutletConsumerComponent>
                }
              />
              <Route
                path="/workflows"
                element={
                  <OutletConsumerComponent>
                    {({ onOpenCreateWorkflow }) => <Workflows onOpenCreateWorkflow={onOpenCreateWorkflow} />}
                  </OutletConsumerComponent>
                }
              />
              <Route path="/builder" element={<WorkflowBuilder />} />
              <Route path="/executions/live" element={<Executions />} />
              <Route path="/executions/:id" element={<Executions />} />
              <Route path="/executions" element={<ExecutionHistory />} />
              <Route path="/api-keys" element={<ApiKeys />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Helper to pass outlet context to child page
import { useOutletContext } from 'react-router-dom';
function OutletConsumerComponent({ children }) {
  const context = useOutletContext();
  return children(context || {});
}
