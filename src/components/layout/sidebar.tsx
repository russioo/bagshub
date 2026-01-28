'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  TrendingUp,
  Rocket,
  BarChart3,
  Trophy,
  Search,
  Sparkles,
  Bookmark,
  Settings,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/trending', label: 'Trending', icon: TrendingUp },
  { href: '/new', label: 'New Launches', icon: Zap },
  { href: '/leaderboards', label: 'Leaderboards', icon: Trophy },
  { href: '/search', label: 'Discover', icon: Search },
];

const toolsNavItems = [
  { href: '/launch', label: 'Launch Token', icon: Rocket },
  { href: '/research', label: 'AI Research', icon: Sparkles },
  { href: '/charts', label: 'Charts', icon: BarChart3 },
];

const userNavItems = [
  { href: '/bookmarks', label: 'Watchlist', icon: Bookmark },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden lg:flex h-screen w-64 flex-col border-r border-bags-border bg-bags-dark">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-bags-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-bags-green flex items-center justify-center">
            <span className="font-bold text-bags-dark">B</span>
          </div>
          <span className="font-bold text-xl text-bags-green">BagsHub</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        {/* Main Nav */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Explore
          </p>
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools Nav */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tools
          </p>
          <ul className="space-y-1">
            {toolsNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                  {item.href === '/launch' && (
                    <span className="ml-auto text-xs bg-brand-500 text-white px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User Nav */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </p>
          <ul className="space-y-1">
            {userNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-bags-border">
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-900/50 to-bags-card border border-brand-800/50">
          <p className="text-sm font-medium text-bags-green mb-1">Launch Your Token</p>
          <p className="text-xs text-gray-400 mb-3">Create and deploy tokens on Solana via Bags</p>
          <Link
            href="/launch"
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-bags-green hover:bg-brand-400 text-bags-dark text-sm font-medium rounded-lg transition-colors"
          >
            <Rocket size={16} />
            Get Started
          </Link>
        </div>
      </div>
    </aside>
  );
}
