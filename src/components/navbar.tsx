'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Rocket, 
  TrendingUp, 
  Trophy, 
  Bookmark, 
  Menu,
  X,
  LogIn
} from 'lucide-react';
import { useState } from 'react';
import { SearchModal } from './search-modal';

const navLinks = [
  { href: '/', label: 'Tokens', icon: TrendingUp },
  { href: '/tokens/trending', label: 'Trending', icon: TrendingUp },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/favorites', label: 'Favorites', icon: Bookmark },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-bags-green to-bags-green-dark flex items-center justify-center">
                <span className="text-black font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-bold">BagsHub</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Link href="/tokens/launch">
                <Button className="hidden sm:flex gap-2">
                  <Rocket className="h-4 w-4" />
                  Launch
                </Button>
              </Link>

              <Link href="/login">
                <Button variant="outline" className="hidden sm:flex gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                <Link href="/tokens/launch" className="flex-1">
                  <Button className="w-full gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Token
                  </Button>
                </Link>
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
