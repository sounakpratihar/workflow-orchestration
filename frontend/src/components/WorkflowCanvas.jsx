import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StartNode from './CustomNodes/StartNode';
import TaskNode from './CustomNodes/TaskNode';
import ConditionNode from './CustomNodes/ConditionNode';
import ApiNode from './CustomNodes/ApiNode';
import DelayNode from './CustomNodes/DelayNode';
import LoopNode from './CustomNodes/LoopNode';
import EndNode from './CustomNodes/EndNode';

import { validateWorkflowGraph } from '../utils/graphAlgorithms';
import { useTheme } from '../context/ThemeContext';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  condition: ConditionNode,
  api: ApiNode,
  delay: DelayNode,
  loop: LoopNode,
  end: EndNode,
};

function FlowCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodeSelect,
  onValidationChange,
  isSimulating,
  activeSimNodeId,
  cycleEdges = [],
  onNodesChangeParent,
  onEdgesChangeParent,
}) {
  const { isDark } = useTheme();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when initialNodes or initialEdges change from parent
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Run validation whenever nodes or edges update
  useEffect(() => {
    const result = validateWorkflowGraph(nodes, edges);
    if (onValidationChange) {
      onValidationChange(result);
    }
  }, [nodes, edges, onValidationChange]);

  // Notify parent of updates
  useEffect(() => {
    if (onNodesChangeParent) onNodesChangeParent(nodes);
  }, [nodes, onNodesChangeParent]);

  useEffect(() => {
    if (onEdgesChangeParent) onEdgesChangeParent(edges);
  }, [edges, onEdgesChangeParent]);

  // Handle new connection creation
  const onConnect = useCallback(
    (params) => {
      let strokeColor = '#6366f1';
      let edgeLabel = '';

      if (params.sourceHandle === 'true') {
        strokeColor = '#10b981';
        edgeLabel = 'True';
      } else if (params.sourceHandle === 'false') {
        strokeColor = '#ef4444';
        edgeLabel = 'False';
      }

      const newEdge = {
        ...params,
        id: `e_${params.source}_${params.sourceHandle || 'def'}_${params.target}`,
        animated: true,
        label: edgeLabel,
        style: {
          stroke: strokeColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle Drag & Drop onto canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const itemRaw = event.dataTransfer.getData('application/reactflow/item');

      if (!type || !itemRaw) return;

      const item = JSON.parse(itemRaw);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}_${Date.now().toString(36)}`,
        type,
        position,
        data: {
          ...item.defaultData,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  // Highlight active node in simulation or in cycle
  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      const isRunning = isSimulating && node.id === activeSimNodeId;
      return {
        ...node,
        data: {
          ...node.data,
          executionStatus: isRunning ? 'RUNNING' : node.data?.executionStatus,
        },
      };
    });
  }, [nodes, isSimulating, activeSimNodeId]);

  // Style edges (turn cycle edges into glowing red)
  const displayEdges = useMemo(() => {
    const cycleEdgeSet = new Set(cycleEdges);
    return edges.map((e) => {
      const isCycleEdge = cycleEdgeSet.has(e.id);
      if (isCycleEdge) {
        return {
          ...e,
          animated: true,
          style: {
            stroke: '#ef4444',
            strokeWidth: 3.5,
          },
          label: 'Cycle Loop Edge!',
          labelStyle: { fill: '#ef4444', fontWeight: 'bold' },
        };
      }
      return e;
    });
  }, [edges, cycleEdges]);

  const onNodeClick = useCallback(
    (_, node) => {
      if (onNodeSelect) {
        onNodeSelect(node);
      }
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    if (onNodeSelect) {
      onNodeSelect(null);
    }
  }, [onNodeSelect]);

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
        }}
        className="bg-slate-50 dark:bg-slate-950"
      >
        <Controls
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg !m-4"
          showInteractive={false}
        />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg !m-4 !bottom-4 !right-4"
          nodeColor={(n) => {
            if (n.type === 'start') return '#10b981';
            if (n.type === 'condition') return '#f59e0b';
            if (n.type === 'api') return '#06b6d4';
            if (n.type === 'delay') return '#a855f7';
            if (n.type === 'loop') return '#f97316';
            if (n.type === 'end') return '#ef4444';
            return '#6366f1';
          }}
          maskColor={isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(241, 245, 249, 0.7)'}
        />
        <Background
          color={isDark ? '#334155' : '#cbd5e1'}
          gap={18}
          size={1.5}
          variant="dots"
        />
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas(props) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
}
