'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { formatPrice, formatPercent, debounce } from '@/lib/utils';
import type { BagsToken } from '@/types';
import { Search, X, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BagsToken[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  const searchTokens = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/bags/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.tokens || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchTokens(query);
  }, [query, searchTokens]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!open) {
          // This would need to call a parent function to open
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleSelect = (mint: string) => {
    router.push(`/tokens/${mint}`);
    onClose();
    setQuery('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-lg z-50 animate-fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tokens..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map((token) => {
                    const isPositive = token.priceChange24h >= 0;
                    return (
                      <button
                        key={token.mint}
                        onClick={() => handleSelect(token.mint)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          {token.image ? (
                            <Image
                              src={token.image}
                              alt={token.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                              {token.symbol.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{token.name}</div>
                          <div className="text-sm text-muted-foreground">{token.symbol}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">{formatPrice(token.price)}</div>
                          <div className={`text-xs flex items-center justify-end gap-1 ${isPositive ? 'text-bags-green' : 'text-bags-red'}`}>
                            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {formatPercent(token.priceChange24h)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : query && !loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  No tokens found for "{query}"
                </div>
              ) : !query ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Start typing to search tokens</p>
                  <p className="text-xs mt-2">Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘K</kbd> to open search</p>
                </div>
              ) : null}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
