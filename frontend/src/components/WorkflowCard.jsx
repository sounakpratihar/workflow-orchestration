import React from 'react';
import { Play, Copy, Trash2, Edit3, Clock, CheckCircle2, MoreVertical, Zap } from 'lucide-react';

export default function WorkflowCard({
  workflow,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onRun,
}) {
  const isRunningOrActive = workflow.status === 'ACTIVE';

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top bar: Status badge & Toggle switch */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                workflow.status === 'ACTIVE'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                  : workflow.status === 'PAUSED'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  workflow.status === 'ACTIVE'
                    ? 'bg-emerald-500 animate-pulse'
                    : workflow.status === 'PAUSED'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              {workflow.status}
            </span>

            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              v{workflow.version || '1.0.0'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleStatus && onToggleStatus(workflow.id)}
              title={workflow.status === 'ACTIVE' ? 'Pause Workflow' : 'Activate Workflow'}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                workflow.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  workflow.status === 'ACTIVE' ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h4
          onClick={() => onEdit(workflow)}
          className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
        >
          {workflow.name}
        </h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
          {workflow.description || 'No description provided.'}
        </p>

        {/* Tags */}
        {workflow.tags && workflow.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {workflow.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Metrics & Execution Stats */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <span className="text-[11px] text-slate-400">Total Runs:</span>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {(workflow.totalExecutions || 0).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Success Rate:</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <span>{workflow.successRate || 100}%</span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${workflow.successRate || 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {workflow.lastExecutedAt && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Run: {new Date(workflow.lastExecutedAt).toLocaleString()}</span>
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            onClick={() => onRun && onRun(workflow)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Trigger</span>
          </button>

          <button
            onClick={() => onEdit(workflow)}
            title="Open in Builder"
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDuplicate && onDuplicate(workflow.id)}
            title="Duplicate Workflow"
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete && onDelete(workflow.id)}
            title="Delete Workflow"
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
