'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatNumber, formatPercent } from '@/lib/utils';
import type { BagsToken } from '@/types';
import { TrendingUp, TrendingDown, Users, BarChart3 } from 'lucide-react';

interface TokenCardProps {
  token: BagsToken;
  rank?: number;
}

export function TokenCard({ token, rank }: TokenCardProps) {
  const isPositive = token.priceChange24h >= 0;

  return (
    <Link href={`/tokens/${token.mint}`}>
      <Card className="p-4 hover:bg-secondary/50 transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
          {rank && (
            <div className="text-lg font-semibold text-muted-foreground w-8">
              #{rank}
            </div>
          )}
          
          {/* Token image */}
          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            {token.image ? (
              <Image
                src={token.image}
                alt={token.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                {token.symbol.charAt(0)}
              </div>
            )}
          </div>

          {/* Token info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {token.name}
              </h3>
              <span className="text-muted-foreground text-sm">{token.symbol}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {token.holders.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                {formatNumber(token.volume24h)}
              </span>
            </div>
          </div>

          {/* Price info */}
          <div className="text-right">
            <div className="font-mono font-semibold">
              {formatPrice(token.price)}
            </div>
            <Badge 
              variant={isPositive ? 'success' : 'danger'}
              className="mt-1"
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPercent(token.priceChange24h)}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Skeleton loader
export function TokenCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="text-right">
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>
    </Card>
  );
}
