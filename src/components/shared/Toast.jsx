import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import { useTaskContext } from '../../context/TaskContext';

const ICONS = {
  success: <FiCheckCircle />,
  error: <FiAlertCircle />,
  warning: <FiAlertTriangle />,
  info: <FiInfo />,
};

const COLORS = {
  success: { bg: 'var(--accent-emerald)', light: 'rgba(16,185,129,0.12)' },
  error:   { bg: 'var(--accent-rose)',    light: 'rgba(244,63,94,0.12)' },
  warning: { bg: 'var(--accent-amber)',   light: 'rgba(245,158,11,0.12)' },
  info:    { bg: 'var(--primary)',        light: 'rgba(99,102,241,0.12)' },
};

function Toast({ toast }) {
  const { removeToast } = useTaskContext();
  const [progress, setProgress] = useState(100);
  const color = COLORS[toast.type] || COLORS.info;

  useEffect(() => {
    const start = Date.now();
    const duration = 5000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
      if (elapsed >= duration) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid var(--border)`,
        borderLeft: `4px solid ${color.bg}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        minWidth: 300,
        maxWidth: 380,
        boxShadow: 'var(--shadow-lg)',
        pointerEvents: 'all',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ color: color.bg, fontSize: 20, marginTop: 1, flexShrink: 0 }}>
          {ICONS[toast.type]}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>
            {toast.title}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {toast.message}
          </div>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0 }}
        >
          <FiX size={16} />
        </button>
      </div>
      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: 3,
        width: `${progress}%`, background: color.bg,
        transition: 'width 0.05s linear', borderRadius: '0 0 0 var(--radius-md)'
      }} />
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts } = useTaskContext();
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
      </AnimatePresence>
    </div>
  );
}
