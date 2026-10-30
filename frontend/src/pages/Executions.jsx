import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  StopCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Terminal,
  Activity,
  ArrowLeft,
  Copy,
  ExternalLink,
  Cpu,
  Layers,
  Database,
} from 'lucide-react';

import ExecutionTimeline from '../components/ExecutionTimeline';
import { executionService } from '../services/executionService';
import { socketService } from '../services/socketService';
import { useAuth } from '../context/AuthContext';
import { MOCK_EXECUTIONS } from '../data/mockData';

export default function Executions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeTenant } = useAuth();

  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'payload' | 'logs'

  const activeId = id === 'live' || !id ? MOCK_EXECUTIONS[0].id : id;

  // Load execution details
  const loadExecution = async () => {
    setLoading(true);
    const data = await executionService.getExecutionById(activeId);
    if (data) {
      setExecution(data);
      setTimeline(data.timeline || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExecution();
  }, [activeId]);

  // Socket.IO event listener for real-time progress
  useEffect(() => {
    const unsub = socketService.on('execution:progress', (update) => {
      if (update.executionId === activeId) {
        setExecution((prev) => ({
          ...prev,
          status: update.status || prev.status,
          progress: update.progress ?? prev.progress,
          currentNode: update.currentNode ?? prev.currentNode,
        }));
        if (update.stepLog) {
          setTimeline((prev) => [...prev, update.stepLog]);
        }
      }
    });

    return () => unsub();
  }, [activeId]);

  // Actions
  const handlePause = () => {
    setExecution((prev) => ({
      ...prev,
      status: 'PAUSED',
    }));
    setTimeline((prev) => [
      ...prev,
      {
        step: 'Workflow Paused',
        status: 'PAUSED',
        duration: '0ms',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Execution execution paused by operator',
      },
    ]);
  };

  const handleResume = () => {
    setExecution((prev) => ({
      ...prev,
      status: 'RUNNING',
    }));
    setTimeline((prev) => [
      ...prev,
      {
        step: 'Workflow Resumed',
        status: 'RUNNING',
        duration: '0ms',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Engine resumed processing queued steps',
      },
    ]);
  };

  const handleCancel = async () => {
    const updated = await executionService.cancelExecution(activeId);
    if (updated) {
      setExecution(updated);
      setTimeline(updated.timeline);
    }
  };

  const handleRetry = async () => {
    const retryExec = await executionService.retryExecution(activeId);
    if (retryExec) {
      navigate(`/executions/${retryExec.id}`);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(execution?.id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Activity className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-xs">Loading execution telemetry...</span>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="p-12 text-center text-slate-400">
        <h2 className="text-sm font-bold text-slate-200">Execution Not Found</h2>
        <button
          onClick={() => navigate('/executions')}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl"
        >
          Back to History
        </button>
      </div>
    );
  }

  const isRunning = execution.status === 'RUNNING';
  const isCompleted = execution.status === 'COMPLETED';
  const isFailed = execution.status === 'FAILED';
  const isPaused = execution.status === 'PAUSED';
  const isCancelled = execution.status === 'CANCELLED';

  const statusStyles = {
    RUNNING: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50',
    COMPLETED: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    FAILED: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50',
    PAUSED: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    CANCELLED: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    PENDING: 'bg-sky-50 dark:bg-sky-950 text-sky-600 border-sky-200',
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header / Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/executions')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {execution.workflowName}
              </h1>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1.5 ${
                  statusStyles[execution.status] || statusStyles.RUNNING
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isRunning ? 'bg-indigo-500 animate-pulse' : isCompleted ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                {execution.status}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
              <span className="flex items-center gap-1">
                ID: {execution.id}
                <button
                  onClick={copyId}
                  className="hover:text-slate-200 p-0.5"
                  title="Copy ID"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {copied && <span className="text-emerald-500 text-[10px]">Copied!</span>}
              </span>
              <span>•</span>
              <span>Tenant: {execution.tenantName || activeTenant?.name}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isRunning ? (
            <>
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </>
          ) : isPaused ? (
            <button
              onClick={handleResume}
              className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Execution</span>
            </button>
          )}

          <button
            onClick={() => navigate(`/builder?id=${execution.workflowId}`)}
            className="flex items-center gap-1.5 py-2 px-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Canvas</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Pipeline Execution Progress: {execution.progress || 100}%
          </span>
          <span className="text-slate-400 font-mono">
            Elapsed: {execution.durationMs}ms
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFailed
                ? 'bg-rose-500'
                : isRunning
                ? 'bg-indigo-600 animate-pulse'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${execution.progress || 100}%` }}
          />
        </div>

        {/* Key-Value Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[11px] text-slate-400">Trigger Origin</span>
            <div className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {execution.trigger || 'Webhook Ingress'}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Active Node</span>
            <div className="font-mono text-indigo-600 dark:text-indigo-400 font-bold truncate mt-0.5">
              {execution.currentNode || 'Finished'}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Started At</span>
            <div className="text-slate-800 dark:text-slate-200 truncate mt-0.5 font-mono">
              {new Date(execution.startedAt).toLocaleTimeString()}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Completed At</span>
            <div className="text-slate-800 dark:text-slate-200 truncate mt-0.5 font-mono">
              {execution.completedAt ? new Date(execution.completedAt).toLocaleTimeString() : 'In Progress...'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Execution Timeline vs Raw Payload vs Diagnostics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Step Timeline
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'payload'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Input / Output Payload
          </button>
        </div>

        {activeTab === 'timeline' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <ExecutionTimeline timeline={timeline} />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <span>Context Payload State (JSON)</span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800">
              {JSON.stringify(execution.payload || {}, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
