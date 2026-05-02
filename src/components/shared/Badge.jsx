import React from 'react';
import { FiFlag } from 'react-icons/fi';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   className: 'badge-high',   color: 'var(--priority-high)' },
  medium: { label: 'Medium', className: 'badge-medium', color: 'var(--priority-medium)' },
  low:    { label: 'Low',    className: 'badge-low',    color: 'var(--priority-low)' },
};

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <span className={`badge ${cfg.className}`}>
      <FiFlag size={9} />
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ completed }) {
  return (
    <span className={`badge ${completed ? 'badge-done' : 'badge-pending'}`}>
      {completed ? '✓ Done' : '● Pending'}
    </span>
  );
}

export function TagBadge({ tag }) {
  return <span className="badge badge-tag">#{tag}</span>;
}

export function CategoryBadge({ category, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: 11, fontWeight: 600,
      background: `${color}22`,
      color: color,
      border: `1px solid ${color}44`,
    }}>
      {category}
    </span>
  );
}
