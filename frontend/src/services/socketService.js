import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.mockIntervals = new Set();
  }

  /**
   * Connect to backend Socket.IO or setup mock event bus
   */
  connect(tenantId = 'acme_corp') {
    try {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        query: { tenantId },
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.emitLocal('connection:status', { connected: true, socketId: this.socket.id });
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        this.emitLocal('connection:status', { connected: false });
      });

      this.socket.on('connect_error', () => {
        // Fall back gracefully to mock event bus
        this.isConnected = false;
      });

      // Pass-through backend events to registered listeners
      const serverEvents = ['execution:progress', 'execution:completed', 'execution:failed', 'workflow:updated'];
      serverEvents.forEach((evt) => {
        this.socket.on(evt, (data) => this.emitLocal(evt, data));
      });
    } catch {
      this.isConnected = false;
    }
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // If socket is connected and alive, also listen on raw socket
    if (this.socket && this.isConnected) {
      this.socket.on(event, callback);
    }

    return () => this.off(event, callback);
  }

  /**
   * Deregister event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Emit local event to listeners
   */
  emitLocal(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in listener for event "${event}":`, err);
        }
      });
    }
  }

  /**
   * Emit event to backend socket if connected, or local bus
   */
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
    this.emitLocal(event, data);
  }

  /**
   * Simulate a live execution run for frontend testing / demo
   * Steps through nodes with realistic timings, updates progress, and emits timeline events.
   */
  simulateExecutionRun(executionId, nodes = [], onUpdate) {
    if (!nodes || nodes.length === 0) return;

    let currentIndex = 0;
    const total = nodes.length;

    const interval = setInterval(() => {
      if (currentIndex >= total) {
        clearInterval(interval);
        this.mockIntervals.delete(interval);
        onUpdate({
          executionId,
          status: 'COMPLETED',
          progress: 100,
          currentNode: null,
          stepLog: {
            step: 'Workflow Termination',
            status: 'COMPLETED',
            duration: '15ms',
            timestamp: new Date().toLocaleTimeString(),
            message: 'All DAG steps evaluated successfully',
          },
        });
        return;
      }

      const node = nodes[currentIndex];
      const isLast = currentIndex === total - 1;
      const progress = Math.round(((currentIndex + 1) / total) * 100);

      onUpdate({
        executionId,
        status: isLast ? 'COMPLETED' : 'RUNNING',
        progress,
        currentNode: node.id,
        nodeType: node.type,
        stepLog: {
          step: node.data?.label || node.id,
          status: 'COMPLETED',
          duration: `${Math.floor(40 + Math.random() * 220)}ms`,
          timestamp: new Date().toLocaleTimeString(),
          message: `Executed node: ${node.data?.label || node.id} (${node.type})`,
        },
      });

      currentIndex++;
    }, 1200);

    this.mockIntervals.add(interval);
    return () => {
      clearInterval(interval);
      this.mockIntervals.delete(interval);
    };
  }

  disconnect() {
    this.mockIntervals.forEach((interval) => clearInterval(interval));
    this.mockIntervals.clear();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;
