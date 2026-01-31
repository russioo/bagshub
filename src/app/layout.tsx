import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BagsHub - The Ultimate Token Tracker for Bags on Solana',
  description: 'Track, launch, and research tokens on the Bags protocol. Real-time prices, charts, and community chat.',
  keywords: ['Solana', 'Bags', 'crypto', 'tokens', 'DeFi', 'trading'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
