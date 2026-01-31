import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenTable } from '@/components/token-table';
import { TokenCard } from '@/components/token-card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, Zap, Crown } from 'lucide-react';
import type { BagsToken } from '@/types';

// Mock data - replace with API calls
const trendingTokens: BagsToken[] = [
  {
    mint: '1',
    name: 'Rocket Fuel',
    symbol: 'FUEL',
    price: 0.00002,
    priceChange24h: 156.8,
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
    priceChange24h: 234.5,
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
    priceChange24h: 45.67,
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
    priceChange24h: 89.2,
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
    priceChange24h: 23.4,
    volume24h: 3400000,
    marketCap: 8900000,
    liquidity: 340000,
    holders: 34000,
    supply: 1000000000,
    createdAt: '2024-01-20',
  },
];

export default function TrendingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <h1 className="text-3xl font-bold">Trending Tokens</h1>
        </div>
        <p className="text-muted-foreground">
          The hottest tokens on Bags right now, ranked by trading activity and momentum
        </p>
      </div>

      {/* Top 3 Featured */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Top Performers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {trendingTokens.slice(0, 3).map((token, i) => (
            <Card key={token.mint} className="relative overflow-hidden">
              {/* Rank badge */}
              <div className="absolute top-4 right-4">
                <Badge variant={i === 0 ? 'default' : 'outline'} className={i === 0 ? 'bg-yellow-500 text-black' : ''}>
                  #{i + 1}
                </Badge>
              </div>
              <CardContent className="pt-6">
                <TokenCard token={token} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Avg. Gain</span>
            </div>
            <div className="text-2xl font-bold text-bags-green">+89.5%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Total Volume</span>
            </div>
            <div className="text-2xl font-bold">$21.2M</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Flame className="h-4 w-4" />
              <span className="text-sm">Hot Tokens</span>
            </div>
            <div className="text-2xl font-bold">{trendingTokens.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Crown className="h-4 w-4" />
              <span className="text-sm">Top Gainer</span>
            </div>
            <div className="text-2xl font-bold text-bags-green">+234%</div>
          </CardContent>
        </Card>
      </section>

      {/* Full Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Trending</h2>
        <TokenTable tokens={trendingTokens} />
      </section>
    </div>
  );
}
