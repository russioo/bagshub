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
        <header style={{
          borderBottom: '1px solid var(--border)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Link href="/" style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.5px' }}>
              BagsHub
            </Link>
            <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <Link href="/" style={{ transition: 'color 0.15s' }}>Tokens</Link>
              <Link href="/trending" style={{ transition: 'color 0.15s' }}>Trending</Link>
              <Link href="/new" style={{ transition: 'color 0.15s' }}>New</Link>
              <Link href="/gainers" style={{ transition: 'color 0.15s' }}>Gainers</Link>
            </nav>
          </div>
          <Link 
            href="/launch" 
            style={{
              fontSize: '14px',
              fontWeight: 500,
              padding: '8px 16px',
              background: 'var(--green)',
              color: '#000',
              borderRadius: '6px',
            }}
          >
            Launch Token
          </Link>
        </header>
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
