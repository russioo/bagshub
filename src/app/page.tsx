import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TokenTable } from '@/components/token-table';
import { TokenCard } from '@/components/token-card';
import { 
  TrendingUp, 
  TrendingDown, 
  Rocket, 
  BarChart3, 
  Users, 
  Zap,
  ArrowRight
} from 'lucide-react';
import type { BagsToken } from '@/types';

// Mock data for demo - replace with API calls
const mockTokens: BagsToken[] = [
  {
    mint: '1',
    name: 'Bags Token',
    symbol: 'BAGS',
    price: 0.0234,
    priceChange24h: 12.5,
    volume24h: 1250000,
    marketCap: 23400000,
    liquidity: 890000,
    holders: 45000,
    supply: 1000000000,
    createdAt: '2024-01-15',
    image: '/tokens/bags.png',
  },
  {
    mint: '2',
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
    mint: '3',
    name: 'Moon Shot',
    symbol: 'MOON',
    price: 0.000001,
    priceChange24h: -8.2,
    volume24h: 890000,
    marketCap: 1200000,
    liquidity: 120000,
    holders: 12000,
    supply: 1000000000000,
    createdAt: '2024-02-10',
  },
  {
    mint: '4',
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
  {
    mint: '5',
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
];

const stats = [
  { label: 'Total Tokens', value: '2,847', icon: Zap, change: '+124 today' },
  { label: 'Total Volume', value: '$127M', icon: BarChart3, change: '+18.5%' },
  { label: 'Active Traders', value: '45.2K', icon: Users, change: '+2.1K' },
  { label: 'New Launches', value: '89', icon: Rocket, change: 'last 24h' },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <Badge className="mb-4" variant="outline">
          <span className="w-2 h-2 rounded-full bg-bags-green mr-2 animate-pulse" />
          Live on Solana
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Track every token
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-bags-green to-bags-green-dark">
            on Bags
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Real-time prices, volume, and analytics for all tokens launched through the Bags protocol.
          Launch your own token in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/tokens/launch">
            <Button size="lg" className="gap-2">
              <Rocket className="h-5 w-5" />
              Launch Token
            </Button>
          </Link>
          <Link href="/tokens/trending">
            <Button size="lg" variant="outline" className="gap-2">
              <TrendingUp className="h-5 w-5" />
              View Trending
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-bags-green mt-1">{stat.change}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Trending Tokens</h2>
            <p className="text-muted-foreground">Top performing tokens in the last 24h</p>
          </div>
          <Link href="/tokens/trending">
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTokens.slice(0, 3).map((token, i) => (
            <TokenCard key={token.mint} token={token} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* All Tokens Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">All Tokens</h2>
            <p className="text-muted-foreground">Sorted by 24h volume</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">All</Button>
            <Button variant="ghost" size="sm">New</Button>
            <Button variant="ghost" size="sm">Gainers</Button>
            <Button variant="ghost" size="sm">Losers</Button>
          </div>
        </div>
        <TokenTable tokens={mockTokens} />
      </section>
    </div>
  );
}
