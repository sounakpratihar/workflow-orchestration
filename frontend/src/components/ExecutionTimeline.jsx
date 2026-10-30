import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Play, ChevronDown, ChevronRight, Terminal } from 'lucide-react';

export default function ExecutionTimeline({ timeline = [], currentStep = null }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No execution timeline steps recorded yet.
      </div>
    );
  }

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {timeline.map((step, idx) => {
          const isRunning = step.status === 'RUNNING';
          const isCompleted = step.status === 'COMPLETED';
          const isFailed = step.status === 'FAILED';
          const isCancelled = step.status === 'CANCELLED';
          const isExpanded = expandedIndex === idx;

          return (
            <div key={idx} className="relative group">
              {/* Dot icon on vertical line */}
              <div
                className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                  isRunning
                    ? 'bg-indigo-600 border-white dark:border-slate-900 text-white animate-pulse ring-4 ring-indigo-500/20'
                    : isCompleted
                    ? 'bg-emerald-500 border-white dark:border-slate-900 text-white'
                    : isFailed
                    ? 'bg-rose-500 border-white dark:border-slate-900 text-white'
                    : isCancelled
                    ? 'bg-slate-400 border-white dark:border-slate-900 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : isFailed ? (
                  <XCircle className="w-3 h-3" />
                ) : isRunning ? (
                  <Clock className="w-3 h-3 animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>

              {/* Card Container */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-indigo-500/30 transition-all text-xs">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => toggleExpand(idx)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {step.step}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        isRunning
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : isFailed
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                    {step.duration && <span>{step.duration}</span>}
                    {step.timestamp && <span>{step.timestamp}</span>}
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {step.message && (
                  <p className="mt-1.5 text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                    {step.message}
                  </p>
                )}

                {/* Expanded Payload / Details view */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                      <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Step Diagnostic Payload</span>
                    </div>
                    <pre className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[10px] overflow-x-auto border border-slate-800">
                      {JSON.stringify(
                        step.details || {
                          step: step.step,
                          status: step.status,
                          executionTimeMs: step.duration,
                          timestamp: step.timestamp,
                          logMessage: step.message,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
