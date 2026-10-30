import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckSquare, Cpu } from 'lucide-react';

function TaskNode({ data, selected }) {
  const isRunning = data.executionStatus === 'RUNNING';
  const isCompleted = data.executionStatus === 'COMPLETED';
  const isFailed = data.executionStatus === 'FAILED';
  const isInCycle = data.inCycle;

  return (
    <div
      className={`min-w-[220px] max-w-[260px] rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all shadow-md ${
        isInCycle
          ? 'border-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20'
          : selected
          ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-indigo-500/10'
          : isRunning
          ? 'border-indigo-400 ring-4 ring-indigo-400/30 shadow-indigo-500/20'
          : 'border-indigo-500/60 hover:border-indigo-400'
      }`}
    >
      {/* Incoming Connection Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
            Task Action
          </span>
        </div>
        {data.config?.retryLimit && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-semibold">
            Retries: {data.config.retryLimit}
          </span>
        )}
      </div>

      {/* Node Body */}
      <div className="p-3.5">
        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
          {data.label || 'Execute Task'}
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
          {data.description || 'Custom business logic execution step'}
        </div>

        {data.config?.taskType && (
          <div className="mt-2 text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded truncate">
            Handler: {data.config.taskType}
          </div>
        )}

        {/* Execution status indicator badge */}
        {data.executionStatus && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Execution:</span>
            <span
              className={`font-semibold font-mono px-1.5 py-0.5 rounded ${
                isRunning
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 animate-pulse'
                  : isCompleted
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

      {/* Outgoing Connection Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />
    </div>
  );
}

export default memo(TaskNode);
