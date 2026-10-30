import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Grid,
  List,
  Sparkles,
  Play,
  Copy,
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

import WorkflowCard from '../components/WorkflowCard';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { workflowService } from '../services/workflowService';
import { executionService } from '../services/executionService';

export default function Workflows({ onOpenCreateWorkflow }) {
  const navigate = useNavigate();
  const { activeTenant } = useAuth();

  const [workflows, setWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [loading, setLoading] = useState(true);

  // Load workflows
  const loadWorkflows = async () => {
    setLoading(true);
    const data = await workflowService.getWorkflows(activeTenant?.id);
    setWorkflows(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWorkflows();
  }, [activeTenant]);

  // Handlers
  const handleEdit = (wf) => {
    navigate(`/builder?id=${wf.id}`);
  };

  const handleDuplicate = async (id) => {
    await workflowService.duplicateWorkflow(id);
    loadWorkflows();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workflow DAG?')) {
      await workflowService.deleteWorkflow(id);
      loadWorkflows();
    }
  };

  const handleToggleStatus = async (id) => {
    await workflowService.toggleWorkflowStatus(id);
    loadWorkflows();
  };

  const handleRun = async (wf) => {
    const exec = await executionService.triggerExecution(wf);
    navigate(`/executions/${exec.id}`);
  };

  // Filter & sort
  const filteredWorkflows = workflows
    .filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' || w.status.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'executions') return (b.totalExecutions || 0) - (a.totalExecutions || 0);
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Workflow Repository
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Define, deploy, and inspect DAG automation pipelines in tenant {activeTenant?.name}.
          </p>
        </div>

        <button
          onClick={onOpenCreateWorkflow}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Control Bar: Search, Filters, Sort, View Toggle */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workflows by name or tag..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filters and View toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Status filter pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            {['ALL', 'ACTIVE', 'PAUSED', 'DRAFT'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              <option value="updatedAt">Last Modified</option>
              <option value="name">Name (A-Z)</option>
              <option value="executions">Total Runs</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Content Grid / Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onRun={handleRun}
            />
          ))}

          {filteredWorkflows.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No workflows match your criteria
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Try refining your search keyword or create a new automation pipeline from scratch.
              </p>
              <button
                onClick={onOpenCreateWorkflow}
                className="mt-4 inline-flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create Workflow</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Workflow Name</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Trigger</th>
                <th className="px-5 py-3.5">Total Runs</th>
                <th className="px-5 py-3.5">Success Rate</th>
                <th className="px-5 py-3.5">Last Modified</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredWorkflows.map((wf) => (
                <tr
                  key={wf.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                    <div
                      onClick={() => handleEdit(wf)}
                      className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {wf.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                      {wf.description}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        wf.status === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                      }`}
                    >
                      {wf.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                    {wf.triggerType || 'WEBHOOK'}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {(wf.totalExecutions || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{wf.successRate || 100}%</span>
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${wf.successRate || 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                    {new Date(wf.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleRun(wf)}
                        title="Trigger Execution"
                        className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(wf)}
                        title="Edit DAG"
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(wf.id)}
                        title="Duplicate"
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(wf.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
