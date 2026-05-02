import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiEye, FiEyeOff, FiZap } from 'react-icons/fi';

export default function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields.'); return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      sessionStorage.setItem('tm_user', form.username);
      onLogin(form.username);
    }, 900);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 30% 40%, #1e1352 0%, #0f172a 50%, #060b14 100%)',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative glow blobs */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(100px)', top: '-20%', left: '-15%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: 'rgba(168,85,247,0.13)', filter: 'blur(90px)', bottom: '-15%', right: '-10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(6,182,212,0.07)', filter: 'blur(70px)', top: '35%', right: '20%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(244,63,94,0.06)', filter: 'blur(80px)', bottom: '15%', left: '10%', pointerEvents: 'none' }} />

      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'rgba(15,23,42,0.72)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: 28,
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
          padding: '44px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, delay: 0.2 }}
            style={{
              width: 70, height: 70, borderRadius: 22, margin: '0 auto 18px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99,102,241,0.55), 0 0 0 1px rgba(99,102,241,0.2)',
            }}
          >
            <FiZap size={32} color="#fff" strokeWidth={2.5} />
          </motion.div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, letterSpacing: '-0.5px' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Sign in to Task Master to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Username */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <FiUser size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input
                type="text" placeholder="Enter your username"
                value={form.username}
                autoComplete="username"
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                style={{
                  width: '100%', padding: '12px 14px 12px 44px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, color: '#f1f5f9', fontSize: 14,
                  outline: 'none', transition: 'border-color 0.2s, background 0.2s',
                  boxSizing: 'border-box', fontFamily: 'var(--font)',
                }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'rgba(99,102,241,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input
                type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                value={form.password}
                autoComplete="current-password"
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{
                  width: '100%', padding: '12px 46px 12px 44px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, color: '#f1f5f9', fontSize: 14,
                  outline: 'none', transition: 'border-color 0.2s, background 0.2s',
                  boxSizing: 'border-box', fontFamily: 'var(--font)',
                }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'rgba(99,102,241,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 0 }}>
                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 12, padding: '10px 14px', color: '#f43f5e', fontSize: 13 }}>
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: loading
                ? 'rgba(99,102,241,0.6)'
                : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font)',
              boxShadow: '0 8px 30px rgba(99,102,241,0.45)',
              marginTop: 4, letterSpacing: '0.2px',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </motion.button>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: 12 }}>
            Demo: any username &amp; password works
          </p>
        </form>
      </motion.div>
    </div>
  );
}
