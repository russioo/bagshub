'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, X, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { SearchModal } from '@/components/search/search-modal';
import { AuthModal } from '@/components/auth/auth-modal';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-bags-border bg-bags-dark/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo for mobile */}
          <Link href="/" className="lg:hidden font-bold text-xl text-bags-green">
            BagsHub
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-700 transition-colors"
            >
              <Search size={18} />
              <span>Search tokens...</span>
              <kbd className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded">⌘K</kbd>
            </button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Mobile search button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-800"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-bags-card relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-bags-green rounded-full" />
            </button>

            {/* Auth/User */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/bookmarks">
                  <Button variant="ghost" size="sm">
                    Watchlist
                  </Button>
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-bags-card">
                    <div className="w-8 h-8 rounded-full bg-bags-green flex items-center justify-center text-sm font-bold text-bags-dark">
                      {user.username[0].toUpperCase()}
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="font-medium">{user.displayName || user.username}</p>
                      <p className="text-sm text-gray-400">@{user.username}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-800">
                      Profile
                    </Link>
                    <Link href="/bookmarks" className="block px-4 py-2 hover:bg-gray-800">
                      Bookmarks
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-800 text-loss"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAuthOpen(true)}>
                  Login
                </Button>
                <Button size="sm" onClick={() => setIsAuthOpen(true)}>
                  <Wallet size={16} className="mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
