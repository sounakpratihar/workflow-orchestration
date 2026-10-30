import React, { useState } from 'react';
import {
  Building2,
  Users2,
  Plus,
  Database,
  Layers,
  Shield,
  Check,
  Mail,
  UserPlus,
  Trash2,
  ExternalLink,
  Lock,
} from 'lucide-react';

import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { MOCK_TEAM_MEMBERS } from '../data/mockData';

export default function Tenants() {
  const { activeTenant, tenants, switchTenant, createTenant } = useAuth();

  const [members, setMembers] = useState(MOCK_TEAM_MEMBERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  // Create Org state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgStrategy, setNewOrgStrategy] = useState('Dedicated Multi-DB Pool');
  const [newOrgTier, setNewOrgTier] = useState('ENTERPRISE');

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember = {
      id: `usr_${Date.now()}`,
      name: inviteEmail.split('@')[0].replace(/[._]/g, ' '),
      email: inviteEmail,
      role: inviteRole,
      avatarBg: 'bg-indigo-600',
      initials: inviteEmail.substring(0, 2).toUpperCase(),
      status: 'INVITED',
      twoFactorEnabled: false,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Pending Invite',
    };

    setMembers([newMember, ...members]);
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const handleCreateOrgSubmit = (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    createTenant({
      name: newOrgName,
      strategy: newOrgStrategy,
      tier: newOrgTier,
    });

    setNewOrgName('');
    setIsCreateOrgModalOpen(false);
  };

  const handleRoleChange = (memberId, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Remove this member from organization?')) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const roleColors = {
    Owner: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50',
    Admin: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    Developer: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50',
    Viewer: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  };

  const memberColumns = [
    {
      header: 'Member',
      key: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {row.initials}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
            <div className="text-[11px] text-slate-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role Assignment',
      key: 'role',
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className={`text-[10px] font-mono px-2 py-1 rounded-lg border font-bold focus:outline-none cursor-pointer ${
            roleColors[row.role] || roleColors.Developer
          }`}
        >
          <option value="Owner">Owner</option>
          <option value="Admin">Admin</option>
          <option value="Developer">Developer</option>
          <option value="Viewer">Viewer</option>
        </select>
      ),
    },
    {
      header: '2FA Security',
      key: 'twoFactorEnabled',
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold ${
            row.twoFactorEnabled ? 'text-emerald-500' : 'text-slate-400'
          }`}
        >
          <Lock className="w-3 h-3" />
          {row.twoFactorEnabled ? 'Enforced' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
            row.status === 'ACTIVE'
              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-500 border-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950 text-amber-500 border-amber-200'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Last Active',
      key: 'lastActive',
      render: (row) => (
        <span className="text-[11px] text-slate-400 font-mono">{row.lastActive}</span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => handleRemoveMember(row.id)}
          title="Remove Member"
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tenant & Team Management
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Switch organization contexts, inspect database isolation strategies, and manage team access.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 py-2 px-3.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-indigo-500" />
            <span>Invite Member</span>
          </button>

          <button
            onClick={() => setIsCreateOrgModalOpen(true)}
            className="flex items-center gap-1.5 py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Organization</span>
          </button>
        </div>
      </div>

      {/* Organization Switcher Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Available Organizations ({tenants.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tenants.map((org) => {
            const isSelected = org.id === activeTenant?.id;
            return (
              <div
                key={org.id}
                onClick={() => switchTenant(org.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
                  isSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold uppercase text-slate-600 dark:text-slate-300">
                      {org.tier}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                        Active Context
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {org.name}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{org.database}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">
                    {org.strategyBadge}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {org.activeWorkflows || 0} Workflows
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Organization Deep-Dive Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{activeTenant?.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 border border-emerald-200 dark:border-emerald-800">
                {activeTenant?.status}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Tenant ID: {activeTenant?.id} • Region: {activeTenant?.region}
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-indigo-500 border-indigo-200 dark:border-indigo-800/40 font-bold">
            {activeTenant?.isolationType}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-slate-400">Partition Strategy</span>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {activeTenant?.strategy}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Monthly Quota</span>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
              {activeTenant?.monthlyExecutions}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Storage Used</span>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
              {activeTenant?.storage}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Service Level Agreement</span>
            <div className="font-semibold text-emerald-500 mt-0.5 font-mono">
              {activeTenant?.sla} Guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Team Members & Access Control
            </h3>
            <p className="text-xs text-slate-400">
              Assigned users with role-based access control (RBAC) in this tenant context.
            </p>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl hover:bg-indigo-100"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        <DataTable
          columns={memberColumns}
          data={members}
          searchPlaceholder="Search team members by name or email..."
          searchKey="email"
          pageSize={6}
        />
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        subtitle={`Grant access to organization "${activeTenant?.name}".`}
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@domain.com"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Organization Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
            >
              <option value="Admin">Admin - Full access to pipelines, keys, and team</option>
              <option value="Developer">Developer - Build and execute workflow DAGs</option>
              <option value="Viewer">Viewer - Read-only inspection of telemetry & logs</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Org Modal */}
      <Modal
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
        title="Provision New Organization"
        subtitle="Configure physical or logical MongoDB tenant partitioning."
      >
        <form onSubmit={handleCreateOrgSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Organization Name
            </label>
            <input
              type="text"
              required
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="e.g. Nexus Financial Systems"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Database Multi-Tenant Isolation Strategy
            </label>
            <select
              value={newOrgStrategy}
              onChange={(e) => setNewOrgStrategy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
            >
              <option value="Dedicated Multi-DB Pool">
                Strategy B: Dedicated DB Pool (Enterprise • Physical DB Boundary)
              </option>
              <option value="Discriminator Scoped Partition">
                Strategy A: Discriminator Scoped (Pro • Logical Collection Partition)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Subscription Plan Tier
            </label>
            <select
              value={newOrgTier}
              onChange={(e) => setNewOrgTier(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
            >
              <option value="ENTERPRISE">Enterprise (Dedicated PITR, CMEK Encryption)</option>
              <option value="PRO">Pro (Shared Cluster, Partitioned Rate Limits)</option>
              <option value="FREE">Free Developer Sandbox</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateOrgModalOpen(false)}
              className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Provision Organization
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
