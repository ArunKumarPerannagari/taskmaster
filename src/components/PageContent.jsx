import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskContext } from '../context/TaskContext';
import { filterTasks, sortTasks } from '../utils/taskHelpers';
import StatsCards from './Dashboard/StatsCards';
import ProgressChart from './Dashboard/ProgressChart';
import WeeklyOverview from './Dashboard/WeeklyOverview';
import MotivationalQuote from './Dashboard/MotivationalQuote';
import TaskFilters from './Tasks/TaskFilters';
import TaskBoard from './Tasks/TaskBoard';
import TaskModal from './Tasks/TaskModal';


export default function PageContent({ activePage, setActivePage, externalModalOpen, onExternalModalClose }) {
  const { tasks, filters, sortBy, setFilters } = useTaskContext();
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const modalOpen = externalModalOpen || internalModalOpen;
  const openAdd = () => { setEditingTask(null); setInternalModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setInternalModalOpen(true); };
  const closeModal = () => {
    setInternalModalOpen(false);
    setEditingTask(null);
    if (onExternalModalClose) onExternalModalClose();
  };

  const handleStatFilter = (key) => {
    setActivePage('tasks');
    if (key === 'overdue') setFilters(f => ({ ...f, status: 'overdue' }));
    else if (key === 'completed') setFilters(f => ({ ...f, status: 'completed' }));
    else if (key === 'pending') setFilters(f => ({ ...f, status: 'pending' }));
    else setFilters(f => ({ ...f, status: 'all' }));
  };

  const filteredSorted = sortTasks(filterTasks(tasks, filters), sortBy);
  const totalFiltered = filteredSorted.length;

  return (
    <>
      <AnimatePresence mode="wait">
        {activePage === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Welcome */}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Dashboard</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Here's your productivity overview</p>
            </div>

            <StatsCards onFilter={handleStatFilter} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <ProgressChart />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <MotivationalQuote />
                <WeeklyOverview />
              </div>
            </div>

            {/* Recent tasks preview */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px 24px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Tasks</h3>
                <button onClick={() => setActivePage('tasks')}
                  style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>
                  View All →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tasks.slice(0, 5).map(task => (
                  <RecentTaskRow key={task.id} task={task} onEdit={() => openEdit(task)} />
                ))}
                {tasks.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No tasks yet. Add one!</p>}
              </div>
            </div>
          </motion.div>
        )}

        {activePage === 'tasks' && (
          <motion.div key="tasks" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>My Tasks</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
                  {totalFiltered} task{totalFiltered !== 1 ? 's' : ''} found
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font)', boxShadow: 'var(--shadow-primary)' }}>
                + New Task
              </motion.button>
            </div>
            <TaskFilters />
            <TaskBoard onEdit={openEdit} onAddTask={openAdd} />
          </motion.div>
        )}


      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && <TaskModal task={editingTask} onClose={closeModal} />}
      </AnimatePresence>
    </>
  );
}

function RecentTaskRow({ task, onEdit }) {
  const { toggleComplete } = useTaskContext();
  const PRIORITY_COLORS = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
      borderRadius: 10, background: 'var(--bg-tertiary)', transition: 'var(--transition)',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
    >
      <button onClick={() => toggleComplete(task.id)}
        style={{
          width: 20, height: 20, borderRadius: 5, border: `2px solid ${task.completed ? '#10b981' : 'var(--border)'}`,
          background: task.completed ? '#10b981' : 'transparent', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
        }}>
        {task.completed && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
      </button>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {task.title}
      </span>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLORS[task.priority], flexShrink: 0 }} />
      {task.dueDate && (
        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{task.dueDate}</span>
      )}
    </div>
  );
}
