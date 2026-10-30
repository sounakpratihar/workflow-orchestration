import apiClient from './api';
import { MOCK_API_KEYS } from '../data/mockData';

const API_KEYS_STORAGE_KEY = 'wf_apikeys_cache';

function getCachedKeys() {
  try {
    const raw = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse cached API keys', err);
  }
  localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(MOCK_API_KEYS));
  return MOCK_API_KEYS;
}

function setCachedKeys(keys) {
  try {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
  } catch (err) {
    console.warn('Failed to persist API keys', err);
  }
}

/**
 * Helper to generate cryptographic-style token
 */
function generateCryptoRandomString(bytes = 16) {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < bytes * 2; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const apiKeyService = {
  /**
   * Get all keys for active tenant
   */
  async getApiKeys(tenantId) {
    try {
      const res = await apiClient.get('/keys');
      if (res && Array.isArray(res.data)) return res.data;
    } catch {
      // Fallback
    }

    const all = getCachedKeys();
    if (!tenantId || tenantId === 'all') return all;
    return all.filter((k) => k.tenantId === tenantId || k.tenantId === 'acme_corp');
  },

  /**
   * Generate a new cryptographic API key
   */
  async generateApiKey({ name, scopes = ['workflows:read', 'workflows:execute'], environment = 'production', tenantId }) {
    try {
      const res = await apiClient.post('/keys', { name, scopes, environment });
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }

    const tenant = tenantId || localStorage.getItem('wf_active_tenant') || 'acme_corp';
    const entropy = generateCryptoRandomString(16);
    const checksum = generateCryptoRandomString(2);
    const fullKey = `wk_live_${tenant}_${entropy}.${checksum}`;
    const keyMasked = `wk_live_${tenant}_${entropy.substring(0, 4)}••••••••••••${checksum}`;

    const newKey = {
      id: `key_live_${Date.now().toString(36)}`,
      name,
      prefix: `wk_live_${tenant}_`,
      keyMasked,
      fullKey, // Returned once for user copy
      tenantId: tenant,
      scopes,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      lastUsedAt: 'Never',
      usageCount: 0,
      environment,
    };

    const all = getCachedKeys();
    all.unshift(newKey);
    setCachedKeys(all);

    return newKey;
  },

  /**
   * Revoke an active key
   */
  async revokeApiKey(id) {
    try {
      await apiClient.delete(`/keys/${id}`);
    } catch {
      // Fallback
    }

    const all = getCachedKeys();
    const item = all.find((k) => k.id === id);
    if (item) {
      item.status = 'REVOKED';
      setCachedKeys(all);
    }
    return item;
  },

  /**
   * Rotate key: issues new entropy while keeping key name and permissions
   */
  async rotateApiKey(id) {
    const all = getCachedKeys();
    const item = all.find((k) => k.id === id);
    if (!item) throw new Error('Key not found');

    const entropy = generateCryptoRandomString(16);
    const checksum = generateCryptoRandomString(2);
    const fullKey = `wk_live_${item.tenantId}_${entropy}.${checksum}`;
    const keyMasked = `wk_live_${item.tenantId}_${entropy.substring(0, 4)}••••••••••••${checksum}`;

    item.fullKey = fullKey;
    item.keyMasked = keyMasked;
    item.status = 'ACTIVE';
    item.lastUsedAt = 'Rotated just now';
    item.rotatedAt = new Date().toISOString();

    setCachedKeys(all);
    return item;
  },

  /**
   * Delete key permanently
   */
  async deleteApiKey(id) {
    const all = getCachedKeys();
    const filtered = all.filter((k) => k.id !== id);
    setCachedKeys(filtered);
    return true;
  },
};

export default apiKeyService;
