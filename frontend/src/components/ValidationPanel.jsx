import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, RefreshCw, Scissors, ChevronRight } from 'lucide-react';

export default function ValidationPanel({
  validationResult,
  onSelectNode,
  onBreakCycleEdge,
  onClose,
}) {
  const { isValid, errors = [], warnings = [], cycleResult } = validationResult || {
    isValid: true,
    errors: [],
    warnings: [],
  };

  return (
    <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl z-30 transition-all text-xs">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValid ? (
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              DAG Graph Validation
            </h3>
            <span className="text-[10px] text-slate-400">
              {isValid
                ? 'All topological rules passed'
                : `${errors.length} error(s), ${warnings.length} warning(s)`}
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content list */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* Valid State Banner */}
        {isValid && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Acyclic DAG Confirmed</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
              Kahn's topological ordering and 3-color DFS confirm zero cyclic loops and proper terminal structure.
            </p>
          </div>
        )}

        {/* Circular Dependency Special Alert */}
        {cycleResult?.hasCycle && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
              <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
              <span>Cyclic Graph Detected!</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-rose-800 dark:text-rose-300">
              The engine detected a back-edge loop. Standard DAG engines will deadlock indefinitely on circular branches:
            </p>

            <div className="mt-2.5 p-2 bg-slate-900 text-rose-300 rounded-lg font-mono text-[10px] break-all border border-rose-900/40">
              {cycleResult.cyclePath.join(' ➔ ')}
            </div>

            {cycleResult.cycleEdges && cycleResult.cycleEdges.length > 0 && onBreakCycleEdge && (
              <button
                onClick={() => onBreakCycleEdge(cycleResult.cycleEdges[0])}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold text-xs shadow-sm transition-colors"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Break Loop Edge (Auto-Fix)</span>
              </button>
            )}
          </div>
        )}

        {/* Errors list */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Blocking Errors ({errors.length})
            </span>
            {errors.map((err, idx) => (
              <div
                key={idx}
                onClick={() => err.nodeId && onSelectNode && onSelectNode(err.nodeId)}
                className={`p-3 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300 flex items-start gap-2.5 transition-all ${
                  err.nodeId ? 'cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-950/40' : ''
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-xs">{err.type}</div>
                  <p className="mt-0.5 text-[11px] text-rose-800/80 dark:text-rose-400/80">
                    {err.message}
                  </p>
                </div>
                {err.nodeId && <ChevronRight className="w-3.5 h-3.5 text-rose-400 mt-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Warnings list */}
        {warnings.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Warnings ({warnings.length})
            </span>
            {warnings.map((warn, idx) => (
              <div
                key={idx}
                onClick={() => warn.nodeId && onSelectNode && onSelectNode(warn.nodeId)}
                className={`p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 flex items-start gap-2.5 transition-all ${
                  warn.nodeId ? 'cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/40' : ''
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-xs">{warn.type}</div>
                  <p className="mt-0.5 text-[11px] text-amber-800/80 dark:text-amber-400/80">
                    {warn.message}
                  </p>
                </div>
                {warn.nodeId && <ChevronRight className="w-3.5 h-3.5 text-amber-400 mt-1" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
