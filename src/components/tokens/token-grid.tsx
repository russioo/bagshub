'use client';

import { TokenCard } from './token-card';
import type { BagsToken } from '@/types';

interface TokenGridProps {
  tokens: BagsToken[];
  bookmarkedMints?: Set<string>;
  onBookmark?: (mint: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function TokenGrid({
  tokens,
  bookmarkedMints,
  onBookmark,
  isLoading,
  emptyMessage = 'No tokens found',
}: TokenGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TokenCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tokens.map((token) => (
        <TokenCard
          key={token.mint}
          token={token}
          isBookmarked={bookmarkedMints?.has(token.mint)}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
}

function TokenCardSkeleton() {
  return (
    <div className="token-card animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-800" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-800 rounded mb-2" />
          <div className="h-3 w-16 bg-gray-800 rounded" />
        </div>
      </div>
      <div className="h-8 w-32 bg-gray-800 rounded mb-2" />
      <div className="h-4 w-20 bg-gray-800 rounded mb-4" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-4 bg-gray-800 rounded" />
        <div className="h-4 bg-gray-800 rounded" />
      </div>
    </div>
  );
}
