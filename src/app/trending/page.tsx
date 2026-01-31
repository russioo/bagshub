import Link from 'next/link';
import { getTrendingTokens, type BagsToken } from '@/lib/bags-api';

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

export default async function TrendingPage() {
  const tokens = await getTrendingTokens();

  return (
    <div>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 600, letterSpacing: '-2px', marginBottom: '12px' }}>
          Trending
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          Most active tokens right now
        </p>
      </div>

      {tokens.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No trending data available</p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>#</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Token</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>24h</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token: BagsToken, i: number) => (
                <tr key={token.mint} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{i + 1}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <Link href={`/token/${token.mint}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {token.image && <img src={token.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111' }} />}
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{token.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{token.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontSize: '14px' }}>{formatPrice(token.price)}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: token.priceChange24h >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h?.toFixed(2) || '0'}%
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontSize: '14px', color: 'var(--text-muted)' }}>{formatNum(token.volume24h)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
