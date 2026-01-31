'use client';

import { useState } from 'react';

export default function LaunchPage() {
  const [form, setForm] = useState({ name: '', symbol: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Bags API create token
    await new Promise(r => setTimeout(r, 1000));
    alert('Coming soon');
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text)',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  return (
    <div style={{ maxWidth: '480px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-1px', marginBottom: '8px' }}>
        Launch Token
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '48px' }}>
        Create a new token on Solana via Bags
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Token Name"
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Symbol</label>
          <input
            type="text"
            value={form.symbol}
            onChange={e => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
            placeholder="SYMBOL"
            maxLength={10}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="About your token..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !form.name || !form.symbol}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 500,
            background: form.name && form.symbol ? 'var(--green)' : '#222',
            color: form.name && form.symbol ? '#000' : '#666',
            border: 'none',
            borderRadius: '6px',
            cursor: form.name && form.symbol ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Creating...' : 'Create Token'}
        </button>
      </form>
    </div>
  );
}
