'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn, truncateAddress } from '@/lib/utils';
import { mockTrendingTokens } from '@/data/mock-tokens';
import type { BagsToken } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BagsToken[]>([]);
  const [recentSearches] = useState<string[]>(['BAGS', 'WIF', 'PEPE']);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search logic (mock for now)
  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockTrendingTokens.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.symbol.toLowerCase().includes(query.toLowerCase()) ||
          t.mint.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = useCallback(
    (mint: string) => {
      router.push(`/token/${mint}`);
      onClose();
      setQuery('');
    },
    [router, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-2xl mx-auto mt-20 mx-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-800">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search tokens by name, symbol, or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-500"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {query.length === 0 ? (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Recent Searches
                    </p>
                    <div className="space-y-1">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => setQuery(search)}
                          className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 text-left"
                        >
                          <Clock size={16} className="text-gray-500" />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div className="p-4 border-t border-gray-800">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Trending Now
                  </p>
                  <div className="space-y-1">
                    {mockTrendingTokens.slice(0, 5).map((token) => (
                      <button
                        key={token.mint}
                        onClick={() => handleSelect(token.mint)}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 text-left group"
                      >
                        <TrendingUp size={16} className="text-gain" />
                        <span className="font-medium">{token.name}</span>
                        <span className="text-gray-500">${token.symbol}</span>
                        <ArrowRight
                          size={16}
                          className="ml-auto text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((token) => (
                  <button
                    key={token.mint}
                    onClick={() => handleSelect(token.mint)}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold">
                      {token.symbol[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.name}</span>
                        <span className="text-gray-500">${token.symbol}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {truncateAddress(token.mint, 8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${token.price?.toFixed(6)}</p>
                      <p
                        className={cn(
                          'text-sm',
                          (token.priceChange24h ?? 0) >= 0
                            ? 'text-gain'
                            : 'text-loss'
                        )}
                      >
                        {(token.priceChange24h ?? 0) >= 0 ? '+' : ''}
                        {token.priceChange24h?.toFixed(2)}%
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No tokens found for "{query}"</p>
                <p className="text-sm text-gray-600 mt-1">
                  Try searching by name, symbol, or mint address
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-800 bg-gray-900/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↵</kbd> to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd> to navigate
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">esc</kbd> to close
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
