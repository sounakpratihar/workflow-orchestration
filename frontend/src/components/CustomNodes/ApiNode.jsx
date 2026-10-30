import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Globe, Clock } from 'lucide-react';

function ApiNode({ data, selected }) {
  const isRunning = data.executionStatus === 'RUNNING';
  const isCompleted = data.executionStatus === 'COMPLETED';
  const isFailed = data.executionStatus === 'FAILED';
  const isInCycle = data.inCycle;

  const method = data.config?.method || 'GET';
  const url = data.config?.url || 'https://api.example.com/v1/resource';
  const timeout = data.config?.timeout || 3000;

  const methodColors = {
    GET: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    POST: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800',
    PUT: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    DELETE: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    PATCH: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
  };

  return (
    <div
      className={`min-w-[240px] max-w-[280px] rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all shadow-md ${
        isInCycle
          ? 'border-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20'
          : selected
          ? 'border-cyan-500 ring-4 ring-cyan-500/20 shadow-cyan-500/10'
          : isRunning
          ? 'border-cyan-400 ring-4 ring-cyan-400/30 shadow-cyan-500/20'
          : 'border-cyan-500/70 hover:border-cyan-400'
      }`}
    >
      {/* Incoming Connection Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-cyan-50 dark:bg-cyan-950/40 border-b border-cyan-100 dark:border-cyan-900/40 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-sm">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider">
            HTTP Request
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-cyan-700 dark:text-cyan-300 font-mono">
          <Clock className="w-3 h-3" />
          <span>{timeout}ms</span>
        </div>
      </div>

      {/* Node Body */}
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
            {data.label || 'API Call'}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
              methodColors[method] || methodColors.GET
            }`}
          >
            {method}
          </span>
        </div>

        <div className="mt-2 text-[11px] font-mono bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 p-2 rounded-lg border border-slate-200 dark:border-slate-800 truncate" title={url}>
          {url}
        </div>

        {/* Execution status indicator badge */}
        {data.executionStatus && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Status:</span>
            <span
              className={`font-semibold font-mono px-1.5 py-0.5 rounded ${
                isRunning
                  ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-600 animate-pulse'
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
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />
    </div>
  );
}

export default memo(ApiNode);
