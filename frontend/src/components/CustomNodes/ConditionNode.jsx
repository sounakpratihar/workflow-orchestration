import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch, HelpCircle } from 'lucide-react';

function ConditionNode({ data, selected }) {
  const isRunning = data.executionStatus === 'RUNNING';
  const isCompleted = data.executionStatus === 'COMPLETED';
  const isInCycle = data.inCycle;
  const expression = data.config?.expression || 'payload.amount > 1000';

  return (
    <div
      className={`min-w-[240px] max-w-[280px] rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all shadow-md relative ${
        isInCycle
          ? 'border-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20'
          : selected
          ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-amber-500/10'
          : isRunning
          ? 'border-amber-400 ring-4 ring-amber-400/30 shadow-amber-500/20'
          : 'border-amber-500/70 hover:border-amber-400'
      }`}
    >
      {/* Incoming Connection Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/40 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-sm">
            <GitBranch className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Condition Gate
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-semibold">
          If / Else
        </span>
      </div>

      {/* Node Body */}
      <div className="p-3.5">
        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
          {data.label || 'Condition Check'}
        </div>
        
        {/* Expression code box */}
        <div className="mt-2 p-2 bg-slate-900 text-amber-300 rounded-lg font-mono text-[11px] border border-slate-800 truncate" title={expression}>
          {expression}
        </div>

        {/* Branch output indicators */}
        <div className="mt-3 flex flex-col gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-end gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <span>TRUE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center justify-end gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            <span>FALSE</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
        </div>

        {/* Execution status indicator badge */}
        {data.executionStatus && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Outcome:</span>
            <span
              className={`font-semibold font-mono px-1.5 py-0.5 rounded ${
                isRunning
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 animate-pulse'
                  : isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500'
                  : 'text-slate-400'
              }`}
            >
              {data.branchOutcome ? `Branch: ${data.branchOutcome}` : data.executionStatus}
            </span>
          </div>
        )}
      </div>

      {/* Two distinct Branch Handles */}
      {/* Top Handle: TRUE */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: '64%' }}
        className="!w-3.5 !h-3.5 !bg-emerald-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />

      {/* Bottom Handle: FALSE */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: '82%' }}
        className="!w-3.5 !h-3.5 !bg-rose-500 !border-2 !border-white dark:!border-slate-900 hover:!scale-125 !transition-transform"
      />
    </div>
  );
}

export default memo(ConditionNode);
