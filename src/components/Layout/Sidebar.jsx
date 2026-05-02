import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiGrid, FiCheckSquare, FiCalendar, FiSun,
  FiChevronLeft, FiChevronRight, FiTrash2,
} from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';
import { getTaskStats, DEFAULT_CATEGORIES, getCategoryColor } from '../../utils/taskHelpers';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid />,        view: 'all' },
  { id: 'all',       label: 'All Tasks', icon: <FiCheckSquare />, view: 'all' },
  { id: 'today',     label: 'Today',     icon: <FiSun />,         view: 'today' },
  { id: 'week',      label: 'This Week', icon: <FiCalendar />,    view: 'week' },
];

export default function Sidebar({ activePage, setActivePage, collapsed, setCollapsed }) {
  const { tasks, filters, setFilters, clearCompleted } = useTaskContext();
  const stats = getTaskStats(tasks);
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleNav = (item) => {
    setActiveNav(item.id);
    if (item.id === 'dashboard') { setActivePage('dashboard'); return; }
    setActivePage('tasks');
    setFilters(f => ({ ...f, view: item.view, priority: 'all' }));
  };

  const handleCategoryFilter = (cat) => {
    setActivePage('tasks');
    setFilters(f => ({ ...f, category: cat, view: 'all' }));
    setActiveNav('');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 20px',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid var(--border)',
        minHeight: 68,
      }}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0,
              boxShadow: 'var(--shadow-primary)',
            }}>T</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1 }}>
                Task Master
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {stats.total} tasks
              </div>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 16,
          }}>T</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '4px 6px', cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
            flexShrink: 0, transition: 'var(--transition)',
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </button>
      </div>

      {/* Progress summary */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Overall Progress</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{stats.percent}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--accent-purple))',
                borderRadius: 99,
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            {[
              { label: 'Done',    value: stats.completed, color: 'var(--accent-emerald)' },
              { label: 'Pending', value: stats.pending,   color: 'var(--accent-amber)' },
              { label: 'Overdue', value: stats.overdue,   color: 'var(--accent-rose)' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: collapsed ? '12px 0' : '12px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
        {!collapsed && (
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 8px 8px', marginTop: 4 }}>
            Navigation
          </div>
        )}
        {NAV_ITEMS.map(item => (
          <NavButton
            key={item.id}
            item={item}
            active={activeNav === item.id}
            collapsed={collapsed}
            onClick={() => handleNav(item)}
            badge={item.id === 'today' ? tasks.filter(t => {
              if (!t.dueDate || t.completed) return false;
              return t.dueDate === new Date().toISOString().split('T')[0];
            }).length : null}
          />
        ))}

        {/* Categories */}
        {!collapsed && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', padding: '16px 8px 8px' }}>
              Categories
            </div>
            {DEFAULT_CATEGORIES.slice(0, 6).map(cat => {
              const color = getCategoryColor(cat);
              const count = tasks.filter(t => t.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8, border: 'none',
                    background: filters.category === cat ? `${color}18` : 'transparent',
                    cursor: 'pointer', transition: 'var(--transition)',
                    color: filters.category === cat ? color : 'var(--text-secondary)',
                    fontWeight: 500, fontSize: 13, textAlign: 'left', fontFamily: 'var(--font)',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{cat}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '1px 7px', borderRadius: 99 }}>{count}</span>
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer — only Clear Completed */}
      <div style={{ padding: collapsed ? '12px 0' : '12px 12px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={clearCompleted}
          title={collapsed ? 'Clear Completed' : ''}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: 10, padding: collapsed ? '8px 0' : '8px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 8, border: 'none',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--accent-rose)',
            fontSize: 13, fontWeight: 500, transition: 'var(--transition)',
            fontFamily: 'var(--font)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <FiTrash2 size={16} />
          {!collapsed && 'Clear Completed'}
        </button>
      </div>
    </motion.aside>
  );
}

function NavButton({ item, active, collapsed, onClick, badge }) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={collapsed ? item.label : ''}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: collapsed ? '10px 0' : '10px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 10,
        border: 'none',
        background: active
          ? 'linear-gradient(135deg, var(--primary)22, var(--accent-purple)11)'
          : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        fontWeight: active ? 600 : 500,
        fontSize: 14,
        cursor: 'pointer',
        transition: 'var(--transition)',
        marginBottom: 2,
        position: 'relative',
        fontFamily: 'var(--font)',
      }}
    >
      <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
      {!collapsed && badge > 0 && (
        <span style={{
          background: 'var(--accent-rose)', color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '1px 6px', borderRadius: 99, minWidth: 18, textAlign: 'center'
        }}>{badge}</span>
      )}
      {active && (
        <motion.div
          layoutId="sidebar-active"
          style={{
            position: 'absolute', left: 0, top: '20%', bottom: '20%',
            width: 3, borderRadius: '0 3px 3px 0', background: 'var(--primary)'
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
    </motion.button>
  );
}
