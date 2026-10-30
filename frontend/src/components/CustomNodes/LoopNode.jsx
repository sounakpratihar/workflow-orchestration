import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Repeat, RefreshCw } from 'lucide-react';

function LoopNode({ data, selected }) {
  const isRunning = data.executionStatus === 'RUNNING';
  const isCompleted = data.executionStatus === 'COMPLETED';
  const isInCycle = data.inCycle;

  const maxIterations = data.config?.maxIterations || 100;
  const batchSize = data.config?.batchSize || 10;

  return (
    <div
      className={`min-w-[220px] max-w-[260px] rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all shadow-md ${
        isInCycle
          ? 'border-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20'
          : selected
          ? 'border-orange-500 ring-4 ring-orange-500/20 shadow-orange-500/10'
          : isRunning
          ? 'border-orange-400 ring-4 ring-orange-400/30 shadow-orange-500/20'
          : 'border-orange-500/70 hover:border-orange-400'
      }`}
    >
      {/* Incoming Connection Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-orange-50 dark:bg-orange-950/40 border-b border-orange-100 dark:border-orange-900/40 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-sm">
            <Repeat className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wider">
            Loop Controller
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-200/60 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 font-semibold">
          Max: {maxIterations}
        </span>
      </div>

      {/* Node Body */}
      <div className="p-3.5">
        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
          {data.label || 'Batch Loop'}
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
          {data.description || 'Controlled iterator for collection batches'}
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg text-slate-700 dark:text-slate-300">
          <span>Batch Size:</span>
          <span className="font-bold text-orange-600 dark:text-orange-400">{batchSize} items</span>
        </div>

        {/* Execution status indicator badge */}
        {data.executionStatus && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Iterations:</span>
            <span
              className={`font-semibold font-mono px-1.5 py-0.5 rounded ${
                isRunning
                  ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 animate-pulse'
                  : isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500'
                  : 'text-slate-400'
              }`}
            >
              {data.currentIteration ? `${data.currentIteration} / ${maxIterations}` : data.executionStatus}
            </span>
          </div>
        )}
      </div>

      {/* Outgoing Connection Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />
    </div>
  );
}

export default memo(LoopNode);
