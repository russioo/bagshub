import Link from 'next/link';
import { TrendingUp, Zap, Trophy, ArrowRight, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TokenCard } from '@/components/tokens/token-card';
import { formatCurrency } from '@/lib/utils';
import { getTopByVolume, getTopGainers, getLatestTokens, pairToBagsToken } from '@/lib/dexscreener';
import type { BagsToken } from '@/types';

// Fetch real data server-side
async function getHomePageData() {
  try {
    const [trendingTokens, topGainers, newTokensData] = await Promise.all([
      getTopByVolume(8),
      getTopGainers(5),
      getLatestTokens(),
    ]);
    
    const newTokens = newTokensData.map(pairToBagsToken).slice(0, 5);
    
    // Calculate stats from real data
    const totalVolume = trendingTokens.reduce((sum, t) => sum + (t.volume24h || 0), 0);
    
    return {
      trendingTokens,
      topGainers,
      newTokens,
      stats: {
        totalVolume,
        newLaunches: newTokens.length,
      },
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      trendingTokens: [],
      topGainers: [],
      newTokens: [],
      stats: { totalVolume: 0, newLaunches: 0 },
    };
  }
}

export default async function HomePage() {
  const { trendingTokens, topGainers, newTokens, stats } = await getHomePageData();
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900/50 to-bags-card border border-brand-800/30 p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to <span className="text-bags-green">BagsHub</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mb-6">
            The ultimate hub for Bags tokens on Solana. Launch tokens, track trending coins,
            research with AI, and engage with the community.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/launch">
              <Button size="lg">
                Launch Token
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/trending">
              <Button variant="secondary" size="lg">
                <TrendingUp size={18} className="mr-2" />
                Explore Trending
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Trending Tokens</p>
            <p className="text-2xl font-bold mt-1">{trendingTokens.length}</p>
            <p className="text-xs text-brand-400 mt-1">Live data</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Combined Volume 24h</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalVolume, { compact: true })}</p>
            <p className="text-xs text-brand-400 mt-1">Top tokens</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Top Gainers</p>
            <p className="text-2xl font-bold mt-1">{topGainers.length}</p>
            <p className="text-xs text-gain mt-1">24h positive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">New Launches</p>
            <p className="text-2xl font-bold mt-1">{stats.newLaunches}</p>
            <p className="text-xs text-brand-400 mt-1">Recent</p>
          </CardContent>
        </Card>
      </section>

      {/* Trending Tokens */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10">
              <TrendingUp size={20} className="text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Trending Now</h2>
              <p className="text-sm text-gray-500">Top volume on Solana</p>
            </div>
          </div>
          <Link href="/trending">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trendingTokens.slice(0, 4).map((token) => (
            <TokenCard key={token.mint} token={token} />
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Launches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Zap size={20} className="text-yellow-400" />
              </div>
              <CardTitle>New Launches</CardTitle>
            </div>
            <Link href="/new">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {newTokens.length > 0 ? (
              newTokens.map((token, i) => (
                <TokenCard key={token.mint} token={token} rank={i + 1} variant="row" />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Loading new tokens...</p>
            )}
          </CardContent>
        </Card>

        {/* Top Gainers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gain/10">
                <Trophy size={20} className="text-gain" />
              </div>
              <CardTitle>Top Gainers 24h</CardTitle>
            </div>
            <Link href="/leaderboards?type=gainers">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {topGainers.length > 0 ? (
              topGainers.slice(0, 3).map((token, i) => (
                <TokenCard key={token.mint} token={token} rank={i + 1} variant="row" />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Loading gainers...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Volume Leaders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BarChart3 size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Volume Leaders</h2>
              <p className="text-sm text-gray-500">Highest trading volume</p>
            </div>
          </div>
          <Link href="/leaderboards?type=volume">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-4 space-y-2">
            {trendingTokens.length > 0 ? (
              trendingTokens
                .sort((a, b) => (b.volume24h ?? 0) - (a.volume24h ?? 0))
                .slice(0, 5)
                .map((token, i) => (
                  <TokenCard key={token.mint} token={token} rank={i + 1} variant="row" />
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">Loading volume data...</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
