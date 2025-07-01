"use client";
import React, { useCallback, useRef } from 'react';
import { ReactFlow, MiniMap, Controls, addEdge, useNodesState, useEdgesState, ReactFlowProvider, Connection, Edge, Node, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PlusIcon, DownloadIcon } from '@radix-ui/react-icons';
import type { NodeProps } from '@xyflow/react';

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Start' }, type: 'default' },
];
const initialEdges: Edge[] = [];

// EditableNode component
function EditableNode({ id: _id, data, selected, isConnectable }: NodeProps) {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>(typeof data.label === 'string' ? data.label : '');
  const color = typeof data.color === 'string' ? data.color : '#f3f4f6';
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const onBlur = (): void => {
    setEditing(false);
    if (typeof data.onChange === 'function') data.onChange(value, color);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      setEditing(false);
      if (typeof data.onChange === 'function') data.onChange(value, color);
    }
  };

  // Color palette
  const COLORS = ['#f3f4f6', '#fef08a', '#bbf7d0', '#bae6fd', '#fca5a5', '#c4b5fd', '#fcd34d', '#fdba74', '#a7f3d0', '#f9a8d4'];

  return (
    <div className={`rounded-lg border-2 ${selected ? 'border-blue-500' : 'border-gray-300'} shadow px-3 py-2 min-w-[80px] text-center`}
      style={{ background: color }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {editing ? (
        <>
          <input
            ref={inputRef}
            className="w-full rounded border border-gray-300 px-1 py-0.5 text-center text-sm mb-1"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          <div className="flex flex-wrap gap-1 justify-center mb-1">
            {COLORS.map(c => (
              <button
                key={c}
                className={`w-5 h-5 rounded-full border-2 ${color === c ? 'border-blue-500' : 'border-gray-300'}`}
                style={{ background: c }}
                onClick={() => {
                  if (typeof data.onChange === 'function') data.onChange(value, c);
                }}
                onMouseDown={e => e.stopPropagation()}
                type="button"
                tabIndex={-1}
                aria-label={`Set color ${c}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm break-words" onDoubleClick={() => setEditing(true)}>{typeof data.label === 'string' ? data.label : ''}</span>
          <button className="ml-1 p-1 rounded hover:bg-blue-100" onClick={() => setEditing(true)} title="Edit label">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 5.487a2.1 2.1 0 1 1 2.97 2.97L8.5 19.79l-4.243.707.707-4.243 11.898-11.898Z"/></svg>
          </button>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

const nodeTypes = { editable: EditableNode };

function DiagramEditorInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<unknown>(null);

  const onConnect = useCallback((params: Edge | Connection) => setEdges(eds => addEdge(params, eds)), [setEdges]);

  // Update node label
  const updateNodeLabel = useCallback((id: string, label: string, color?: string) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label, color: color || n.data.color } } : n));
  }, [setNodes]);

  // Add a new node
  const addNode = () => {
    const newId = (Date.now() + Math.random()).toString();
    setNodes(nds => [
      ...nds,
      {
        id: newId,
        position: { x: 150 + Math.random() * 100, y: 150 + Math.random() * 100 },
        data: { label: 'Node', color: '#f3f4f6', onChange: (label: string, color: string) => updateNodeLabel(newId, label, color) },
        type: 'editable',
      },
    ]);
  };

  // Export as image
  const exportImage = async () => {
    if (!reactFlowInstance) return;
    const image = await reactFlowInstance.toPng();
    const a = document.createElement('a');
    a.href = image;
    a.download = 'diagram.png';
    a.click();
  };

  // When rendering nodes, inject onChange for editing
  const nodesWithEdit = nodes.map(node => ({
    ...node,
    type: 'editable',
    data: {
      ...node.data,
      onChange: (label: string, color: string) => updateNodeLabel(node.id, label, color),
    },
  }));

  return (
    <div className="w-full h-[600px] bg-white/60 dark:bg-black/40 rounded-2xl shadow-xl relative">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 bg-white/80 dark:bg-black/60 rounded-xl shadow p-2">
        <button className="p-2 rounded hover:bg-blue-100" onClick={addNode} title="Add Node"><PlusIcon /></button>
        <button className="p-2 rounded hover:bg-blue-100" onClick={exportImage} title="Export as Image"><DownloadIcon /></button>
      </div>
      <div ref={reactFlowWrapper} className="w-full h-full rounded-2xl">
        <ReactFlow
          nodes={nodesWithEdit}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function DiagramEditor() {
  return (
    <ReactFlowProvider>
      <DiagramEditorInner />
    </ReactFlowProvider>
  );
} 