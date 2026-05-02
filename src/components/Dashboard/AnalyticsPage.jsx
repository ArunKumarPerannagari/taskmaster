import React from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../../context/TaskContext';
import { getTaskStats, getCategoryStats, getWeeklyData, getCategoryColor } from '../../utils/taskHelpers';
import ProgressBar from '../shared/ProgressBar';

export default function AnalyticsPage() {
  const { tasks } = useTaskContext();
  const stats = getTaskStats(tasks);
  const catStats = getCategoryStats(tasks);
  const weekData = getWeeklyData(tasks);
  const today = new Date().getDay();

  const priorityCounts = {
    high:   tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low:    tasks.filter(t => t.priority === 'low').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Analytics</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Deep dive into your productivity insights</p>
      </motion.div>

      {/* Big stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { label: 'Completion Rate', value: `${stats.percent}%`, color: '#6366f1', sub: `${stats.completed}/${stats.total} tasks done` },
          { label: 'High Priority Done', value: tasks.filter(t => t.priority === 'high' && t.completed).length, color: '#f43f5e', sub: `out of ${priorityCounts.high} high priority` },
          { label: 'On-Time Completion', value: `${stats.total === 0 ? 0 : Math.round(((stats.total - stats.overdue) / Math.max(stats.total, 1)) * 100)}%`, color: '#10b981', sub: `${stats.overdue} overdue tasks` },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Priority breakdown */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Priority Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'High', count: priorityCounts.high, done: tasks.filter(t => t.priority === 'high' && t.completed).length, color: '#f43f5e' },
              { label: 'Medium', count: priorityCounts.medium, done: tasks.filter(t => t.priority === 'medium' && t.completed).length, color: '#f59e0b' },
              { label: 'Low', count: priorityCounts.low, done: tasks.filter(t => t.priority === 'low' && t.completed).length, color: '#10b981' },
            ].map(p => {
              const pct = p.count === 0 ? 0 : Math.round((p.done / p.count) * 100);
              return (
                <div key={p.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{p.label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.done}/{p.count} — <strong style={{ color: p.color }}>{pct}%</strong></span>
                  </div>
                  <ProgressBar value={pct} color={p.color} height={7} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Category Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {catStats.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No tasks yet.</p>
            ) : catStats.map(cat => {
              const color = getCategoryColor(cat.name);
              return (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cat.completed}/{cat.total}</span>
                  </div>
                  <ProgressBar value={cat.percent} color={color} height={7} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Weekly Activity</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 160 }}>
          {weekData.map((d, i) => {
            const maxVal = Math.max(...weekData.map(x => x.created + x.done), 1);
            const isToday = i === today;
            const h = Math.max(8, ((d.created + d.done) / maxVal) * 140);
            return (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{d.created + d.done || ''}</div>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: h }}
                  transition={{ duration: 0.8, delay: i * 0.06 }}
                  style={{
                    width: '100%', background: isToday
                      ? 'linear-gradient(180deg, var(--primary), var(--accent-purple))'
                      : 'var(--bg-tertiary)',
                    borderRadius: '6px 6px 0 0',
                    boxShadow: isToday ? 'var(--shadow-primary)' : 'none',
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--primary)' : 'var(--text-muted)' }}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
