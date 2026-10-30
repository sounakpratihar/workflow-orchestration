import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_TENANTS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('wf_auth_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // ignore
    }
    return {
      id: 'usr_01',
      name: 'Alex Morgan',
      email: 'alex.morgan@acme.com',
      role: 'Owner',
      avatarBg: 'bg-indigo-600',
      initials: 'AM',
    };
  });

  const [activeTenant, setActiveTenant] = useState(() => {
    try {
      const savedTenantId = localStorage.getItem('wf_active_tenant');
      if (savedTenantId) {
        const found = MOCK_TENANTS.find((t) => t.id === savedTenantId);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return MOCK_TENANTS[0];
  });

  const [tenants, setTenants] = useState(MOCK_TENANTS);

  useEffect(() => {
    if (activeTenant) {
      localStorage.setItem('wf_active_tenant', activeTenant.id);
    }
  }, [activeTenant]);

  const switchTenant = (tenantId) => {
    const found = tenants.find((t) => t.id === tenantId);
    if (found) {
      setActiveTenant(found);
      localStorage.setItem('wf_active_tenant', found.id);
    }
  };

  const createTenant = (newTenantData) => {
    const newTenant = {
      id: newTenantData.id || `org_${Date.now().toString(36)}`,
      name: newTenantData.name,
      tier: newTenantData.tier || 'PRO',
      strategy: newTenantData.strategy || 'Dedicated Multi-DB Pool',
      strategyBadge: newTenantData.strategy === 'Dedicated Multi-DB Pool' ? 'Dedicated DB Pool' : 'Discriminator Scoped',
      database: `tenant_${newTenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      isolationType: newTenantData.strategy === 'Dedicated Multi-DB Pool' ? 'Physical Database Boundary' : 'Logical Scoped Collection',
      storage: '0 MB / 5 GB',
      activeWorkflows: 0,
      totalWorkflows: 0,
      membersCount: 1,
      monthlyExecutions: '0 / 100,000',
      sla: '99.9%',
      region: 'us-east-1 (N. Virginia)',
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
    };

    setTenants((prev) => [newTenant, ...prev]);
    setActiveTenant(newTenant);
    return newTenant;
  };

  const login = (email, password) => {
    const user = {
      id: 'usr_01',
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: 'Owner',
      avatarBg: 'bg-indigo-600',
      initials: email.substring(0, 2).toUpperCase(),
    };
    setCurrentUser(user);
    localStorage.setItem('wf_auth_user', JSON.stringify(user));
    localStorage.setItem('wf_auth_token', 'jwt_demo_session_token_' + Date.now());
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wf_auth_user');
    localStorage.removeItem('wf_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeTenant,
        tenants,
        switchTenant,
        createTenant,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
