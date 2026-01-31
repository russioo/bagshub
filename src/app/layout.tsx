import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'BagsHub',
  description: 'The premier token tracker for Bags on Solana',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          .nav-link {
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.2s ease;
          }
          .nav-link:hover {
            color: var(--text);
            background: var(--bg-hover);
          }
        `}</style>
      </head>
      <body>
        {/* Navigation */}
        <nav className="glass" style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 40px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00dc82 0%, #00b368 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                color: '#000',
              }}>
                B
              </div>
              <span style={{ fontWeight: 600, fontSize: '18px', letterSpacing: '-0.3px' }}>
                BagsHub
              </span>
            </Link>
            
            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link href="/" className="nav-link">Tokens</Link>
              <Link href="/new" className="nav-link">New Pairs</Link>
              <Link href="/gainers" className="nav-link">Top Gainers</Link>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <svg 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search tokens..."
                style={{
                  width: '280px',
                  paddingLeft: '42px',
                  height: '42px',
                }}
              />
            </div>
            <Link href="/launch" className="btn btn-primary">
              Launch Token
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ 
          minHeight: 'calc(100vh - 64px)',
          padding: '40px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          padding: '40px',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Built for the Bags ecosystem on Solana
          </p>
        </footer>
      </body>
    </html>
  );
}
