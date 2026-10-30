/**
 * Graph Algorithms & Workflow DAG Validation Utility
 * Supports 3-Color DFS Cycle Detection, Kahn's Topological Sort,
 * and comprehensive node/connection validation.
 */

/**
 * 3-Color DFS Cycle Detection
 * White (0): Unvisited
 * Gray (1): Currently in recursion stack (active path)
 * Black (2): Fully visited and confirmed acyclic downstream
 *
 * @param {Array} nodes
 * @param {Array} edges
 * @returns {{ hasCycle: boolean, cyclePath: string[], cycleEdges: string[] }}
 */
export function detectCycleDFS(nodes, edges) {
  const adj = new Map();
  const edgeMap = new Map(); // "u->v" => edgeId

  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => {
    if (adj.has(e.source)) {
      adj.get(e.source).push(e.target);
      edgeMap.set(`${e.source}->${e.target}`, e.id);
    }
  });

  const color = new Map(); // 0, 1, 2
  const parent = new Map();
  nodes.forEach((n) => color.set(n.id, 0));

  let cycleNode = null;
  let cycleStartNode = null;

  function dfs(u) {
    color.set(u, 1); // Gray

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (color.get(v) === 1) {
        // Back-edge detected! Found a cycle: u -> v
        cycleNode = u;
        cycleStartNode = v;
        return true;
      }
      if (color.get(v) === 0) {
        parent.set(v, u);
        if (dfs(v)) return true;
      }
    }

    color.set(u, 2); // Black
    return false;
  }

  for (const n of nodes) {
    if (color.get(n.id) === 0) {
      if (dfs(n.id)) break;
    }
  }

  if (!cycleNode) {
    return { hasCycle: false, cyclePath: [], cycleEdges: [] };
  }

  // Reconstruct cycle path from cycleNode back to cycleStartNode
  const path = [cycleStartNode];
  let curr = cycleNode;
  while (curr && curr !== cycleStartNode) {
    path.unshift(curr);
    curr = parent.get(curr);
  }
  path.unshift(cycleStartNode);

  // Extract cycle edge IDs
  const cycleEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const key = `${path[i]}->${path[i + 1]}`;
    if (edgeMap.has(key)) {
      cycleEdges.push(edgeMap.get(key));
    }
  }

  return {
    hasCycle: true,
    cyclePath: path,
    cycleEdges,
  };
}

/**
 * Kahn's Algorithm for Topological Sort
 * Computes execution order and verifies if DAG is valid.
 *
 * @param {Array} nodes
 * @param {Array} edges
 * @returns {{ isDAG: boolean, sortedOrder: string[] }}
 */
export function kahnTopologicalSort(nodes, edges) {
  const inDegree = new Map();
  const adj = new Map();

  nodes.forEach((n) => {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  });

  edges.forEach((e) => {
    if (adj.has(e.source) && inDegree.has(e.target)) {
      adj.get(e.source).push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    }
  });

  const queue = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const sortedOrder = [];
  while (queue.length > 0) {
    const u = queue.shift();
    sortedOrder.push(u);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      inDegree.set(v, inDegree.get(v) - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    }
  }

  const isDAG = sortedOrder.length === nodes.length;
  return { isDAG, sortedOrder };
}

/**
 * Comprehensive Workflow Graph Validation
 * Validates start/end existence, connectivity, node configs, and loops.
 *
 * @param {Array} nodes
 * @param {Array} edges
 * @returns {{ isValid: boolean, errors: Array<{ type: string, message: string, nodeId?: string }>, warnings: Array<{ type: string, message: string, nodeId?: string }> }}
 */
