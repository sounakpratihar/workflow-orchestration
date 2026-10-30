import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Layers, ArrowRight, GitBranch, ShoppingCart, Repeat } from 'lucide-react';
import Modal from './Modal';
import { MOCK_TEMPLATES } from '../data/mockData';
import { workflowService } from '../services/workflowService';
import { useAuth } from '../context/AuthContext';

export default function CreateWorkflowModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { activeTenant } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('template_ecommerce');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      let initialNodes = [];
      let initialEdges = [];

      if (selectedTemplateId !== 'blank') {
        const found = MOCK_TEMPLATES.find((t) => t.id === selectedTemplateId);
        if (found) {
          initialNodes = found.nodes;
          initialEdges = found.edges;
        }
      } else {
        // Blank canvas: start with a single Start node
        initialNodes = [
          {
            id: 'start-1',
            type: 'start',
            position: { x: 100, y: 150 },
            data: {
              label: 'Trigger Ingress',
              description: 'Webhook entrypoint',
              config: { triggerType: 'webhook', endpoint: '/v1/webhooks/ingress' },
            },
          },
        ];
        initialEdges = [];
      }

      const newWorkflow = {
        name,
        description: description || 'Visual orchestration pipeline',
        tenantId: activeTenant?.id || 'acme_corp',
        status: 'DRAFT',
        version: '1.0.0',
        nodes: initialNodes,
        edges: initialEdges,
      };

      const saved = await workflowService.saveWorkflow(newWorkflow);
      onClose();
      navigate(`/builder?id=${saved.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Workflow"
      subtitle={`Provision a visual DAG pipeline in "${activeTenant?.name}".`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Workflow Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Real-Time Fraud Assessment & Settlement"
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the operational goals, downstream systems, or SLA requirements..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
            Start From Blueprint Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Template 1: Ecommerce */}
            <div
              onClick={() => setSelectedTemplateId('template_ecommerce')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedTemplateId === 'template_ecommerce'
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <ShoppingCart className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  E-Commerce Fraud
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Webhook ingress, credit score check, conditional branching.
              </p>
            </div>

            {/* Template 2: Batch Sync */}
            <div
              onClick={() => setSelectedTemplateId('template_batch_sync')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedTemplateId === 'template_batch_sync'
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  Batch Sync Loop
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Cron schedule, REST fetch, throttled delay & database upsert.
              </p>
            </div>

            {/* Template 3: Blank */}
            <div
              onClick={() => setSelectedTemplateId('blank')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedTemplateId === 'blank'
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  Blank Canvas
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Start from a clean slate with a standalone Start trigger node.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Provisioning...' : 'Open in Canvas'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
