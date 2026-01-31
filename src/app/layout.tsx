import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'BagsHub',
  description: 'Token tracker for Bags on Solana',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header style={{
          borderBottom: '1px solid var(--border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'var(--bg)',
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/" style={{ fontWeight: 700, fontSize: '18px', color: 'var(--green)' }}>
              BagsHub
            </Link>
            <nav style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
              <Link href="/" style={{ color: 'var(--text-secondary)' }}>Tokens</Link>
              <Link href="/new" style={{ color: 'var(--text-secondary)' }}>New</Link>
              <Link href="/gainers" style={{ color: 'var(--text-secondary)' }}>Gainers</Link>
              <Link href="/launch" style={{ color: 'var(--text-secondary)' }}>Launch</Link>
            </nav>
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Search tokens..."
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '8px 16px',
                borderRadius: '6px',
                color: 'var(--text)',
                width: '240px',
                fontSize: '14px',
              }}
            />
          </div>
        </header>

        {/* Main */}
        <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
