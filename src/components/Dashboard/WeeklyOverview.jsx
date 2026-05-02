import React from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../../context/TaskContext';
import { getWeeklyData } from '../../utils/taskHelpers';

export default function WeeklyOverview() {
  const { tasks } = useTaskContext();
  const weekData = getWeeklyData(tasks);
  const today = new Date().getDay();
  const maxVal = Math.max(...weekData.map(d => d.created + d.done), 1);

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Overview</h3>
        <div style={{ display: 'flex', gap: 14 }}>
          <LegendDot color="var(--primary)" label="Created" />
          <LegendDot color="var(--accent-emerald)" label="Completed" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
        {weekData.map((d, i) => {
          const isToday = i === today;
          const createdH = Math.max(4, (d.created / maxVal) * 100);
          const doneH = Math.max(d.done > 0 ? 4 : 0, (d.done / maxVal) * 100);
          return (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: 100 }}>
                {/* Created bar */}
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${createdH}%` }}
                  transition={{ duration: 0.7, delay: i * 0.06 }}
                  style={{
                    flex: 1, background: isToday ? 'var(--primary)' : 'rgba(99,102,241,0.4)',
                    borderRadius: '4px 4px 0 0', minHeight: 4,
                    boxShadow: isToday ? '0 0 8px rgba(99,102,241,0.5)' : 'none',
                  }}
                />
                {/* Completed bar */}
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${doneH}%` }}
                  transition={{ duration: 0.7, delay: i * 0.06 + 0.1 }}
                  style={{
                    flex: 1, background: isToday ? 'var(--accent-emerald)' : 'rgba(16,185,129,0.4)',
                    borderRadius: '4px 4px 0 0', minHeight: d.done > 0 ? 4 : 0,
                  }}
                />
              </div>
              <span style={{
                fontSize: 11, fontWeight: isToday ? 700 : 500,
                color: isToday ? 'var(--primary)' : 'var(--text-muted)',
              }}>{d.day}</span>
              {isToday && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
    </div>
  );
}
