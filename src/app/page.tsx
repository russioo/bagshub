import Link from 'next/link';

// Mock data - replace with Bags API
const tokens = [
  { mint: '1', name: 'Bags Token', symbol: 'BAGS', price: 0.0234, change: 12.5, volume: 1250000, mcap: 23400000, holders: 45000, image: '🎒' },
  { mint: '2', name: 'Solana Pepe', symbol: 'PEPE', price: 0.00000234, change: 45.67, volume: 5600000, mcap: 9840000, holders: 89000, image: '🐸' },
  { mint: '3', name: 'Moon Shot', symbol: 'MOON', price: 0.000001, change: -8.2, volume: 890000, mcap: 1200000, holders: 12000, image: '🌙' },
  { mint: '4', name: 'Diamond Hands', symbol: 'DIAMOND', price: 0.0089, change: 23.4, volume: 3400000, mcap: 8900000, holders: 34000, image: '💎' },
  { mint: '5', name: 'Rocket Fuel', symbol: 'FUEL', price: 0.00002, change: 156.8, volume: 7800000, mcap: 2000000, holders: 8900, image: '🚀' },
  { mint: '6', name: 'Cat Coin', symbol: 'CAT', price: 0.00456, change: -3.2, volume: 1200000, mcap: 4560000, holders: 15600, image: '🐱' },
  { mint: '7', name: 'Based Token', symbol: 'BASED', price: 0.000005, change: 234.5, volume: 2500000, mcap: 2100000, holders: 4500, image: '🔥' },
  { mint: '8', name: 'AI Bot', symbol: 'AIBOT', price: 0.0567, change: 8.9, volume: 2300000, mcap: 5670000, holders: 12000, image: '🤖' },
];

function formatNumber(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(2) + 'K';
  return '$' + n.toFixed(2);
}

function formatPrice(n: number): string {
  if (n < 0.0001) return '$' + n.toExponential(2);
  if (n < 0.01) return '$' + n.toFixed(6);
  if (n < 1) return '$' + n.toFixed(4);
  return '$' + n.toFixed(2);
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="fade-in" style={{
        textAlign: 'center',
        padding: '80px 0',
        marginBottom: '60px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'var(--accent-glow)',
          borderRadius: '100px',
          marginBottom: '24px',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--accent)',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
          Live on Solana
        </div>
        
        <h1 style={{
          fontSize: '56px',
          fontWeight: 700,
          letterSpacing: '-2px',
          lineHeight: 1.1,
          marginBottom: '20px',
          background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Track every token<br />on Bags
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Real-time prices, volume, and analytics for all tokens launched through the Bags protocol.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link href="/launch" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
            Launch a Token
          </Link>
          <a href="#tokens" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '15px' }}>
            Explore Tokens
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="fade-in stagger-1" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '60px',
      }}>
        {[
          { label: 'Total Tokens', value: '2,847' },
          { label: 'Total Volume', value: '$127M' },
          { label: 'Active Traders', value: '45.2K' },
          { label: '24h Transactions', value: '892K' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Token Table */}
      <section id="tokens" className="fade-in stagger-2">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>All Tokens</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Sorted by 24h volume</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'New', 'Gainers', 'Trending'].map((filter, i) => (
              <button 
                key={filter}
                className={i === 0 ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Token</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'right' }}>24h</th>
                <th style={{ textAlign: 'right' }}>Volume</th>
                <th style={{ textAlign: 'right' }}>Market Cap</th>
                <th style={{ textAlign: 'right' }}>Holders</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, i) => (
                <tr key={token.mint}>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{i + 1}</td>
                  <td>
                    <Link href={`/token/${token.mint}`} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '14px',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'var(--bg-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}>
                        {token.image}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '2px' }}>{token.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{token.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 500 }}>
                    {formatPrice(token.price)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={token.change >= 0 ? 'badge badge-green' : 'badge badge-red'}>
                      {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                    {formatNumber(token.volume)}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                    {formatNumber(token.mcap)}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {token.holders.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
