import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Timer, Hourglass } from 'lucide-react';

function DelayNode({ data, selected }) {
  const isRunning = data.executionStatus === 'RUNNING';
  const isCompleted = data.executionStatus === 'COMPLETED';
  const isInCycle = data.inCycle;

  const duration = data.config?.duration || 5;
  const unit = data.config?.unit || 'seconds';

  return (
    <div
      className={`min-w-[200px] max-w-[240px] rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all shadow-md ${
        isInCycle
          ? 'border-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20'
          : selected
          ? 'border-purple-500 ring-4 ring-purple-500/20 shadow-purple-500/10'
          : isRunning
          ? 'border-purple-400 ring-4 ring-purple-400/30 shadow-purple-500/20'
          : 'border-purple-500/70 hover:border-purple-400'
      }`}
    >
      {/* Incoming Connection Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/40 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <Timer className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
            Delay Timer
          </span>
        </div>
      </div>

      {/* Node Body */}
      <div className="p-3.5">
        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
          {data.label || 'Wait Interval'}
        </div>

        <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
          <Hourglass className="w-4 h-4 text-purple-500 shrink-0" />
          <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
            {duration} {unit}
          </span>
        </div>

        {/* Execution status indicator badge */}
        {data.executionStatus && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Timer:</span>
            <span
              className={`font-semibold font-mono px-1.5 py-0.5 rounded ${
                isRunning
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 animate-pulse'
                  : isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500'
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
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />
    </div>
  );
}

export default memo(DelayNode);
