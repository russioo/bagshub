'use client';

import { useState } from 'react';
import { TrendingUp, Filter, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TokenCard } from '@/components/tokens/token-card';
import { TokenGrid } from '@/components/tokens/token-grid';
import { mockTrendingTokens } from '@/data/mock-tokens';
import { cn } from '@/lib/utils';
import type { TimeFrame } from '@/types';

const timeFrames: { value: TimeFrame; label: string }[] = [
  { value: '1h', label: '1H' },
  { value: '6h', label: '6H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
];

export default function TrendingPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('24h');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading] = useState(false);

  // TODO: Replace with real API call
  const tokens = mockTrendingTokens;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-500/10">
            <TrendingUp size={24} className="text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Trending Tokens</h1>
            <p className="text-sm text-gray-500">Top performing tokens on Bags</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time frame selector */}
          <div className="flex bg-gray-900 rounded-lg p-1">
            {timeFrames.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeFrame(tf.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  timeFrame === tf.value
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'
              )}
            >
              <List size={18} />
            </button>
          </div>

          <Button variant="secondary" size="sm">
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      {viewMode === 'grid' ? (
        <TokenGrid tokens={tokens} isLoading={isLoading} />
      ) : (
        <Card>
          <CardContent className="p-4 space-y-2">
            {tokens.map((token, i) => (
              <TokenCard key={token.mint} token={token} rank={i + 1} variant="row" />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
