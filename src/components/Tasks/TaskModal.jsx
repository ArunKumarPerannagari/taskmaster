import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiFlag, FiTag, FiAlignLeft, FiPlus } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';
import { DEFAULT_CATEGORIES } from '../../utils/taskHelpers';

const PRIORITIES = ['low', 'medium', 'high'];
const PRIORITY_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#f43f5e' };

const EMPTY = { title: '', description: '', priority: 'medium', category: 'Work', dueDate: '', tags: [] };

export default function TaskModal({ task, onClose }) {
  const { addTask, editTask } = useTaskContext();
  const isEdit = !!task;
  const [form, setForm] = useState(isEdit ? { ...EMPTY, ...task } : EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (isEdit) editTask(task.id, form);
    else addTask(form);
    onClose();
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  return (
    <AnimatePresence>
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--bg-card)', borderRadius: 20, width: '100%', maxWidth: 520,
            maxHeight: '90vh', overflow: 'auto', boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Header */}
          <div style={{ padding: '22px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                {isEdit ? '✏️ Edit Task' : '✨ New Task'}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {isEdit ? 'Update your task details' : 'Add a new task to your board'}
              </p>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <FiX size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>Task Title *</label>
              <input
                autoFocus value={form.title}
                onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: '' })); }}
                placeholder="What needs to be done?"
                style={{ ...inputStyle, borderColor: errors.title ? 'var(--accent-rose)' : 'var(--border)' }}
              />
              {errors.title && <p style={{ color: 'var(--accent-rose)', fontSize: 12, marginTop: 4 }}>{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}><FiAlignLeft size={12} style={{ marginRight: 4 }} />Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Add more details..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            {/* Priority + Category row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}><FiFlag size={12} style={{ marginRight: 4 }} />Priority</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {PRIORITIES.map(p => (
                    <button key={p} type="button"
                      onClick={() => setForm(f => ({ ...f, priority: p }))}
                      style={{
                        flex: 1, padding: '8px 4px', borderRadius: 10, border: '2px solid',
                        borderColor: form.priority === p ? PRIORITY_COLORS[p] : 'var(--border)',
                        background: form.priority === p ? `${PRIORITY_COLORS[p]}18` : 'transparent',
                        color: form.priority === p ? PRIORITY_COLORS[p] : 'var(--text-muted)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                        transition: 'var(--transition)', fontFamily: 'var(--font)',
                      }}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ ...inputStyle, width: '100%', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30, appearance: 'none' }}>
                  {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label style={labelStyle}><FiCalendar size={12} style={{ marginRight: 4 }} />Due Date</label>
              <input type="date" value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                style={{ ...inputStyle, colorScheme: 'dark light' }}
              />
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}><FiTag size={12} style={{ marginRight: 4 }} />Tags</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Type a tag and press Enter"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button type="button" onClick={addTag}
                  style={{ padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)', borderRadius: 10, cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, fontFamily: 'var(--font)' }}>
                  <FiPlus size={14} /> Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {form.tags.map(tag => (
                    <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'rgba(168,85,247,0.12)', color: 'var(--accent-purple)', borderRadius: 99, fontSize: 12, fontWeight: 500 }}>
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0, opacity: 0.6 }}><FiX size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button type="button" onClick={onClose}
                style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', transition: 'var(--transition)' }}>
                Cancel
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', boxShadow: 'var(--shadow-primary)' }}>
                {isEdit ? 'Save Changes' : '+ Create Task'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const labelStyle = { display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font)', boxSizing: 'border-box' };
