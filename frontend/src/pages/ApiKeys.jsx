import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Ban,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Layers,
  Clock,
} from 'lucide-react';

import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';
import { apiKeyService } from '../services/apiKeyService';
import { useAuth } from '../context/AuthContext';

export default function ApiKeys() {
  const { activeTenant } = useAuth();

  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnvironment, setNewKeyEnvironment] = useState('production');
  const [newKeyScopes, setNewKeyScopes] = useState([
    'workflows:read',
    'workflows:execute',
  ]);
  const [generatedKeyResult, setGeneratedKeyResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadKeys = async () => {
    setLoading(true);
    const data = await apiKeyService.getApiKeys(activeTenant?.id);
    setKeys(data);
    setLoading(false);
  };

  useEffect(() => {
    loadKeys();
  }, [activeTenant]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleRevoke = async (id) => {
    if (window.confirm('Are you sure you want to revoke this API key immediately?')) {
      await apiKeyService.revokeApiKey(id);
      loadKeys();
    }
  };

  const handleRotate = async (id) => {
    if (window.confirm('Rotate this key? The previous key secret will be revoked.')) {
      const rotated = await apiKeyService.rotateApiKey(id);
      setGeneratedKeyResult(rotated);
      loadKeys();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Permanently delete this key record?')) {
      await apiKeyService.deleteApiKey(id);
      loadKeys();
    }
  };

  const handleGenerateKeySubmit = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsGenerating(true);
    try {
      const created = await apiKeyService.generateApiKey({
        name: newKeyName,
        scopes: newKeyScopes,
        environment: newKeyEnvironment,
        tenantId: activeTenant?.id,
      });
      setGeneratedKeyResult(created);
      loadKeys();
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleScope = (scope) => {
    setNewKeyScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const columns = [
    {
      header: 'Key Name & Environment',
      key: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{row.name}</span>
            <span
              className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border font-semibold ${
                row.environment === 'production'
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200'
              }`}
            >
              {row.environment || 'prod'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {row.scopes?.map((s) => (
              <span
                key={s}
                className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      header: 'Masked API Key',
      key: 'keyMasked',
      render: (row) => (
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
            {row.keyMasked}
          </span>
          <button
            onClick={() => handleCopy(row.id, row.fullKey || row.keyMasked)}
            title="Copy Key Secret"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {copiedKeyId === row.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
            row.status === 'ACTIVE'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          {row.status}
        </span>
      ),
    },
    {
      header: 'Created Date',
      key: 'createdAt',
      sortable: true,
      render: (row) => (
        <div className="font-mono text-[11px] text-slate-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: 'Last Used',
      key: 'lastUsedAt',
      render: (row) => (
        <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{row.lastUsedAt || 'Never'}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleRotate(row.id)}
            title="Rotate Key Secret"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {row.status === 'ACTIVE' && (
            <button
              onClick={() => handleRevoke(row.id)}
              title="Revoke Key"
              className="p-1.5 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
            >
              <Ban className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            title="Delete Key"
            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            API Key Credentials
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Cryptographic bearer keys for tenant partition: {activeTenant?.name}.
          </p>
        </div>

        <button
          onClick={() => {
            setGeneratedKeyResult(null);
            setNewKeyName('');
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Key</span>
        </button>
      </div>

      {/* Cryptographic Architecture Card */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed text-indigo-900 dark:text-indigo-200">
          <strong className="font-bold">Cryptographic Multi-Tenant Verification:</strong> All keys conform to{' '}
          <code className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 font-mono text-[11px]">
            wk_live_&lt;tenantId&gt;_&lt;entropy&gt;.&lt;checksum&gt;
          </code>. The engine resolves tenant context ambiently via AsyncLocalStorage and verifies signatures using constant-time comparison (<code>crypto.timingSafeEqual</code>) to prevent timing side-channel exploits.
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active API Keys"
          value={keys.filter((k) => k.status === 'ACTIVE').length}
          icon={KeyRound}
          color="indigo"
          period="Across active environments"
        />
        <StatCard
          title="Daily Request Volume"
          value="184,320"
          change="+18.5%"
          changeType="positive"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Revoked Keys"
          value={keys.filter((k) => k.status === 'REVOKED').length}
          icon={Ban}
          color="rose"
          period="Safely invalidated credentials"
        />
      </div>

      {/* Keys Table */}
      <DataTable
        columns={columns}
        data={keys}
        searchPlaceholder="Filter keys by name, scope, or status..."
        searchKey="name"
        pageSize={6}
      />

      {/* Generate API Key Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={generatedKeyResult ? 'API Key Generated Successfully' : 'Generate Cryptographic API Key'}
        subtitle={
          generatedKeyResult
            ? 'Copy your secret token now. For security, it will not be shown again.'
            : `Issue credentials scoped strictly to tenant "${activeTenant?.name}".`
        }
      >
        {generatedKeyResult ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Secret token display:</strong> We cannot recover this key after you close this modal. Store it securely in your deployment environment or secrets vault.
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Your New API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedKeyResult.fullKey}
                  className="w-full px-3 py-2 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800"
                />
                <button
                  onClick={() => handleCopy('new', generatedKeyResult.fullKey)}
                  className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center gap-1 shrink-0"
                >
                  {copiedKeyId === 'new' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="py-2 px-5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-semibold"
              >
                I Have Saved My Secret
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerateKeySubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Key Identifier / Purpose
              </label>
              <input
                type="text"
                required
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Production Worker Daemon"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Environment Tier
              </label>
              <select
                value={newKeyEnvironment}
                onChange={(e) => setNewKeyEnvironment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
              >
                <option value="production">Production (Rate limit: 10,000 req/min)</option>
                <option value="staging">Staging (Rate limit: 2,000 req/min)</option>
                <option value="development">Development (Rate limit: 500 req/min)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Permission Scopes
              </label>
              <div className="space-y-2">
                {[
                  { id: 'workflows:read', desc: 'Read workflows and inspect definitions' },
                  { id: 'workflows:write', desc: 'Create, update, and delete workflow DAGs' },
                  { id: 'workflows:execute', desc: 'Trigger manual executions & webhooks' },
                  { id: 'keys:manage', desc: 'Rotate and revoke cryptographic credentials' },
                ].map((scope) => (
                  <label
                    key={scope.id}
                    className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newKeyScopes.includes(scope.id)}
                      onChange={() => toggleScope(scope.id)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {scope.id}
                      </div>
                      <div className="text-[11px] text-slate-400">{scope.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || !newKeyName.trim()}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Issue Key'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
