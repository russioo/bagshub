import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Clock,
  Globe,
  Twitter,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockTrendingTokens } from '@/data/mock-tokens';
import { formatCurrency, formatNumber, formatPercent, truncateAddress, formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Mock function to get token (replace with API call)
function getToken(mint: string) {
  return mockTrendingTokens.find((t) => t.mint === mint) || mockTrendingTokens[0];
}

export default async function TokenPage({
  params,
}: {
  params: Promise<{ mint: string }>;
}) {
  const { mint } = await params;
  const token = getToken(mint);
  const priceChange = token.priceChange24h ?? 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-300">
          Home
        </Link>
        <span>/</span>
        <Link href="/trending" className="hover:text-gray-300">
          Tokens
        </Link>
        <span>/</span>
        <span className="text-gray-300">{token.symbol}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/trending">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>

          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-800">
            {token.imageUrl ? (
              <Image src={token.imageUrl} alt={token.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                {token.symbol[0]}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{token.name}</h1>
              <Badge variant="brand">${token.symbol}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{truncateAddress(token.mint, 8)}</span>
              <button className="p-1 hover:bg-gray-800 rounded">
                <Copy size={14} />
              </button>
            </div>
            {token.tags && token.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {token.tags.map((tag) => (
                  <Badge key={tag} variant={tag as any}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm">
            <Bookmark size={16} className="mr-2" />
            Watchlist
          </Button>
          <Link href={`/token/${mint}/chat`}>
            <Button variant="secondary" size="sm">
              <MessageCircle size={16} className="mr-2" />
              Chat
            </Button>
          </Link>
          <Button size="sm">Trade</Button>
        </div>
      </div>

      {/* Price & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Price Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Price</p>
                  <p className="text-4xl font-bold">{formatCurrency(token.price ?? 0)}</p>
                </div>
                <div
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-semibold',
                    isPositive ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'
                  )}
                >
                  {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  {formatPercent(priceChange)}
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-64 bg-gray-800/50 rounded-xl flex items-center justify-center border border-gray-800">
                <p className="text-gray-500">Price chart coming soon...</p>
              </div>

              {/* Timeframe Tabs */}
              <div className="flex gap-2 mt-4">
                {['1H', '24H', '7D', '30D', 'ALL'].map((tf) => (
                  <button
                    key={tf}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                      tf === '24H'
                        ? 'bg-brand-500 text-white'
                        : 'text-gray-400 hover:bg-gray-800'
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {token.description && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{token.description}</p>
                
                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  {token.website && (
                    <a
                      href={token.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
                    >
                      <Globe size={16} />
                      Website
                    </a>
                  )}
                  {token.twitter && (
                    <a
                      href={`https://twitter.com/${token.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
                    >
                      <Twitter size={16} />
                      Twitter
                    </a>
                  )}
                  {token.telegram && (
                    <a
                      href={`https://t.me/${token.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
                    >
                      <Send size={16} />
                      Telegram
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">All</Button>
                <Button variant="ghost" size="sm">Buys</Button>
                <Button variant="ghost" size="sm">Sells</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Mock transactions */}
                {[
                  { type: 'buy', amount: '1,234.56', price: 0.0234, time: '2 min ago' },
                  { type: 'sell', amount: '567.89', price: 0.0232, time: '5 min ago' },
                  { type: 'buy', amount: '10,000', price: 0.0235, time: '8 min ago' },
                  { type: 'buy', amount: '2,500', price: 0.0234, time: '12 min ago' },
                  { type: 'sell', amount: '890.12', price: 0.0233, time: '15 min ago' },
                ].map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                          tx.type === 'buy' ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'
                        )}
                      >
                        {tx.type === 'buy' ? 'B' : 'S'}
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.type === 'buy' ? 'Buy' : 'Sell'} {tx.amount} {token.symbol}
                        </p>
                        <p className="text-sm text-gray-500">@ ${tx.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Stats Sidebar */}
        <div className="space-y-6">
          {/* Key Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Market Cap</span>
                <span className="font-medium">
                  {formatCurrency(token.marketCap ?? 0, { compact: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Volume 24h</span>
                <span className="font-medium">
                  {formatCurrency(token.volume24h ?? 0, { compact: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Liquidity</span>
                <span className="font-medium">
                  {formatCurrency(token.liquidity ?? 0, { compact: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Holders</span>
                <span className="font-medium">{formatNumber(token.holderCount ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="font-medium">{formatRelativeTime(token.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Price Changes */}
          <Card>
            <CardHeader>
              <CardTitle>Price Changes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: '1 Hour', value: token.priceChange1h },
                { label: '24 Hours', value: token.priceChange24h },
                { label: '7 Days', value: token.priceChange7d },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-gray-500">{item.label}</span>
                  <span
                    className={cn(
                      'font-medium',
                      (item.value ?? 0) >= 0 ? 'text-gain' : 'text-loss'
                    )}
                  >
                    {formatPercent(item.value ?? 0)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Holders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Holders</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { address: 'So1ana...XYZ1', percent: 15.2 },
                { address: 'Ba9s...ABC2', percent: 8.5 },
                { address: 'De7i...DEF3', percent: 5.3 },
                { address: 'Wha1e...GHI4', percent: 4.1 },
                { address: 'Ho1dr...JKL5', percent: 3.8 },
              ].map((holder, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">#{i + 1}</span>
                    <span className="text-sm font-mono">{holder.address}</span>
                  </div>
                  <span className="text-sm font-medium">{holder.percent}%</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Research CTA */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-800/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold mb-2">AI Research</h3>
              <p className="text-sm text-gray-400 mb-4">
                Get deep analysis of this token powered by Claude AI
              </p>
              <Link href={`/research?token=${mint}`}>
                <Button className="w-full">Analyze Token</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
