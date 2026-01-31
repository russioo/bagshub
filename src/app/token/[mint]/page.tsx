import Link from 'next/link';

// Mock data
function getToken(mint: string) {
  return {
    mint,
    name: 'Bags Token',
    symbol: 'BAGS',
    image: '🎒',
    price: 0.0234,
    change24h: 12.5,
    change7d: 45.2,
    volume24h: 1250000,
    marketCap: 23400000,
    liquidity: 890000,
    holders: 45000,
    supply: 1000000000,
    description: 'The native token of the Bags ecosystem on Solana.',
    created: '2024-01-15',
  };
}

function formatNumber(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(2) + 'K';
  return '$' + n.toFixed(2);
}

export default async function TokenPage({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const token = getToken(mint);

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back */}
      <Link href="/" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '32px',
        transition: 'color 0.2s',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to tokens
      </Link>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
          }}>
            {token.image}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 600 }}>{token.name}</h1>
              <span style={{ 
                padding: '4px 10px', 
                background: 'var(--bg-elevated)', 
                borderRadius: '6px',
                fontSize: '14px',
                color: 'var(--text-secondary)',
              }}>
                {token.symbol}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {token.description}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16,6 12,2 8,6"/>
              <line x1="12" x2="12" y1="2" y2="15"/>
            </svg>
            Share
          </button>
          <button className="btn btn-primary">
            Trade
          </button>
        </div>
      </div>

      {/* Price Section */}
      <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
        <div style={{ marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Current Price
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <span style={{ fontSize: '48px', fontWeight: 600, fontFamily: 'monospace' }}>
            ${token.price.toFixed(4)}
          </span>
          <span className={token.change24h >= 0 ? 'badge badge-green' : 'badge badge-red'} style={{ fontSize: '14px', padding: '6px 12px' }}>
            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px',
        marginBottom: '24px',
      }}>
        {[
          { label: 'Market Cap', value: formatNumber(token.marketCap) },
          { label: '24h Volume', value: formatNumber(token.volume24h) },
          { label: 'Liquidity', value: formatNumber(token.liquidity) },
          { label: 'Holders', value: token.holders.toLocaleString() },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="card" style={{ 
        marginBottom: '24px', 
        padding: '0',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📈</div>
          <div style={{ fontSize: '14px' }}>Price chart coming soon</div>
        </div>
      </div>

      {/* Contract Info */}
      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
        }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px' }}>
              Contract Address
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
              {token.mint}...
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
