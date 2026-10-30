import React, { useState, useEffect } from 'react';
import { X, Trash2, Copy, Save, AlertCircle, Play, Sliders, Globe, Clock, Repeat, GitBranch, Cpu, Flag } from 'lucide-react';

export default function NodeConfigPanel({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onClose,
}) {
  if (!selectedNode) return null;

  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data?.label || '');
      setDescription(selectedNode.data?.description || '');
      setConfig(selectedNode.data?.config || {});
    }
  }, [selectedNode]);

  const handleChange = (field, val) => {
    const updatedConfig = { ...config, [field]: val };
    setConfig(updatedConfig);
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      label,
      description,
      config: updatedConfig,
    });
  };

  const handleLabelChange = (newLabel) => {
    setLabel(newLabel);
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      label: newLabel,
      description,
      config,
    });
  };

  const handleDescriptionChange = (newDesc) => {
    setDescription(newDesc);
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      label,
      description: newDesc,
      config,
    });
  };

  const nodeTypeIcons = {
    start: Play,
    task: Cpu,
    condition: GitBranch,
    api: Globe,
    delay: Clock,
    loop: Repeat,
    end: Flag,
  };

  const Icon = nodeTypeIcons[selectedNode.type] || Sliders;

  return (
    <aside className="w-80 sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl z-30 transition-all">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {selectedNode.type} Node Configuration
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              ID: {selectedNode.id}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
        {/* General Settings */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            General Properties
          </h4>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Node Display Name
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              placeholder="e.g. Validate Payment"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              placeholder="What this step does..."
            />
          </div>
        </div>

        {/* Node-Specific Settings */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {selectedNode.type.toUpperCase()} Specific Config
          </h4>

          {/* START NODE */}
          {selectedNode.type === 'start' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Trigger Mechanism
                </label>
                <select
                  value={config.triggerType || 'webhook'}
                  onChange={(e) => handleChange('triggerType', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="webhook">Incoming HTTP Webhook</option>
                  <option value="schedule">Cron Job Schedule</option>
                  <option value="event">Internal System Event</option>
                  <option value="manual">Manual On-Demand</option>
                </select>
              </div>

              {config.triggerType === 'schedule' ? (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Cron Expression
                  </label>
                  <input
                    type="text"
                    value={config.cron || '0 2 * * *'}
                    onChange={(e) => handleChange('cron', e.target.value)}
                    placeholder="0 2 * * *"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-emerald-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Format: min hour day month day-of-week
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Ingress Webhook Endpoint
                  </label>
                  <input
                    type="text"
                    value={config.endpoint || '/v1/webhooks/trigger'}
                    onChange={(e) => handleChange('endpoint', e.target.value)}
                    placeholder="/v1/webhooks/..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              )}
            </>
          )}

          {/* TASK NODE */}
          {selectedNode.type === 'task' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Task Handler Action
                </label>
                <select
                  value={config.taskType || 'custom_task'}
                  onChange={(e) => handleChange('taskType', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="custom_task">Custom Business Logic</option>
                  <option value="payment_charge">Stripe / Payment Charge</option>
                  <option value="slack_alert">Send Slack / Teams Alert</option>
                  <option value="sql_upsert">Database Upsert Query</option>
                  <option value="email_send">Send Customer Email</option>
                  <option value="ai_infer">Run AI / LLM Inference</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Retry Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={config.retryLimit ?? 3}
                    onChange={(e) => handleChange('retryLimit', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Timeout (ms)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={config.timeout ?? 5000}
                    onChange={(e) => handleChange('timeout', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>
            </>
          )}

          {/* CONDITION NODE */}
          {selectedNode.type === 'condition' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  JavaScript Condition Expression
                </label>
                <textarea
                  rows={3}
                  value={config.expression || ''}
                  onChange={(e) => handleChange('expression', e.target.value)}
                  placeholder="payload.amount > 1000 && payload.riskScore < 0.5"
                  className="w-full px-3 py-2 bg-slate-950 text-amber-300 border border-slate-800 rounded-xl font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Has 2 outgoing handles: <strong className="text-emerald-500">True (Top)</strong> and <strong className="text-rose-500">False (Bottom)</strong>
                </span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  True Branch Description
                </label>
                <input
                  type="text"
                  value={config.trueLabel || 'Approved'}
                  onChange={(e) => handleChange('trueLabel', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  False Branch Description
                </label>
                <input
                  type="text"
                  value={config.falseLabel || 'Flagged / Rejected'}
                  onChange={(e) => handleChange('falseLabel', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>
            </>
          )}

          {/* API NODE */}
          {selectedNode.type === 'api' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Method
                  </label>
                  <select
                    value={config.method || 'GET'}
                    onChange={(e) => handleChange('method', e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Timeout (ms)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={config.timeout ?? 3000}
                    onChange={(e) => handleChange('timeout', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={config.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://api.domain.com/v1/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-cyan-600 dark:text-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Headers (JSON)
                </label>
                <textarea
                  rows={2}
                  value={config.headers || '{"Content-Type": "application/json"}'}
                  onChange={(e) => handleChange('headers', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl font-mono text-[11px] resize-none"
                />
              </div>

              {['POST', 'PUT', 'PATCH'].includes(config.method) && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Request Payload Body (JSON)
                  </label>
                  <textarea
                    rows={3}
                    value={config.body || '{\n  "orderId": "{{orderId}}"\n}'}
                    onChange={(e) => handleChange('body', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl font-mono text-[11px] resize-none"
                  />
                </div>
              )}
            </>
          )}

          {/* DELAY NODE */}
          {selectedNode.type === 'delay' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Duration
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.duration ?? 5}
                  onChange={(e) => handleChange('duration', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Unit
                </label>
                <select
                  value={config.unit || 'seconds'}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium"
                >
                  <option value="milliseconds">Milliseconds</option>
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
          )}

          {/* LOOP NODE */}
          {selectedNode.type === 'loop' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Max Iterations
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={config.maxIterations ?? 100}
                    onChange={(e) => handleChange('maxIterations', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.batchSize ?? 10}
                    onChange={(e) => handleChange('batchSize', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.continueOnError ?? true}
                  onChange={(e) => handleChange('continueOnError', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Continue iteration on item failure
                </span>
              </label>
            </>
          )}

          {/* END NODE */}
          {selectedNode.type === 'end' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Terminal Outcome Status
                </label>
                <select
                  value={config.status || 'COMPLETED'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                >
                  <option value="COMPLETED">COMPLETED (Success)</option>
                  <option value="FAILED">FAILED (Rejected)</option>
                  <option value="CANCELLED">CANCELLED (Aborted)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Post-Execution Event Emitter
                </label>
                <input
                  type="text"
                  value={config.emitEvent || ''}
                  onChange={(e) => handleChange('emitEvent', e.target.value)}
                  placeholder="e.g. order.processed.success"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-950/50">
        <button
          onClick={() => onDuplicateNode(selectedNode)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Clone</span>
        </button>

        <button
          onClick={() => onDeleteNode(selectedNode.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </aside>
  );
}
