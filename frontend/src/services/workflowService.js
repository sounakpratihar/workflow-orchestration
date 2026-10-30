import apiClient from './api';
import { MOCK_WORKFLOWS, MOCK_TEMPLATES } from '../data/mockData';

const WORKFLOWS_STORAGE_KEY = 'wf_workflows_cache';

/**
 * Initialize cache with mock workflows if empty
 */
function getCachedWorkflows() {
  try {
    const raw = localStorage.getItem(WORKFLOWS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse cached workflows, resetting to defaults', err);
  }
  localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(MOCK_WORKFLOWS));
  return MOCK_WORKFLOWS;
}

function setCachedWorkflows(workflows) {
  try {
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows));
  } catch (err) {
    console.warn('Failed to persist workflows to localStorage', err);
  }
}

export const workflowService = {
  /**
   * Get all workflows for current tenant
   */
  async getWorkflows(tenantId) {
    try {
      // Prepared for actual backend API
      const res = await apiClient.get('/workflows');
      if (res && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // Graceful fallback to client-side multi-tenant cache
    }

    const all = getCachedWorkflows();
    if (!tenantId || tenantId === 'all') return all;
    return all.filter((w) => w.tenantId === tenantId || w.tenantId === 'acme_corp');
  },

  /**
   * Get single workflow by ID
   */
  async getWorkflowById(id) {
    try {
      const res = await apiClient.get(`/workflows/${id}`);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }

    const all = getCachedWorkflows();
    const found = all.find((w) => w.id === id);
    if (found) return found;

    // Check templates if not found in saved
    const template = MOCK_TEMPLATES.find((t) => t.id === id);
    if (template) {
      return {
        ...template,
        tenantId: localStorage.getItem('wf_active_tenant') || 'acme_corp',
        status: 'DRAFT',
        version: '1.0.0',
        totalExecutions: 0,
        successRate: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return null;
  },

  /**
   * Save or update workflow
   */
  async saveWorkflow(workflow) {
    try {
      const res = await apiClient.post('/workflows', workflow);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }

    const all = getCachedWorkflows();
    const now = new Date().toISOString();
    let updated;

    const existingIndex = all.findIndex((w) => w.id === workflow.id);
    if (existingIndex >= 0) {
      updated = {
        ...all[existingIndex],
        ...workflow,
        updatedAt: now,
      };
      all[existingIndex] = updated;
    } else {
      updated = {
        ...workflow,
        id: workflow.id || `wf_${Date.now().toString(36)}`,
        tenantId: workflow.tenantId || localStorage.getItem('wf_active_tenant') || 'acme_corp',
        status: workflow.status || 'DRAFT',
        version: workflow.version || '1.0.0',
        totalExecutions: workflow.totalExecutions || 0,
        successRate: workflow.successRate || 100,
        createdAt: now,
        updatedAt: now,
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
      };
      all.unshift(updated);
    }

    setCachedWorkflows(all);
    return updated;
  },

  /**
   * Delete workflow
   */
  async deleteWorkflow(id) {
    try {
      await apiClient.delete(`/workflows/${id}`);
    } catch {
      // Fallback
    }

    const all = getCachedWorkflows();
    const filtered = all.filter((w) => w.id !== id);
    setCachedWorkflows(filtered);
    return true;
  },

  /**
   * Duplicate workflow
   */
  async duplicateWorkflow(id) {
    const all = getCachedWorkflows();
    const source = all.find((w) => w.id === id);
    if (!source) throw new Error('Workflow not found to duplicate');

    const duplicate = {
      ...source,
      id: `wf_${Date.now().toString(36)}`,
      name: `${source.name} (Copy)`,
      status: 'DRAFT',
      totalExecutions: 0,
      successRate: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastExecutedAt: null,
    };

    all.unshift(duplicate);
    setCachedWorkflows(all);
    return duplicate;
  },

  /**
   * Toggle workflow status (ACTIVE <-> PAUSED)
   */
  async toggleWorkflowStatus(id) {
    const all = getCachedWorkflows();
    const target = all.find((w) => w.id === id);
    if (!target) return null;

    target.status = target.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    target.updatedAt = new Date().toISOString();
    setCachedWorkflows(all);
    return target;
  },

  /**
   * Fetch templates
   */
  getTemplates() {
    return MOCK_TEMPLATES;
  },
};

export default workflowService;
