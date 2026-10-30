import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GitBranch,
  Hammer,
  PlayCircle,
  History,
  KeyRound,
  Users2,
  Settings,
  Database,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { activeTenant } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Workflows', path: '/workflows', icon: GitBranch },
    { label: 'Workflow Builder', path: '/builder', icon: Hammer },
    { label: 'Live Monitoring', path: '/executions/live', icon: PlayCircle },
    { label: 'Execution History', path: '/executions', icon: History },
    { label: 'API Keys', path: '/api-keys', icon: KeyRound },
    { label: 'Team & Tenants', path: '/tenants', icon: Users2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/30 shrink-0 text-base">
            Ω
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
                FlowForge
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-500 dark:text-indigo-400 font-bold">
                Orchestration Engine
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Multi-Tenant Partition Telemetry */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-[11px]">
          <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <Database className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate font-mono">{activeTenant?.database || 'workflow_platform'}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          </div>

          <div className="text-[10px] text-slate-400 font-mono mb-2">
            Storage: {activeTenant?.storage || '1.8 GB / 10 GB'}
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '42%' }} />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>SLA: {activeTenant?.sla || '99.99%'}</span>
            <span className="text-emerald-500 font-semibold">Healthy</span>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center border-t border-slate-200 dark:border-slate-800">
          <Database className="w-5 h-5 text-indigo-500" title={`Connected: ${activeTenant?.database}`} />
        </div>
      )}
    </aside>
  );
}
