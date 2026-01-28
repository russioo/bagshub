'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Users, BarChart3, Bookmark, BookmarkCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, formatNumber, formatPercent, truncateAddress } from '@/lib/utils';
import type { BagsToken } from '@/types';

interface TokenCardProps {
  token: BagsToken;
  rank?: number;
  isBookmarked?: boolean;
  onBookmark?: (mint: string) => void;
  variant?: 'default' | 'compact' | 'row';
}

export function TokenCard({
  token,
  rank,
  isBookmarked,
  onBookmark,
  variant = 'default',
}: TokenCardProps) {
  const priceChange = token.priceChange24h ?? 0;
  const isPositive = priceChange >= 0;

  if (variant === 'row') {
    return (
      <Link
        href={`/token/${token.mint}`}
        className="leaderboard-row group"
      >
        {rank && (
          <span className="w-8 text-center font-bold text-gray-500">
            #{rank}
          </span>
        )}
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
            {token.imageUrl ? (
              <Image
                src={token.imageUrl}
                alt={token.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600">
                {token.symbol[0]}
              </div>
            )}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{token.name}</span>
              <span className="text-gray-500 text-sm">${token.symbol}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">
              {truncateAddress(token.mint)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-medium">{formatCurrency(token.price ?? 0)}</p>
          <p className={cn('text-sm', isPositive ? 'text-gain' : 'text-loss')}>
            {formatPercent(priceChange)}
          </p>
        </div>

        <div className="hidden md:block text-right w-24">
          <p className="text-sm text-gray-400">Vol 24h</p>
          <p className="font-medium">{formatCurrency(token.volume24h ?? 0, { compact: true })}</p>
        </div>

        <div className="hidden lg:block text-right w-24">
          <p className="text-sm text-gray-400">MCap</p>
          <p className="font-medium">{formatCurrency(token.marketCap ?? 0, { compact: true })}</p>
        </div>

        {onBookmark && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onBookmark(token.mint);
            }}
            className="p-2 rounded-lg hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isBookmarked ? (
              <BookmarkCheck size={18} className="text-brand-400" />
            ) : (
              <Bookmark size={18} className="text-gray-400" />
            )}
          </button>
        )}
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/token/${token.mint}`} className="token-card block">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
            {token.imageUrl ? (
              <Image src={token.imageUrl} alt={token.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-600">
                {token.symbol[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{token.symbol}</p>
            <p className={cn('text-sm', isPositive ? 'text-gain' : 'text-loss')}>
              {formatPercent(priceChange)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatCurrency(token.price ?? 0)}</p>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/token/${token.mint}`} className="token-card block group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800">
            {token.imageUrl ? (
              <Image src={token.imageUrl} alt={token.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-600">
                {token.symbol[0]}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold group-hover:text-brand-400 transition-colors">
              {token.name}
            </h3>
            <p className="text-sm text-gray-500">${token.symbol}</p>
          </div>
        </div>
        
        {onBookmark && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onBookmark(token.mint);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-800"
          >
            {isBookmarked ? (
              <BookmarkCheck size={18} className="text-brand-400" />
            ) : (
              <Bookmark size={18} className="text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold">{formatCurrency(token.price ?? 0)}</p>
        <div className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium',
          isPositive ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'
        )}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(priceChange)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <BarChart3 size={14} />
          <span>Vol: {formatCurrency(token.volume24h ?? 0, { compact: true })}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={14} />
          <span>{formatNumber(token.holderCount ?? 0)} holders</span>
        </div>
      </div>

      {/* Tags */}
      {token.tags && token.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {token.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant={tag as any}>
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
