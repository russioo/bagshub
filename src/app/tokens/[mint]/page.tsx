import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceChart, PriceChartPlaceholder } from '@/components/price-chart';
import { formatPrice, formatNumber, formatPercent, truncateAddress, timeAgo } from '@/lib/utils';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Copy, 
  ExternalLink,
  Twitter,
  Globe,
  MessageCircle,
  Users,
  BarChart3,
  Droplets,
  Clock,
  Bookmark,
  Share2
} from 'lucide-react';

// Mock data - replace with API call
function getToken(mint: string) {
  return {
    mint,
    name: 'Bags Token',
    symbol: 'BAGS',
    description: 'The native token of the Bags ecosystem on Solana. Used for governance, staking, and platform fees.',
    image: '/tokens/bags.png',
    price: 0.0234,
    priceChange24h: 12.5,
    priceChange7d: 45.2,
    volume24h: 1250000,
    marketCap: 23400000,
    liquidity: 890000,
    holders: 45000,
    supply: 1000000000,
    createdAt: '2024-01-15T00:00:00Z',
    creator: '7xKX...4mF2',
    twitter: 'https://twitter.com/bags',
    website: 'https://bags.fm',
    telegram: 'https://t.me/bags',
  };
}

const priceHistory = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - (23 - i) * 3600000,
  price: 0.0234 + Math.random() * 0.005 - 0.0025,
  volume: 50000 + Math.random() * 20000,
}));

const transactions = [
  { type: 'buy', amount: 125000, price: 0.0235, wallet: '7xKX...4mF2', time: '2m ago' },
  { type: 'sell', amount: 50000, price: 0.0234, wallet: '3aBC...9dE1', time: '5m ago' },
  { type: 'buy', amount: 250000, price: 0.0233, wallet: '8hGF...2kL5', time: '8m ago' },
  { type: 'buy', amount: 75000, price: 0.0234, wallet: '5mNO...7pQ3', time: '12m ago' },
  { type: 'sell', amount: 100000, price: 0.0235, wallet: '2rST...6uV8', time: '15m ago' },
];

const topHolders = [
  { wallet: '7xKX...4mF2', balance: 50000000, percentage: 5.0 },
  { wallet: '3aBC...9dE1', balance: 35000000, percentage: 3.5 },
  { wallet: '8hGF...2kL5', balance: 28000000, percentage: 2.8 },
  { wallet: '5mNO...7pQ3', balance: 22000000, percentage: 2.2 },
  { wallet: '2rST...6uV8', balance: 18000000, percentage: 1.8 },
];

export default async function TokenPage({ 
  params 
}: { 
  params: Promise<{ mint: string }> 
}) {
  const { mint } = await params;
  const token = getToken(mint);
  const isPositive = token.priceChange24h >= 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to tokens
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
            {token.image ? (
              <Image
                src={token.image}
                alt={token.name}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {token.symbol.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{token.name}</h1>
              <Badge variant="outline">{token.symbol}</Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              {token.description}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            Trade
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-baseline gap-4">
            <span className="text-4xl font-bold font-mono">
              {formatPrice(token.price)}
            </span>
            <Badge variant={isPositive ? 'success' : 'danger'} className="text-base py-1">
              {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {formatPercent(token.priceChange24h)}
            </Badge>
            <span className="text-muted-foreground">
              7d: <span className={token.priceChange7d >= 0 ? 'text-bags-green' : 'text-bags-red'}>
                {formatPercent(token.priceChange7d)}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Market Cap</span>
            </div>
            <div className="text-xl font-semibold">{formatNumber(token.marketCap)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">24h Volume</span>
            </div>
            <div className="text-xl font-semibold">{formatNumber(token.volume24h)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Droplets className="h-4 w-4" />
              <span className="text-sm">Liquidity</span>
            </div>
            <div className="text-xl font-semibold">{formatNumber(token.liquidity)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Holders</span>
            </div>
            <div className="text-xl font-semibold">{token.holders.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <PriceChart data={priceHistory} isPositive={isPositive} />

      {/* Tabs for transactions, holders, info */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="holders">Top Holders</TabsTrigger>
          <TabsTrigger value="info">Token Info</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-muted-foreground text-sm">
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Wallet</th>
                      <th className="pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((tx, i) => (
                      <tr key={i}>
                        <td className="py-3">
                          <Badge variant={tx.type === 'buy' ? 'success' : 'danger'}>
                            {tx.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 font-mono">{tx.amount.toLocaleString()}</td>
                        <td className="py-3 font-mono">{formatPrice(tx.price)}</td>
                        <td className="py-3 text-muted-foreground">{tx.wallet}</td>
                        <td className="py-3 text-muted-foreground">{tx.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holders">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {topHolders.map((holder, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-6">#{i + 1}</span>
                      <span className="font-mono">{holder.wallet}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{holder.balance.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{holder.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Contract Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{truncateAddress(token.mint, 8)}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Supply</span>
                <span className="font-mono">{token.supply.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{timeAgo(token.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Creator</span>
                <span className="font-mono">{token.creator}</span>
              </div>
              
              {/* Social links */}
              <div className="pt-4 border-t border-border">
                <div className="flex gap-2">
                  {token.twitter && (
                    <a href={token.twitter} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Button>
                    </a>
                  )}
                  {token.website && (
                    <a href={token.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </Button>
                    </a>
                  )}
                  {token.telegram && (
                    <a href={token.telegram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Telegram
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
