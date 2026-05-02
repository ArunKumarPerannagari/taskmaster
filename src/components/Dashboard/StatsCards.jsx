import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiAlertCircle, FiList } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';
import { getTaskStats } from '../../utils/taskHelpers';

const CARDS = [
  { key: 'total',     label: 'Total Tasks',       icon: <FiList />,         color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { key: 'completed', label: 'Completed',          icon: <FiCheckCircle />,  color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { key: 'pending',   label: 'Pending',            icon: <FiClock />,        color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { key: 'overdue',   label: 'Overdue',            icon: <FiAlertCircle />,  color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
];

export default function StatsCards({ onFilter }) {
  const { tasks } = useTaskContext();
  const stats = getTaskStats(tasks);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
          whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}
          onClick={() => onFilter && onFilter(card.key)}
          style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', padding: '20px 22px',
            cursor: 'pointer', transition: 'var(--transition)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: card.color, fontSize: 20,
            }}>
              {card.icon}
            </div>
            {card.key === 'completed' && stats.total > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 99 }}>
                {stats.percent}%
              </span>
            )}
          </div>
          <CountUp value={stats[card.key]} color={card.color} />
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 2 }}>
            {card.label}
          </div>
          {card.key === 'completed' && (
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.percent}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  style={{ height: '100%', background: card.color, borderRadius: 99 }}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function CountUp({ value, color }) {
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1.1 }}
    >
      {value}
    </motion.div>
  );
}
