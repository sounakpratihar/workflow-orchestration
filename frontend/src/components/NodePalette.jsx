import React from 'react';
import { Play, Cpu, GitBranch, Globe, Clock, Repeat, Flag, Plus, GripVertical } from 'lucide-react';

export const NODE_PALETTE_ITEMS = [
  {
    type: 'start',
    label: 'Start Trigger',
    description: 'Webhook, Schedule, or Event entrypoint',
    icon: Play,
    color: 'emerald',
    badge: 'Trigger',
    defaultData: {
      label: 'Order Webhook Trigger',
      description: 'Incoming HTTP POST webhook',
      config: { triggerType: 'webhook', endpoint: '/v1/webhooks/orders', method: 'POST' },
    },
  },
  {
    type: 'task',
    label: 'Task Runner',
    description: 'Execute custom service logic or handlers',
    icon: Cpu,
    color: 'indigo',
    badge: 'Action',
    defaultData: {
      label: 'Process Order Payment',
      description: 'Execute billing service transaction',
      config: { taskType: 'payment_charge', retryLimit: 3, timeout: 5000 },
    },
  },
  {
    type: 'condition',
    label: 'Condition Gate',
    description: 'Branch flow based on boolean expressions',
    icon: GitBranch,
    color: 'amber',
    badge: 'If / Else',
    defaultData: {
      label: 'Check Risk Score < 0.85?',
      description: 'Evaluate transaction risk payload',
      config: { expression: 'payload.amount < 5000 && payload.riskScore < 0.85' },
    },
  },
  {
    type: 'api',
    label: 'API Request',
    description: 'Outbound REST HTTP API invocation',
    icon: Globe,
    color: 'cyan',
    badge: 'REST',
    defaultData: {
      label: 'Query Inventory WMS',
      description: 'Verify warehouse stock availability',
      config: { method: 'POST', url: 'https://inventory.api.acme.com/v1/stock/reserve', timeout: 3000 },
    },
  },
  {
    type: 'delay',
    label: 'Delay Timer',
    description: 'Pause execution for configured duration',
    icon: Clock,
    color: 'purple',
    badge: 'Timer',
    defaultData: {
      label: 'Throttle Buffer',
      description: 'Wait 5 seconds before next step',
      config: { duration: 5, unit: 'seconds' },
    },
  },
  {
    type: 'loop',
    label: 'Loop Controller',
    description: 'Iterate collections with safety bounds',
    icon: Repeat,
    color: 'orange',
    badge: 'Iterator',
    defaultData: {
      label: 'Batch Line Items Loop',
      description: 'Iterate over items in cart',
      config: { maxIterations: 100, batchSize: 10, continueOnError: true },
    },
  },
  {
    type: 'end',
    label: 'Terminal Node',
    description: 'Workflow completion and status capture',
    icon: Flag,
    color: 'slate',
    badge: 'Finish',
    defaultData: {
      label: 'Order Confirmed',
      description: 'Emit order.fulfilled event',
      config: { status: 'COMPLETED', emitEvent: 'order.fulfilled' },
    },
  },
];

export default function NodePalette({ onAddNode }) {
  const onDragStart = (event, nodeType, item) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/item', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  const colorStyles = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400',
    amber: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/40 text-cyan-600 dark:text-cyan-400',
    purple: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/40 text-orange-600 dark:text-orange-400',
    slate: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 select-none shadow-sm">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Node Palette
        </h3>
        <p className="mt-1 text-[11px] text-slate-400">
          Drag onto the canvas or click to insert.
        </p>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-2">
        {NODE_PALETTE_ITEMS.map((item) => {
          const Icon = item.icon;
          const style = colorStyles[item.color] || colorStyles.indigo;

          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item.type, item)}
              onClick={() => onAddNode(item.type, item.defaultData)}
              className="group p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-800/60 transition-all cursor-grab active:cursor-grabbing flex items-center justify-between text-xs shadow-xs"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${style}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
