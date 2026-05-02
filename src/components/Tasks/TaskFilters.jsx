import React from 'react';
import { FiFilter, FiArrowUp, FiSearch } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';
import { DEFAULT_CATEGORIES } from '../../utils/taskHelpers';

const PRIORITIES = ['all', 'high', 'medium', 'low'];
const STATUSES   = ['all', 'pending', 'completed', 'overdue'];
const SORT_OPTIONS = [
  { value: 'created',   label: 'Newest First' },
  { value: 'date-asc',  label: 'Due Date ↑' },
  { value: 'date-desc', label: 'Due Date ↓' },
  { value: 'priority',  label: 'Priority' },
  { value: 'name',      label: 'Name A–Z' },
  { value: 'status',    label: 'Status' },
];

export default function TaskFilters() {
  const { filters, setFilters, sortBy, setSortBy, tasks } = useTaskContext();

  const usedCategories = ['all', ...new Set(tasks.map(t => t.category).filter(Boolean))];

  const handleFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const inputStyle = {
    padding: '8px 12px', borderRadius: 10, border: '1.5px solid var(--border)',
    background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: 13,
    fontFamily: 'var(--font)', cursor: 'pointer', transition: 'var(--transition)',
    appearance: 'none', outline: 'none',
  };

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
      {/* Search */}
      <div style={{ position: 'relative', minWidth: 200 }}>
        <FiSearch size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={filters.search}
          onChange={e => handleFilter('search', e.target.value)}
          placeholder="Search tasks..."
          style={{ ...inputStyle, paddingLeft: 32, width: '100%' }}
        />
      </div>

      {/* Priority pills */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority:</span>
        {PRIORITIES.map(p => (
          <button key={p} onClick={() => handleFilter('priority', p)}
            style={{
              padding: '5px 12px', borderRadius: 99, border: '1.5px solid',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)',
              fontFamily: 'var(--font)', textTransform: 'capitalize',
              borderColor: filters.priority === p ? 'var(--primary)' : 'var(--border)',
              background: filters.priority === p ? 'var(--primary)' : 'transparent',
              color: filters.priority === p ? '#fff' : 'var(--text-secondary)',
            }}>
            {p === 'all' ? 'All' : p}
          </button>
        ))}
      </div>

      {/* Status */}
      <select value={filters.status} onChange={e => handleFilter('status', e.target.value)}
        style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30 }}>
        {STATUSES.map(s => <option key={s} value={s} style={{ background: 'var(--bg-card)' }}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
      </select>

      {/* Category */}
      <select value={filters.category} onChange={e => handleFilter('category', e.target.value)}
        style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30 }}>
        {usedCategories.map(c => <option key={c} value={c} style={{ background: 'var(--bg-card)' }}>{c === 'all' ? 'All Categories' : c}</option>)}
      </select>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
        <FiArrowUp size={13} style={{ color: 'var(--text-muted)' }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30 }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: 'var(--bg-card)' }}>{o.label}</option>)}
        </select>
      </div>

      {/* Active filter count */}
      {(filters.priority !== 'all' || filters.status !== 'all' || filters.category !== 'all' || filters.search) && (
        <button onClick={() => setFilters({ search: '', priority: 'all', category: 'all', status: 'all', view: filters.view })}
          style={{ padding: '5px 12px', borderRadius: 99, border: '1.5px solid var(--accent-rose)', background: 'rgba(244,63,94,0.08)', color: 'var(--accent-rose)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
          Clear Filters ✕
        </button>
      )}
    </div>
  );
}
