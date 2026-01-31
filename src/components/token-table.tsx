'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatNumber, formatPercent, timeAgo } from '@/lib/utils';
import type { BagsToken } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TokenTableProps {
  tokens: BagsToken[];
  showRank?: boolean;
}

export function TokenTable({ tokens, showRank = true }: TokenTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {showRank && (
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">
                #
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Token
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
              Volume
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
              Market Cap
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
              Holders
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tokens.map((token, index) => {
            const isPositive = token.priceChange24h >= 0;
            return (
              <tr 
                key={token.mint}
                className="hover:bg-muted/50 transition-colors"
              >
                {showRank && (
                  <td className="px-4 py-4 text-sm text-muted-foreground font-medium">
                    {index + 1}
                  </td>
                )}
                <td className="px-4 py-4">
                  <Link 
                    href={`/tokens/${token.mint}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {token.image ? (
                        <Image
                          src={token.image}
                          alt={token.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-muted-foreground">{token.symbol}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-right font-mono font-medium">
                  {formatPrice(token.price)}
                </td>
                <td className="px-4 py-4 text-right">
                  <Badge variant={isPositive ? 'success' : 'danger'}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercent(token.priceChange24h)}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-right font-mono text-muted-foreground hidden md:table-cell">
                  {formatNumber(token.volume24h)}
                </td>
                <td className="px-4 py-4 text-right font-mono text-muted-foreground hidden lg:table-cell">
                  {formatNumber(token.marketCap)}
                </td>
                <td className="px-4 py-4 text-right text-muted-foreground hidden lg:table-cell">
                  {token.holders.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Loading skeleton
export function TokenTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 w-12"><div className="h-4 w-4 bg-muted rounded animate-pulse" /></th>
            <th className="px-4 py-3"><div className="h-4 w-16 bg-muted rounded animate-pulse" /></th>
            <th className="px-4 py-3"><div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" /></th>
            <th className="px-4 py-3"><div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" /></th>
            <th className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" /></th>
            <th className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-20 bg-muted rounded animate-pulse ml-auto" /></th>
            <th className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-4"><div className="h-4 w-6 bg-muted rounded animate-pulse" /></td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                  <div>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-12 bg-muted rounded animate-pulse mt-1" />
                  </div>
                </div>
              </td>
              <td className="px-4 py-4"><div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" /></td>
              <td className="px-4 py-4"><div className="h-5 w-16 bg-muted rounded animate-pulse ml-auto" /></td>
              <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" /></td>
              <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 w-20 bg-muted rounded animate-pulse ml-auto" /></td>
              <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
