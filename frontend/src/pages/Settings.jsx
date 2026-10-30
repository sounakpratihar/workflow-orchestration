import React, { useState } from 'react';
import {
  Sliders,
  User,
  Building2,
  Palette,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Database,
  Globe,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { currentUser, activeTenant } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('general');
  const [toastMessage, setToastMessage] = useState(null);

  // General Settings State
  const [workspaceName, setWorkspaceName] = useState(activeTenant?.name || 'Acme Corporation');
  const [defaultTimezone, setDefaultTimezone] = useState('UTC');
  const [webhookBaseUrl, setWebhookBaseUrl] = useState('https://engine.workflow.acme.com/v1');

  // Profile Settings State
  const [userName, setUserName] = useState(currentUser?.name || 'Alex Morgan');
  const [userEmail, setUserEmail] = useState(currentUser?.email || 'alex.morgan@acme.com');

  // Appearance State
  const [gridStyle, setGridStyle] = useState('dots');
  const [compactDensity, setCompactDensity] = useState(false);

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [alertThreshold, setAlertThreshold] = useState('failures_only');

  // Security State
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState('12');
  const [constantTimeVerification, setConstantTimeVerification] = useState(true);

  const handleSave = (section) => {
    setToastMessage(`Settings for "${section}" saved successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Engine Settings
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Manage workspace configuration, database partitions, appearance, and security policies.
        </p>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Tabs Layout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row overflow-hidden">
        {/* Left Tabs Nav */}
        <div className="w-full md:w-56 p-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content Panels */}
        <div className="flex-1 p-6 lg:p-8 text-xs">
          {/* GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  General Workspace Settings
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Global parameters for the orchestrator instance
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Workspace Display Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    System Timezone
                  </label>
                  <select
                    value={defaultTimezone}
                    onChange={(e) => setDefaultTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Public Webhook Ingress Base URL
                  </label>
                  <input
                    type="url"
                    value={webhookBaseUrl}
                    onChange={(e) => setWebhookBaseUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-cyan-600 dark:text-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave('General')}
                className="flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save General Settings</span>
              </button>
            </div>
          )}

          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  User Profile
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Your personal operator credentials and avatar
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {userName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{userName}</div>
                  <div className="text-slate-400">{userEmail}</div>
                  <span className="mt-1 inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-500 border border-indigo-200 dark:border-indigo-800 font-semibold">
                    Role: {currentUser?.role || 'Owner'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave('Profile')}
                className="flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Profile</span>
              </button>
            </div>
          )}

          {/* ORGANIZATION SETTINGS */}
          {activeTab === 'organization' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Multi-Tenant Partition Topology
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Database isolation blueprints & connection string mapping
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Active Isolation Model
                  </label>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {activeTenant?.strategy}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Database: mongodb+srv://cluster.internal/{activeTenant?.database}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Sliding-Window Rate Limit Threshold
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="10,000 requests / minute per tenant partition"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Storage Boundary Quota
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={activeTenant?.storage || '1.8 GB / 10 GB'}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave('Organization')}
                className="flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Organization Settings</span>
              </button>
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Appearance & Canvas Themes
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Visual ergonomics for long engineering sessions
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                    Interface Theme Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <button
                      onClick={toggleTheme}
                      className={`p-3 rounded-xl border flex items-center justify-between font-semibold transition-all ${
                        !isDark
                          ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>Light Mode</span>
                      </div>
                      {!isDark && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </button>

                    <button
                      onClick={toggleTheme}
                      className={`p-3 rounded-xl border flex items-center justify-between font-semibold transition-all ${
                        isDark
                          ? 'border-indigo-500 bg-indigo-950/40 text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-400" />
                        <span>Dark Modern</span>
                      </div>
                      {isDark && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Canvas Background Grid Style
                  </label>
                  <select
                    value={gridStyle}
                    onChange={(e) => setGridStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                  >
                    <option value="dots">Subtle Dot Matrix Grid</option>
                    <option value="lines">Engine Graph Paper Lines</option>
                    <option value="cross">Architectural Cross Markers</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleSave('Appearance')}
                className="flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Theme Preferences</span>
              </button>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Notifications & Incident Alarms
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Real-time webhook and email dispatch triggers
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Instant Email on Workflow Abort
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Dispatches trace logs when a workflow step exhausts retries.
                    </div>
                  </div>
                </label>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Slack Ops Channel Webhook
                  </label>
                  <input
                    type="url"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave('Notifications')}
                className="flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notification Hooks</span>
              </button>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Enterprise Security & Cryptography
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Two-factor enforcement and side-channel attack countermeasures
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Enforce Mandatory 2-Factor Authentication (TOTP)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Requires hardware security key or authenticator app for all tenant members.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={constantTimeVerification}
                    onChange={(e) => setConstantTimeVerification(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Constant-Time API Key Hash Verification
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Enforces <code>crypto.timingSafeEqual</code> in ingress gateways to block timing side-channel attacks.
                    </div>
                  </div>
                </label>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Console Session Idle Timeout (Hours)
                  </label>
                  <select
                    value={sessionTimeoutHours}
                    onChange={(e) => setSessionTimeoutHours(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                  >
                    <option value="4">4 Hours (High Security)</option>
                    <option value="12">12 Hours (Standard Business Day)</option>
                    <option value="24">24 Hours</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleSave('Security')}
                className="flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enforce Security Policies</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
