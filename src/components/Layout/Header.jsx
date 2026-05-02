import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiSun, FiMoon, FiBell, FiPlus, FiX } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useTaskContext } from '../../context/TaskContext';
import { getTaskStats } from '../../utils/taskHelpers';

export default function Header({ onAddTask, collapsed }) {
  const { theme, toggleTheme } = useTheme();
  const { tasks, filters, setFilters } = useTaskContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const stats = getTaskStats(tasks);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (val) => setFilters(f => ({ ...f, search: val }));

  return (
    <header style={{
      position: 'fixed', top: 0, left: collapsed ? 72 : 260, right: 0,
      height: 'var(--header-height)', background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)', display: 'flex',
      alignItems: 'center', padding: '0 32px', gap: 16, zIndex: 90,
      transition: 'left 0.3s ease', boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>

      <motion.div
        animate={{ width: searchOpen ? 260 : 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center',
          background: searchOpen ? 'var(--bg-tertiary)' : 'transparent',
          borderRadius: 'var(--radius-md)',
          border: searchOpen ? '1.5px solid var(--border-focus)' : '1.5px solid transparent',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) handleSearch(''); }}
          style={{
            width: 40, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0,
          }}
        >
          {searchOpen ? <FiX size={16} /> : <FiSearch size={16} />}
        </button>
        {searchOpen && (
          <input
            ref={searchRef}
            value={filters.search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-primary)', paddingRight: 12 }}
          />
        )}
      </motion.div>

      <button
        title="Notifications"
        style={{
          position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-tertiary)', borderRadius: 10, border: '1px solid var(--border)',
          cursor: 'pointer', color: 'var(--text-secondary)', transition: 'var(--transition)',
        }}
      >
        <FiBell size={16} />
        {stats.overdue > 0 && (
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-rose)', border: '2px solid var(--bg-secondary)' }} />
        )}
      </button>

      <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
        style={{
          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-tertiary)', borderRadius: 10, border: '1px solid var(--border)',
          cursor: 'pointer', color: theme === 'dark' ? 'var(--accent-amber)' : 'var(--text-secondary)',
          transition: 'var(--transition)',
        }} title="Toggle theme"
      >
        {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
      </motion.button>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onAddTask}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10,
          background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
          color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          boxShadow: 'var(--shadow-primary)',
        }}
      >
        <FiPlus size={16} />
        New Task
      </motion.button>
    </header>
  );
}
