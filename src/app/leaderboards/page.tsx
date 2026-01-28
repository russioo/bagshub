'use client';

import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, BarChart3, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TokenCard } from '@/components/tokens/token-card';
import { mockTrendingTokens, mockTopGainers, mockTopLosers, mockByVolume, mockNewTokens } from '@/data/mock-tokens';
import { cn } from '@/lib/utils';
import type { LeaderboardType, TimeFrame } from '@/types';

const leaderboardTypes: { value: LeaderboardType; label: string; icon: typeof Trophy }[] = [
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'top-gainers', label: 'Top Gainers', icon: TrendingUp },
  { value: 'top-losers', label: 'Top Losers', icon: TrendingDown },
  { value: 'most-volume', label: 'Volume', icon: BarChart3 },
  { value: 'most-holders', label: 'Holders', icon: Users },
  { value: 'newest', label: 'Newest', icon: Clock },
];

const timeFrames: { value: TimeFrame; label: string }[] = [
  { value: '1h', label: '1H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
];

export default function LeaderboardsPage() {
  const [activeType, setActiveType] = useState<LeaderboardType>('trending');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('24h');

  const getTokensForType = (type: LeaderboardType) => {
    switch (type) {
      case 'top-gainers':
        return mockTopGainers;
      case 'top-losers':
        return mockTopLosers;
      case 'most-volume':
        return mockByVolume;
      case 'newest':
        return mockNewTokens;
      case 'most-holders':
        return [...mockTrendingTokens].sort((a, b) => (b.holderCount ?? 0) - (a.holderCount ?? 0));
      default:
        return mockTrendingTokens;
    }
  };

  const tokens = getTokensForType(activeType);
  const activeTypeInfo = leaderboardTypes.find((t) => t.value === activeType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-yellow-500/10">
          <Trophy size={24} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Leaderboards</h1>
          <p className="text-sm text-gray-500">Top tokens by different metrics</p>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {leaderboardTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setActiveType(type.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeType === type.value
                ? 'bg-brand-500 text-white'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <type.icon size={16} />
            {type.label}
          </button>
        ))}
      </div>

      {/* Time Frame (for relevant types) */}
      {['top-gainers', 'top-losers', 'most-volume', 'trending'].includes(activeType) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Time frame:</span>
          <div className="flex bg-gray-900 rounded-lg p-1">
            {timeFrames.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeFrame(tf.value)}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                  timeFrame === tf.value
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-500 hover:text-white'
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {activeTypeInfo && <activeTypeInfo.icon size={20} />}
            {activeTypeInfo?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tokens.length > 0 ? (
            tokens.map((token, i) => (
              <TokenCard key={token.mint} token={token} rank={i + 1} variant="row" />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No tokens found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
