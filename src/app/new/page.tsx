import Link from 'next/link';
import { getTokens, type BagsToken } from '@/lib/bags-api';

function formatPrice(n: number): string {
  if (!n) return '$0.00';
  if (n < 0.00001) return '$' + n.toExponential(2);
  if (n < 0.01) return '$' + n.toFixed(6);
  return '$' + n.toFixed(4);
}

function timeAgo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = (now - then) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

export default async function NewPage() {
  const allTokens = await getTokens();
  const tokens = allTokens
    .filter((t: BagsToken) => t.createdAt)
    .sort((a: BagsToken, b: BagsToken) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50);

  return (
    <div>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 600, letterSpacing: '-2px', marginBottom: '12px' }}>
          New Tokens
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          Recently launched on Bags
        </p>
      </div>

      {tokens.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No new tokens</p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Token</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>24h</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token: BagsToken) => (
                <tr key={token.mint} style={{ borderBottom: '1px solid var(--border)' }}>
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
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)' }}>{timeAgo(token.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
