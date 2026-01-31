import Link from 'next/link';

// Fetch tokens from Bags
async function getTokens() {
  try {
    // Try to fetch from Bags API or scrape their data
    const res = await fetch('https://api.bags.fm/tokens?limit=50', {
      next: { revalidate: 30 },
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      return data.tokens || data;
    }
  } catch (e) {
    console.log('Bags API not available, using fallback');
  }
  
  // Fallback mock data
  return [
    { mint: '1', name: 'Sample Token', symbol: 'SAMPLE', price: 0.001, change24h: 5.2, volume24h: 50000, marketCap: 100000, holders: 500 },
  ];
}

function formatNumber(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}

function formatPrice(n: number): string {
  if (n < 0.0001) return n.toExponential(2);
  if (n < 1) return n.toFixed(6);
  return n.toFixed(2);
}

export default async function Home() {
  const tokens = await getTokens();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
          Bags Tokens
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Track all tokens launched on Bags
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Token</th>
            <th style={{ textAlign: 'right' }}>Price</th>
            <th style={{ textAlign: 'right' }}>24h %</th>
            <th style={{ textAlign: 'right' }}>Volume</th>
            <th style={{ textAlign: 'right' }}>Market Cap</th>
            <th style={{ textAlign: 'right' }}>Holders</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token: any, i: number) => (
            <tr key={token.mint}>
              <td style={{ color: 'var(--text-secondary)' }}>{i + 1}</td>
              <td>
                <Link href={`/token/${token.mint}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    {token.symbol?.[0] || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{token.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{token.symbol}</div>
                  </div>
                </Link>
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                ${formatPrice(token.price || 0)}
              </td>
              <td style={{ textAlign: 'right' }}>
                <span className={(token.change24h || 0) >= 0 ? 'green' : 'red'}>
                  {(token.change24h || 0) >= 0 ? '+' : ''}{(token.change24h || 0).toFixed(2)}%
                </span>
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                ${formatNumber(token.volume24h || 0)}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                ${formatNumber(token.marketCap || 0)}
              </td>
              <td style={{ textAlign: 'right' }}>
                {token.holders?.toLocaleString() || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tokens.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
          No tokens found
        </div>
      )}
    </div>
  );
}
