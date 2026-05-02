import React from 'react';

export default function ProgressBar({ value = 0, color, height = 8, showLabel = false, animated = true }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor = color || 'var(--primary)';

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: 6,
          fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500
        }}>
          <span>Progress</span>
          <span style={{ color: barColor, fontWeight: 700 }}>{clampedValue}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <div
          className="progress-fill"
          style={{
            width: `${clampedValue}%`,
            background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
            transition: animated ? 'width 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
