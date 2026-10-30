import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  ChevronDown,
  Building2,
  Shield,
  User,
  LogOut,
  Key,
  Settings,
  Check,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

export default function Navbar({ onOpenCreateWorkflow }) {
  const navigate = useNavigate();
  const { currentUser, activeTenant, tenants, switchTenant, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const tenantMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (tenantMenuRef.current && !tenantMenuRef.current.contains(event.target)) {
        setTenantDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Left: Organization / Tenant Context Switcher */}
      <div className="flex items-center gap-3">
        {/* Tenant selector dropdown */}
        <div className="relative" ref={tenantMenuRef}>
          <button
            onClick={() => setTenantDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
              {activeTenant?.name?.charAt(0) || 'O'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="leading-tight truncate max-w-[140px] font-bold">
                {activeTenant?.name || 'Select Tenant'}
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-normal">
                {activeTenant?.tier || 'PRO'}
              </span>
            </div>

            {/* Isolation Strategy Badge */}
            <span
              className={`hidden md:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                activeTenant?.strategy?.includes('Dedicated')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50'
              }`}
            >
              {activeTenant?.strategyBadge || 'Partition'}
            </span>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Tenant Switcher Menu */}
          {tenantDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Switch Organization Context
              </div>
              <div className="py-1 max-h-60 overflow-y-auto space-y-1">
                {tenants.map((tenant) => {
                  const isSelected = tenant.id === activeTenant?.id;
                  return (
                    <button
                      key={tenant.id}
                      onClick={() => {
                        switchTenant(tenant.id);
                        setTenantDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                          {tenant.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="truncate font-semibold">{tenant.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {tenant.database}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    navigate('/tenants');
                    setTenantDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Manage Organizations</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search workflows, executions, nodes, or API keys..."
            className="w-full pl-9 pr-12 py-2 text-xs bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Create Workflow, Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Create Workflow Primary Action Button */}
        <button
          onClick={onOpenCreateWorkflow}
          className="flex items-center gap-1.5 py-1.5 px-3 sm:px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Workflow</span>
          <span className="sm:hidden">Create</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setNotifDropdownOpen((prev) => !prev)}
            className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">
                  Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto space-y-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl transition-colors ${
                      notif.read ? 'opacity-70' : 'bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {notif.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser?.initials || 'AM'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white">
                  {currentUser?.name || 'Alex Morgan'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentUser?.email || 'alex.morgan@acme.com'}
                </div>
                <span className="mt-1.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 font-semibold">
                  Role: {currentUser?.role || 'Owner'}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account & Settings</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/api-keys');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Key className="w-4 h-4 text-slate-400" />
                  <span>API Key Secrets</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/tenants');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Team & Organizations</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
