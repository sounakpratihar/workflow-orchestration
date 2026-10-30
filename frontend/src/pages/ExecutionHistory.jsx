import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Play,
  RotateCcw,
  StopCircle,
  Eye,
  FileCode,
  Clock,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Calendar,
} from 'lucide-react';

import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { executionService } from '../services/executionService';
import { useAuth } from '../context/AuthContext';

export default function ExecutionHistory() {
  const navigate = useNavigate();
  const { activeTenant } = useAuth();

  const [executions, setExecutions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLogExec, setSelectedLogExec] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const loadData = async () => {
    const list = await executionService.getExecutions({
      status: statusFilter,
      tenantId: activeTenant?.id,
    });
    setExecutions(list);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, activeTenant]);

  const handleRetry = async (id) => {
    const retryExec = await executionService.retryExecution(id);
    if (retryExec) {
      loadData();
      navigate(`/executions/${retryExec.id}`);
    }
  };

  const handleCancel = async (id) => {
    await executionService.cancelExecution(id);
    loadData();
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statusBadges = {
    RUNNING: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50',
    COMPLETED: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    FAILED: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50',
    PAUSED: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    CANCELLED: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  };

  const columns = [
    {
      header: 'Execution ID',
      key: 'id',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-slate-200 font-bold">
          <span
            onClick={() => navigate(`/executions/${row.id}`)}
            className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-dotted"
          >
            {row.id}
          </span>
          <button
            onClick={() => copyId(row.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Copy ID"
          >
            <Copy className="w-3 h-3" />
          </button>
          {copiedId === row.id && <span className="text-[10px] text-emerald-500">Copied!</span>}
        </div>
      ),
    },
    {
      header: 'Workflow Name',
      key: 'workflowName',
      sortable: true,
      render: (row) => (
        <div>
          <div
            onClick={() => navigate(`/executions/${row.id}`)}
            className="font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {row.workflowName}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {row.trigger}
          </div>
        </div>
      ),
    },
    {
      header: 'Tenant Partition',
      key: 'tenantName',
      sortable: true,
      render: (row) => (
        <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
          {row.tenantName || row.tenantId}
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
            statusBadges[row.status] || statusBadges.RUNNING
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === 'RUNNING'
                ? 'bg-indigo-500 animate-pulse'
                : row.status === 'COMPLETED'
                ? 'bg-emerald-500'
                : 'bg-rose-500'
            }`}
          />
          {row.status}
        </span>
      ),
    },
    {
      header: 'Started At',
      key: 'startedAt',
      sortable: true,
      render: (row) => (
        <div className="font-mono text-[11px] text-slate-500">
          {new Date(row.startedAt).toLocaleString()}
        </div>
      ),
    },
    {
      header: 'Duration',
      key: 'durationMs',
      sortable: true,
      render: (row) => (
        <div className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          {row.durationMs}ms
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/executions/${row.id}`)}
            title="Inspect Execution Timeline"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSelectedLogExec(row)}
            title="View Raw Logs"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FileCode className="w-3.5 h-3.5" />
          </button>

          {row.status === 'RUNNING' ? (
            <button
              onClick={() => handleCancel(row.id)}
              title="Cancel Execution"
              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
            >
              <StopCircle className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => handleRetry(row.id)}
              title="Retry Execution"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Execution History
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Audit logs and execution traces across tenant workers and clusters.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs self-start sm:self-auto">
          {['ALL', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={executions}
        searchPlaceholder="Filter executions by ID, workflow, or trigger..."
        searchKey="workflowName"
        pageSize={8}
      />

      {/* Logs Drawer Modal */}
      {selectedLogExec && (
        <Modal
          isOpen={!!selectedLogExec}
          onClose={() => setSelectedLogExec(null)}
          title={`Execution Log: ${selectedLogExec.id}`}
          subtitle={`Workflow: ${selectedLogExec.workflowName} • Status: ${selectedLogExec.status}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 max-h-96">
              <div className="text-slate-500 mb-2">// Tenant Engine Execution Trace Stream</div>
              <div>[INFO] BINDING_TENANT_CONTEXT: {selectedLogExec.tenantId}</div>
              <div>[INFO] TRIGGER_TYPE: {selectedLogExec.trigger}</div>
              <div>[INFO] STARTED_AT: {selectedLogExec.startedAt}</div>
              {selectedLogExec.timeline?.map((step, i) => (
                <div key={i} className="mt-1">
                  <span className="text-indigo-400">[{step.timestamp}]</span> STEP {i + 1}: "{step.step}" ➔ <span className={step.status === 'FAILED' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{step.status}</span> ({step.duration})
                  {step.message && <div className="text-slate-400 pl-4">{step.message}</div>}
                </div>
              ))}
              <div className="mt-2 text-slate-500">// End of execution journal</div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedLogExec(null)}
                className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate(`/executions/${selectedLogExec.id}`);
                  setSelectedLogExec(null);
                }}
                className="py-2 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
              >
                View Live Telemetry
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
