import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiZap } from 'react-icons/fi';
import { getDailyQuote, getDailyTip, QUOTES } from '../../utils/quotes';

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(getDailyQuote());
  const [tip] = useState(getDailyTip());
  const [key, setKey] = useState(0);

  const refreshQuote = () => {
    const next = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(next);
    setKey(k => k + 1);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
      borderRadius: 'var(--radius-lg)', padding: '22px 24px',
      boxShadow: '0 8px 30px rgba(99,102,241,0.3)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circle */}
      <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -30, right: -20, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: -20, left: 40, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }}>✨</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Motivation</span>
        </div>
        <button onClick={refreshQuote} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, transition: 'var(--transition)' }}>
          <FiRefreshCw size={12} /> New
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.6, marginBottom: 8, fontStyle: 'italic', position: 'relative' }}>
            "{quote.text}"
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>— {quote.author}</p>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <FiZap size={14} color="rgba(255,255,255,0.8)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}><strong>Tip:</strong> {tip}</p>
      </div>
    </div>
  );
}
