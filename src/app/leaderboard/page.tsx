'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TokenTable } from '@/components/token-table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  Users,
  Medal
} from 'lucide-react';
import type { BagsToken } from '@/types';

// Mock data - replace with API calls
const mockTokens: BagsToken[] = [
  {
    mint: '1',
    name: 'Rocket Fuel',
    symbol: 'FUEL',
    price: 0.00002,
    priceChange24h: 234.5,
    volume24h: 7800000,
    marketCap: 2000000,
    liquidity: 200000,
    holders: 8900,
    supply: 100000000000,
    createdAt: '2024-02-15',
  },
  {
    mint: '2',
    name: 'Based Token',
    symbol: 'BASED',
    price: 0.000005,
    priceChange24h: 156.8,
    volume24h: 2500000,
    marketCap: 2100000,
    liquidity: 150000,
    holders: 4500,
    supply: 420000000000,
    createdAt: '2024-02-18',
  },
  {
    mint: '3',
    name: 'Solana Pepe',
    symbol: 'SPEPE',
    price: 0.00000234,
    priceChange24h: 89.2,
    volume24h: 5600000,
    marketCap: 9840000,
    liquidity: 450000,
    holders: 89000,
    supply: 1000000000000,
    createdAt: '2024-02-01',
  },
  {
    mint: '4',
    name: 'Moon Shot',
    symbol: 'MOON',
    price: 0.000001,
    priceChange24h: 67.4,
    volume24h: 1890000,
    marketCap: 1200000,
    liquidity: 120000,
    holders: 12000,
    supply: 1000000000000,
    createdAt: '2024-02-10',
  },
  {
    mint: '5',
    name: 'Diamond Hands',
    symbol: 'DIAMOND',
    price: 0.0089,
    priceChange24h: 45.2,
    volume24h: 3400000,
    marketCap: 8900000,
    liquidity: 340000,
    holders: 34000,
    supply: 1000000000,
    createdAt: '2024-01-20',
  },
];

const losers: BagsToken[] = mockTokens.map(t => ({
  ...t,
  priceChange24h: -Math.abs(t.priceChange24h) * 0.3,
}));

const categories = [
  { id: 'gainers', label: 'Top Gainers', icon: TrendingUp, color: 'text-bags-green' },
  { id: 'losers', label: 'Top Losers', icon: TrendingDown, color: 'text-bags-red' },
  { id: 'volume', label: 'Most Volume', icon: BarChart3, color: 'text-blue-500' },
  { id: 'newest', label: 'Newest', icon: Clock, color: 'text-purple-500' },
  { id: 'holders', label: 'Most Holders', icon: Users, color: 'text-orange-500' },
];

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('gainers');

  const getTokensForCategory = (category: string): BagsToken[] => {
    switch (category) {
      case 'losers':
        return losers;
      case 'volume':
        return [...mockTokens].sort((a, b) => b.volume24h - a.volume24h);
      case 'newest':
        return [...mockTokens].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'holders':
        return [...mockTokens].sort((a, b) => b.holders - a.holders);
      default:
        return mockTokens;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          Top performing tokens across different metrics
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <Button
              key={cat.id}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat.id)}
              className={`gap-2 ${isActive ? '' : 'hover:bg-secondary'}`}
            >
              <Icon className={`h-4 w-4 ${isActive ? '' : cat.color}`} />
              {cat.label}
            </Button>
          );
        })}
      </div>

      {/* Podium for top 3 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Medal className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Top 3</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {getTokensForCategory(activeCategory).slice(0, 3).map((token, i) => {
            const colors = [
              'from-yellow-500/20 border-yellow-500/30',
              'from-gray-400/20 border-gray-400/30',
              'from-orange-600/20 border-orange-600/30',
            ];
            const badges = ['🥇', '🥈', '🥉'];
            
            return (
              <Card 
                key={token.mint} 
                className={`bg-gradient-to-b ${colors[i]} border-2`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{badges[i]}</span>
                    <Badge variant={token.priceChange24h >= 0 ? 'success' : 'danger'}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{token.name}</h3>
                    <p className="text-muted-foreground text-sm">{token.symbol}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Volume</span>
                      <span className="font-mono">${(token.volume24h / 1e6).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Holders</span>
                      <span>{token.holders.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Full Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Full Rankings</h2>
        <TokenTable tokens={getTokensForCategory(activeCategory)} />
      </section>
    </div>
  );
}
