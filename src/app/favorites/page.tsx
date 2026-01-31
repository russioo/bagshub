'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TokenTable } from '@/components/token-table';
import { Badge } from '@/components/ui/badge';
import { 
  Bookmark, 
  Heart, 
  Star,
  Plus,
  LogIn,
  Trash2
} from 'lucide-react';
import type { BagsToken } from '@/types';

// Mock data - in reality this would come from user's bookmarks
const mockFavorites: BagsToken[] = [
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
];

export default function FavoritesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const [favorites, setFavorites] = useState(mockFavorites);

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Bookmark className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your Favorites</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          Sign in to save your favorite tokens and track them all in one place.
          Never miss a pump again!
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Account
            </Button>
          </Link>
        </div>
        
        {/* Demo button */}
        <Button 
          variant="ghost" 
          className="mt-8 text-muted-foreground"
          onClick={() => setIsLoggedIn(true)}
        >
          View Demo →
        </Button>
      </div>
    );
  }

  // Logged in view
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <h1 className="text-3xl font-bold">Your Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            {favorites.length} tokens in your watchlist
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Total Value</div>
            <div className="text-2xl font-bold">$12,450</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">24h Change</div>
            <div className="text-2xl font-bold text-bags-green">+$1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Best Performer</div>
            <div className="text-2xl font-bold">SPEPE</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Tokens</div>
            <div className="text-2xl font-bold">{favorites.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Favorites Table */}
      {favorites.length > 0 ? (
        <TokenTable tokens={favorites} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding tokens to your watchlist to track them here
            </p>
            <Link href="/">
              <Button>Browse Tokens</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
