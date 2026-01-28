import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BagsHub - The Ultimate Hub for Bags Tokens',
  description: 'Launch tokens, track trending coins, research with AI, and engage with the Bags community on Solana.',
  keywords: ['Solana', 'Bags', 'tokens', 'crypto', 'meme coins', 'dex'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-bags-dark text-gray-100 antialiased`}>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-1 flex-col lg:pl-64">
              <Navbar />
              <main className="flex-1 px-4 py-6 lg:px-8">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
