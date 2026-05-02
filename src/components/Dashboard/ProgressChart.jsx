import React from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../../context/TaskContext';
import { getTaskStats, getCategoryStats, getCategoryColor } from '../../utils/taskHelpers';

export default function ProgressChart() {
  const { tasks } = useTaskContext();
  const stats = getTaskStats(tasks);
  const catStats = getCategoryStats(tasks).slice(0, 5);
  const pct = stats.percent;

  // SVG donut chart
  const R = 54, CX = 70, CY = 70, STROKE = 12;
  const circ = 2 * Math.PI * R;
  const filled = (pct / 100) * circ;

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Completion Overview</h3>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {/* Donut */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--bg-tertiary)" strokeWidth={STROKE} />
            <motion.circle
              cx={CX} cy={CY} r={R} fill="none"
              stroke="url(#donutGrad)"
              strokeWidth={STROKE}
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: circ - filled }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              strokeLinecap="round"
              transform={`rotate(-90 ${CX} ${CY})`}
            />
            <defs>
              <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{pct}%</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Done</span>
          </div>
        </div>

        {/* Category bars */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {catStats.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No tasks yet.</p>
          ) : catStats.map((cat, i) => {
            const color = getCategoryColor(cat.name);
            return (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{cat.name}</span>
                  <span style={{ fontSize: 11, color, fontWeight: 700 }}>{cat.percent}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * i }}
                    style={{ height: '100%', background: color, borderRadius: 99 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        {[
          { label: 'Completed', value: stats.completed, color: '#10b981' },
          { label: 'Remaining', value: stats.pending, color: '#6366f1' },
          { label: 'Overdue', value: stats.overdue, color: '#f43f5e' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