export function validateWorkflowGraph(nodes, edges) {
  const errors = [];
  const warnings = [];

  if (!nodes || nodes.length === 0) {
    errors.push({
      type: 'EMPTY_GRAPH',
      message: 'The workflow has no nodes. Add a Start node to begin.',
    });
    return { isValid: false, errors, warnings };
  }

  // 1. Start Node Check
  const startNodes = nodes.filter((n) => n.type === 'start' || n.type === 'trigger');
  if (startNodes.length === 0) {
    errors.push({
      type: 'MISSING_START_NODE',
      message: 'Missing Start node. A workflow must begin with at least one Start or Trigger node.',
    });
  } else if (startNodes.length > 1) {
    warnings.push({
      type: 'MULTIPLE_START_NODES',
      message: `Workflow contains ${startNodes.length} Start nodes. Multiple triggers will execute concurrently.`,
    });
  }

  // 2. End Node Check
  const endNodes = nodes.filter((n) => n.type === 'end' || n.type === 'terminal');
  if (endNodes.length === 0) {
    warnings.push({
      type: 'MISSING_END_NODE',
      message: 'Missing End node. Workflows typically terminate in an explicit End node for clear status tracking.',
    });
  }

  // 3. Node ID Uniqueness
  const idSet = new Set();
  nodes.forEach((n) => {
    if (idSet.has(n.id)) {
      errors.push({
        type: 'DUPLICATE_NODE_ID',
        nodeId: n.id,
        message: `Duplicate node ID detected: "${n.id}". Node IDs must be strictly unique.`,
      });
    }
    idSet.add(n.id);
  });

  // 4. Connectivity & Degrees
  const inDegree = new Map();
  const outDegree = new Map();
  nodes.forEach((n) => {
    inDegree.set(n.id, 0);
    outDegree.set(n.id, 0);
  });

  edges.forEach((e) => {
    if (outDegree.has(e.source)) {
      outDegree.set(e.source, outDegree.get(e.source) + 1);
    }
    if (inDegree.has(e.target)) {
      inDegree.set(e.target, inDegree.get(e.target) + 1);
    }

    // Self loop check
    if (e.source === e.target) {
      errors.push({
        type: 'SELF_LOOP',
        nodeId: e.source,
        message: `Node "${e.source}" connects directly to itself. Direct self-referencing loops are forbidden.`,
      });
    }
  });

  // Check for disconnected nodes
  nodes.forEach((n) => {
    const inD = inDegree.get(n.id) || 0;
    const outD = outDegree.get(n.id) || 0;

    if (inD === 0 && outD === 0 && nodes.length > 1) {
      warnings.push({
        type: 'DISCONNECTED_NODE',
        nodeId: n.id,
        message: `Node "${n.data?.label || n.id}" is completely disconnected from the workflow graph.`,
      });
    }

    // Start nodes shouldn't have incoming connections
    if ((n.type === 'start' || n.type === 'trigger') && inD > 0) {
      warnings.push({
        type: 'START_NODE_INCOMING',
        nodeId: n.id,
        message: `Start node "${n.data?.label || n.id}" has incoming edges. Triggers typically initialize flows.`,
      });
    }

    // End nodes shouldn't have outgoing connections
    if ((n.type === 'end' || n.type === 'terminal') && outD > 0) {
      errors.push({
        type: 'END_NODE_OUTGOING',
        nodeId: n.id,
        message: `Terminal/End node "${n.data?.label || n.id}" cannot have outgoing connections.`,
      });
    }
  });

  // 5. Node Specific Configuration Validation
  nodes.forEach((n) => {
    const config = n.data?.config || {};
    const label = n.data?.label || n.id;

    if (n.type === 'api' || n.type === 'api_request') {
      if (!config.url || config.url.trim() === '') {
        errors.push({
          type: 'MISSING_API_URL',
          nodeId: n.id,
          message: `API node "${label}" is missing an endpoint URL.`,
        });
      } else if (!/^https?:\/\//i.test(config.url.trim())) {
        errors.push({
          type: 'INVALID_URL_SCHEME',
          nodeId: n.id,
          message: `API node "${label}" URL must start with http:// or https://.`,
        });
      }
    }

    if (n.type === 'condition') {
      if (!config.expression || config.expression.trim() === '') {
        warnings.push({
          type: 'EMPTY_CONDITION',
          nodeId: n.id,
          message: `Condition node "${label}" has no evaluation expression specified.`,
        });
      }
      // Check if both TRUE and FALSE branches are connected
      const conditionOutEdges = edges.filter((e) => e.source === n.id);
      const hasTrue = conditionOutEdges.some((e) => e.sourceHandle === 'true');
      const hasFalse = conditionOutEdges.some((e) => e.sourceHandle === 'false');

      if (!hasTrue && !hasFalse && conditionOutEdges.length > 0) {
        // Connected to standard handle
      } else if (!hasTrue || !hasFalse) {
        warnings.push({
          type: 'PARTIAL_BRANCHES',
          nodeId: n.id,
          message: `Condition node "${label}" should ideally connect both "True" and "False" branches. (Missing: ${!hasTrue ? 'True' : ''}${!hasTrue && !hasFalse ? ', ' : ''}${!hasFalse ? 'False' : ''})`,
        });
      }
    }

    if (n.type === 'delay') {
      const duration = Number(config.duration);
      if (isNaN(duration) || duration <= 0) {
        errors.push({
          type: 'INVALID_DELAY',
          nodeId: n.id,
          message: `Delay node "${label}" requires a positive duration value.`,
        });
      }
    }

    if (n.type === 'loop') {
      const maxIterations = Number(config.maxIterations);
      if (isNaN(maxIterations) || maxIterations <= 0) {
        errors.push({
          type: 'INVALID_LOOP_LIMIT',
          nodeId: n.id,
          message: `Loop node "${label}" requires a positive Maximum Iterations limit.`,
        });
      }
    }
  });

  // 6. Loop & Cycle Detection
  const cycleResult = detectCycleDFS(nodes, edges);
  if (cycleResult.hasCycle) {
    const cycleLabels = cycleResult.cyclePath.map((id) => {
      const found = nodes.find((n) => n.id === id);
      return found ? found.data?.label || id : id;
    });

    errors.push({
      type: 'CIRCULAR_DEPENDENCY',
      message: `Illegal cyclic dependency detected: ${cycleLabels.join(' ➔ ')}. Use a dedicated Loop Node for controlled iterations.`,
      cyclePath: cycleResult.cyclePath,
      cycleEdges: cycleResult.cycleEdges,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    cycleResult,
  };
}

