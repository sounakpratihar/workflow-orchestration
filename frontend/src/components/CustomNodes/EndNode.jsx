import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Flag, CheckCircle, XCircle } from 'lucide-react';

function EndNode({ data, selected }) {
  const isRunning = data.executionStatus === 'RUNNING';
  const isCompleted = data.executionStatus === 'COMPLETED';
  const isFailed = data.executionStatus === 'FAILED';
  const isInCycle = data.inCycle;

  const terminalStatus = data.config?.status || 'COMPLETED';

  return (
    <div
      className={`min-w-[200px] max-w-[240px] rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all shadow-md ${
        isInCycle
          ? 'border-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20'
          : selected
          ? 'border-slate-500 ring-4 ring-slate-500/20 shadow-slate-500/10'
          : isCompleted
          ? 'border-emerald-500 ring-4 ring-emerald-500/20'
          : isFailed
          ? 'border-rose-500 ring-4 ring-rose-500/20'
          : 'border-slate-400 dark:border-slate-700 hover:border-slate-500'
      }`}
    >
      {/* Incoming Connection Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-slate-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-sm">
            <Flag className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Terminal
          </span>
        </div>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
            terminalStatus === 'COMPLETED'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
          }`}
        >
          {terminalStatus}
        </span>
      </div>

      {/* Node Body */}
      <div className="p-3.5">
        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
          {data.label || 'Workflow End'}
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
          {data.description || 'Successful termination and metrics capture'}
        </div>

        {data.config?.emitEvent && (
          <div className="mt-2 text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-indigo-500 px-2 py-1 rounded truncate">
            Emit: {data.config.emitEvent}
          </div>
        )}

        {/* Execution status indicator badge */}
        {data.executionStatus && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Final:</span>
            <span
              className={`font-semibold font-mono px-1.5 py-0.5 rounded ${
                isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500'
                  : isFailed
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-500'
                  : 'text-slate-400'
              }`}
            >
              {data.executionStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(EndNode);
