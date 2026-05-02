import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';
import { filterTasks, sortTasks } from '../../utils/taskHelpers';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo',       label: 'To Do',       color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { id: 'inprogress', label: 'In Progress',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { id: 'done',       label: 'Done',         color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
];

export default function TaskBoard({ onEdit, onAddTask }) {
  const { tasks, filters, sortBy, updateTaskStatus, reorderTasks } = useTaskContext();
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [dragOverTask, setDragOverTask] = useState(null);

  const filtered = sortTasks(filterTasks(tasks, filters), sortBy);

  const getColTasks = (colId) => filtered.filter(t => {
    if (colId === 'todo') return !t.completed && (t.status === 'todo' || !t.status);
    if (colId === 'inprogress') return !t.completed && t.status === 'inprogress';
    if (colId === 'done') return t.completed || t.status === 'done';
    return false;
  });

  // Drag handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = () => { setDraggedTask(null); setDragOverCol(null); setDragOverTask(null); };
  const handleDragOverCol = (e, colId) => { e.preventDefault(); setDragOverCol(colId); };
  const handleDragOverTask = (e, task) => { e.preventDefault(); setDragOverTask(task.id); };
  const handleDropOnCol = (e, colId) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== colId) {
      updateTaskStatus(draggedTask.id, colId === 'done' ? 'done' : colId);
    }
    setDragOverCol(null);
    setDragOverTask(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'start' }}>
      {COLUMNS.map(col => {
        const colTasks = getColTasks(col.id);
        const isDragOver = dragOverCol === col.id;
        return (
          <div
            key={col.id}
            onDragOver={e => handleDragOverCol(e, col.id)}
            onDrop={e => handleDropOnCol(e, col.id)}
            style={{
              background: isDragOver ? col.bg : 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: `1.5px solid ${isDragOver ? col.color : 'var(--border)'}`,
              transition: 'border-color 0.2s, background 0.2s',
              minHeight: 300,
            }}
          >
            {/* Column Header */}
            <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color, boxShadow: `0 0 6px ${col.color}60` }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{col.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: col.color, background: `${col.color}18`, padding: '1px 8px', borderRadius: 99 }}>{colTasks.length}</span>
              </div>
              {col.id === 'todo' && (
                <button onClick={onAddTask} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <FiPlus size={14} />
                </button>
              )}
            </div>

            {/* Cards */}
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 200 }}>
              <AnimatePresence>
                {colTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--text-muted)', fontSize: 13 }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{col.id === 'done' ? '🎉' : '📋'}</div>
                    <p style={{ fontWeight: 500 }}>{col.id === 'done' ? 'No completed tasks yet' : 'Drop tasks here'}</p>
                  </motion.div>
                ) : colTasks.map((task, i) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={e => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    onDragOver={e => handleDragOverTask(e, task)}
                    style={{
                      opacity: draggedTask?.id === task.id ? 0.4 : 1,
                      transform: dragOverTask === task.id && draggedTask?.id !== task.id ? 'translateY(-4px)' : 'none',
                      transition: 'transform 0.15s ease, opacity 0.15s ease',
                    }}
                  >
                    <TaskCard task={task} onEdit={onEdit} index={i} isDragging={draggedTask?.id === task.id} />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
