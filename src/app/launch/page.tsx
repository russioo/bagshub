'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LaunchPage() {
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    description: '',
    twitter: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement Bags API token creation
    await new Promise(r => setTimeout(r, 1000));
    alert('Token launch coming soon - requires Bags API key');
    
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '560px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--accent) 0%, #00b368 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '28px',
        }}>
          🚀
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '12px' }}>
          Launch Your Token
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Create and deploy a new token on Solana through Bags
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              Token Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="My Awesome Token"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              Symbol
            </label>
            <input
              type="text"
              value={form.symbol}
              onChange={e => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
              placeholder="TOKEN"
              required
              maxLength={10}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 500 
            }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Tell people about your token..."
              rows={4}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ 
            fontSize: '13px', 
            fontWeight: 500, 
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Social Links (Optional)
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={form.twitter}
              onChange={e => setForm({ ...form, twitter: e.target.value })}
              placeholder="Twitter handle"
              style={{ width: '100%' }}
            />
          </div>

          <input
            type="url"
            value={form.website}
            onChange={e => setForm({ ...form, website: e.target.value })}
            placeholder="Website URL"
            style={{ width: '100%' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !form.name || !form.symbol}
          className="btn btn-primary"
          style={{ 
            width: '100%', 
            padding: '16px',
            fontSize: '15px',
            opacity: loading || !form.name || !form.symbol ? 0.5 : 1,
            cursor: loading || !form.name || !form.symbol ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creating...' : 'Launch Token'}
        </button>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          fontSize: '13px', 
          color: 'var(--text-secondary)' 
        }}>
          By launching, you agree to the Bags terms of service
        </p>
      </form>
    </div>
  );
}
