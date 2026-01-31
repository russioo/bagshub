import Link from 'next/link';

async function getToken(mint: string) {
  try {
    const res = await fetch(`https://api.bags.fm/tokens/${mint}`, {
      next: { revalidate: 30 }
    });
    if (res.ok) return res.json();
  } catch (e) {}
  
  return {
    mint,
    name: 'Token',
    symbol: 'TKN',
    price: 0.001,
    change24h: 0,
    volume24h: 0,
    marketCap: 0,
    holders: 0,
  };
}

export default async function TokenPage({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const token = await getToken(mint);

  return (
    <div>
      <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', display: 'block' }}>
        ← Back
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 600,
        }}>
          {token.symbol?.[0] || '?'}
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600 }}>{token.name}</h1>
          <div style={{ color: 'var(--text-secondary)' }}>{token.symbol}</div>
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'monospace' }}>
          ${token.price?.toFixed(8) || '0.00'}
        </div>
        <span className={(token.change24h || 0) >= 0 ? 'green' : 'red'} style={{ fontSize: '18px' }}>
          {(token.change24h || 0) >= 0 ? '+' : ''}{(token.change24h || 0).toFixed(2)}%
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Market Cap', value: `$${(token.marketCap || 0).toLocaleString()}` },
          { label: 'Volume 24h', value: `$${(token.volume24h || 0).toLocaleString()}` },
          { label: 'Holders', value: (token.holders || 0).toLocaleString() },
          { label: 'Liquidity', value: `$${(token.liquidity || 0).toLocaleString()}` },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Contract */}
      <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>Contract</div>
        <div style={{ fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all' }}>{mint}</div>
      </div>
    </div>
  );
}
