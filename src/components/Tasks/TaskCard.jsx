import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiCheck } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';
import { formatDueDate, getDueDateColor, getCategoryColor, isOverdue } from '../../utils/taskHelpers';
import { TagBadge } from '../shared/Badge';

const PRIORITY_COLORS = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };
const PRIORITY_DOT = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };

export default function TaskCard({ task, onEdit, index, isDragging, dragHandleProps }) {
  const { toggleComplete, deleteTask } = useTaskContext();
  const [hovered, setHovered] = useState(false);
  const overdue = isOverdue(task);
  const dueDateStr = formatDueDate(task.dueDate);
  const dueDateColor = getDueDateColor(task);
  const catColor = getCategoryColor(task.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      {...dragHandleProps}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${overdue && !task.completed ? 'rgba(244,63,94,0.3)' : 'var(--border)'}`,
        padding: '14px 16px',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Priority left border */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: PRIORITY_COLORS[task.priority] || '#6366f1', borderRadius: '4px 0 0 4px' }} />

      {/* Overdue banner */}
      {overdue && !task.completed && (
        <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(244,63,94,0.12)', color: 'var(--accent-rose)', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: '0 12px 0 8px', letterSpacing: '0.5px' }}>
          OVERDUE
        </div>
      )}

      <div style={{ paddingLeft: 8 }}>
        {/* Top row: checkbox + title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
            style={{
              width: 22, height: 22, borderRadius: 6, border: `2px solid ${task.completed ? 'var(--accent-emerald)' : 'var(--border)'}`,
              background: task.completed ? 'var(--accent-emerald)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {task.completed && <FiCheck size={12} color="#fff" strokeWidth={3} />}
          </motion.button>
          <span style={{
            fontSize: 14, fontWeight: 600, color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: task.completed ? 'line-through' : 'none',
            lineHeight: 1.4, flex: 1,
            transition: 'color 0.2s ease',
          }}>
            {task.title}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, paddingLeft: 32, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', paddingLeft: 32, marginBottom: 10 }}>
            {task.tags.slice(0, 3).map(tag => <TagBadge key={tag} tag={tag} />)}
            {task.tags.length > 3 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{task.tags.length - 3}</span>}
          </div>
        )}

        {/* Bottom meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 32 }}>
          {/* Category dot */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: catColor, fontWeight: 600, background: `${catColor}15`, padding: '2px 8px', borderRadius: 99 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: catColor }} />
            {task.category}
          </span>

          {/* Priority */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: PRIORITY_DOT[task.priority], fontWeight: 600 }}>
            <FiFlag size={10} />
            {task.priority}
          </span>

          {/* Due date */}
          {dueDateStr && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: dueDateColor, fontWeight: overdue ? 700 : 500, marginLeft: 'auto' }}>
              <FiCalendar size={10} />
              {dueDateStr}
            </span>
          )}

          {/* Action buttons (show on hover) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            style={{ display: 'flex', gap: 4, marginLeft: dueDateStr ? 4 : 'auto' }}
          >
            <button onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            ><FiEdit2 size={11} /></button>
            <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
              style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-rose)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            ><FiTrash2 size={11} /></button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
