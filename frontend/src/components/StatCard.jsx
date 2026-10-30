import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function StatCard({ title, value, change, changeType = 'positive', period = 'vs last month', icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-800/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      glow: 'shadow-indigo-500/10',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-800/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      border: 'border-cyan-100 dark:border-cyan-800/40',
      text: 'text-cyan-600 dark:text-cyan-400',
      glow: 'shadow-cyan-500/10',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-800/40',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/10',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-800/40',
      text: 'text-rose-600 dark:text-rose-400',
      glow: 'shadow-rose-500/10',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${scheme.bg} ${scheme.border} ${scheme.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>

        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium">
            {changeType === 'positive' ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {change}
              </span>
            ) : changeType === 'negative' ? (
              <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/40">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {change}
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                <Minus className="w-3.5 h-3.5" />
                {change}
              </span>
            )}
          </div>
        )}
      </div>

      {period && (
        <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {period}
        </div>
      )}
    </div>
  );
}
