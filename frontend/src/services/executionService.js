import apiClient from './api';
import { MOCK_EXECUTIONS } from '../data/mockData';

const EXECUTIONS_STORAGE_KEY = 'wf_executions_cache';

function getCachedExecutions() {
  try {
    const raw = localStorage.getItem(EXECUTIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse cached executions', err);
  }
  localStorage.setItem(EXECUTIONS_STORAGE_KEY, JSON.stringify(MOCK_EXECUTIONS));
  return MOCK_EXECUTIONS;
}

function setCachedExecutions(executions) {
  try {
    localStorage.setItem(EXECUTIONS_STORAGE_KEY, JSON.stringify(executions));
  } catch (err) {
    console.warn('Failed to persist executions', err);
  }
}

export const executionService = {
  /**
   * Get executions list with optional filters
   */
  async getExecutions(filters = {}) {
    try {
      const res = await apiClient.get('/executions', { params: filters });
      if (res && Array.isArray(res.data)) return res.data;
    } catch {
      // Graceful fallback
    }

    let all = getCachedExecutions();

    if (filters.status && filters.status !== 'ALL') {
      all = all.filter((e) => e.status.toUpperCase() === filters.status.toUpperCase());
    }

    if (filters.workflowId) {
      all = all.filter((e) => e.workflowId === filters.workflowId);
    }

    if (filters.tenantId && filters.tenantId !== 'all') {
      all = all.filter((e) => e.tenantId === filters.tenantId || e.tenantId === 'acme_corp');
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      all = all.filter(
        (e) =>
          e.id.toLowerCase().includes(term) ||
          e.workflowName.toLowerCase().includes(term) ||
          e.trigger.toLowerCase().includes(term)
      );
    }

    return all;
  },

  /**
   * Get single execution details
   */
  async getExecutionById(id) {
    try {
      const res = await apiClient.get(`/executions/${id}`);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }

    const all = getCachedExecutions();
    return all.find((e) => e.id === id) || all[0];
  },

  /**
   * Start a new execution for a workflow
   */
  async triggerExecution(workflow, payload = {}) {
    try {
      const res = await apiClient.post(`/workflows/${workflow.id}/execute`, { payload });
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }

    const all = getCachedExecutions();
    const newExec = {
      id: `exec_live_${Math.random().toString(16).substring(2, 10)}`,
      workflowId: workflow.id,
      workflowName: workflow.name,
      tenantId: workflow.tenantId || localStorage.getItem('wf_active_tenant') || 'acme_corp',
      tenantName: 'Active Organization',
      status: 'RUNNING',
      trigger: 'Manual Console Trigger',
      startedAt: new Date().toISOString(),
      completedAt: null,
      durationMs: 0,
      currentNode: workflow.nodes?.[0]?.id || 'start',
      progress: 10,
      payload: Object.keys(payload).length > 0 ? payload : {
        orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        amount: 850.00,
        currency: 'USD',
        riskScore: 0.15,
        timestamp: new Date().toISOString()
      },
      timeline: [
        {
          step: workflow.nodes?.[0]?.data?.label || 'Trigger Node',
          status: 'COMPLETED',
          duration: '10ms',
          timestamp: new Date().toLocaleTimeString(),
          message: 'Execution spawned from developer canvas',
        },
      ],
    };

    all.unshift(newExec);
    setCachedExecutions(all);
    return newExec;
  },

  /**
   * Cancel execution
   */
  async cancelExecution(id) {
    try {
      await apiClient.post(`/executions/${id}/cancel`);
    } catch {
      // Fallback
    }

    const all = getCachedExecutions();
    const item = all.find((e) => e.id === id);
    if (item) {
      item.status = 'CANCELLED';
      item.completedAt = new Date().toISOString();
      item.timeline.push({
        step: 'Abort Signal',
        status: 'CANCELLED',
        duration: '0ms',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Execution aborted by operator from console',
      });
      setCachedExecutions(all);
    }
    return item;
  },

  /**
   * Retry failed execution
   */
  async retryExecution(id) {
    const all = getCachedExecutions();
    const item = all.find((e) => e.id === id);
    if (!item) return null;

    const retryExec = {
      ...item,
      id: `exec_live_${Math.random().toString(16).substring(2, 10)}`,
      status: 'RUNNING',
      startedAt: new Date().toISOString(),
      completedAt: null,
      durationMs: 0,
      progress: 25,
      timeline: [
        {
          step: 'Execution Retry Init',
          status: 'COMPLETED',
          duration: '5ms',
          timestamp: new Date().toLocaleTimeString(),
          message: `Retrying failed execution reference ${id}`,
        },
      ],
    };

    all.unshift(retryExec);
    setCachedExecutions(all);
    return retryExec;
  },
};

export default executionService;
