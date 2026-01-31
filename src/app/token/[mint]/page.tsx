import Link from 'next/link';
import { getToken, type BagsToken } from '@/lib/bags-api';

function formatPrice(n: number): string {
  if (!n) return '$0.00';
  if (n < 0.00001) return '$' + n.toExponential(2);
  if (n < 0.01) return '$' + n.toFixed(6);
  if (n < 1) return '$' + n.toFixed(4);
  return '$' + n.toFixed(2);
}

function formatNum(n: number): string {
  if (!n) return '$0';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(0);
}

export default async function TokenPage({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const token = await getToken(mint);

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Token not found</p>
        <Link href="/" style={{ color: 'var(--green)' }}>Back to tokens</Link>
      </div>
    );
  }

  return (
    <div>
      <Link 
        href="/" 
        style={{ 
          color: 'var(--text-muted)', 
          fontSize: '14px',
          display: 'inline-block',
          marginBottom: '32px',
        }}
      >
        Back
      </Link>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '48px' }}>
        {token.image && (
          <img 
            src={token.image} 
            alt="" 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%',
              background: '#111',
            }} 
          />
        )}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-1px', marginBottom: '4px' }}>
            {token.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{token.symbol}</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1px',
        background: 'var(--border)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '32px',
      }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</div>
          <div style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: 500 }}>{formatPrice(token.price)}</div>
          <div style={{ 
            fontSize: '14px', 
            marginTop: '4px',
            color: token.priceChange24h >= 0 ? 'var(--green)' : 'var(--red)',
          }}>
            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h?.toFixed(2) || '0'}%
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Market Cap</div>
          <div style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: 500 }}>{formatNum(token.marketCap)}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Volume 24h</div>
          <div style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: 500 }}>{formatNum(token.volume24h)}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Holders</div>
          <div style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: 500 }}>{token.holders?.toLocaleString() || '—'}</div>
        </div>
      </div>

      {token.description && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About</div>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-muted)' }}>{token.description}</p>
        </div>
      )}

      <div style={{ 
        padding: '20px 24px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contract</div>
        <code style={{ fontSize: '13px', wordBreak: 'break-all' }}>{token.mint}</code>
      </div>
    </div>
  );
}
