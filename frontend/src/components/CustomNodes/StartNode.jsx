import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Zap, Clock, Globe } from 'lucide-react';

function StartNode({ data, selected }) {
  const triggerType = data.config?.triggerType || 'webhook';

  const triggerIcons = {
    webhook: Globe,
    schedule: Clock,
    event: Zap,
    manual: Play,
  };

  const Icon = triggerIcons[triggerType] || Play;
  const isRunning = data.executionStatus === 'RUNNING';
  const isCompleted = data.executionStatus === 'COMPLETED';
  const isInCycle = data.inCycle;

  return (
    <div
      className={`min-w-[220px] max-w-[260px] rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all shadow-md ${
        isInCycle
          ? 'border-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20'
          : selected
          ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-500/10'
          : isRunning
          ? 'border-emerald-400 ring-4 ring-emerald-400/30'
          : 'border-emerald-500/80 hover:border-emerald-400'
      }`}
    >
      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Icon className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            Start Trigger
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold uppercase">
          {triggerType}
        </span>
      </div>

      {/* Node Body */}
      <div className="p-3.5">
        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
          {data.label || 'Workflow Trigger'}
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
          {data.description || 'Entrypoint to initialize workflow DAG'}
        </div>

        {data.config?.endpoint && (
          <div className="mt-2 text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-2 py-1 rounded truncate">
            {data.config.endpoint}
          </div>
        )}

        {data.config?.cron && (
          <div className="mt-2 text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded truncate">
            Cron: {data.config.cron}
          </div>
        )}

        {/* Execution status indicator badge */}
        {data.executionStatus && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Execution:</span>
            <span
              className={`font-semibold font-mono px-1.5 py-0.5 rounded ${
                isRunning
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 animate-pulse'
                  : isCompleted
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-500'
                  : 'text-slate-400'
              }`}
            >
              {data.executionStatus}
            </span>
          </div>
        )}
      </div>

      {/* Outgoing connection handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />
    </div>
  );
}

export default memo(StartNode);
