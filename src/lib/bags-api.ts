export interface BagsToken {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  createdAt: string;
}

// Get only Bags tokens - their mint addresses end with "BAGS"
export async function getTokens(): Promise<BagsToken[]> {
  try {
    // Search for tokens with BAGS in the query
    const res = await fetch('https://api.dexscreener.com/latest/dex/search?q=BAGS', {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.error('DexScreener API error:', res.status);
      return [];
    }
    
    const data = await res.json();
    if (!data.pairs) {
      console.log('No pairs in response');
      return [];
    }
    
    console.log('Total pairs from search:', data.pairs.length);
    
    // STRICT filter: Solana chain AND mint ends with "BAGS"
    const bagsPairs = data.pairs.filter((p: any) => {
      if (p.chainId !== 'solana') return false;
      const mint = p.baseToken?.address || '';
      const isBags = mint.toUpperCase().endsWith('BAGS');
      return isBags;
    });
    
    console.log('Bags pairs after filter:', bagsPairs.length);
    
    // Group by token, keep pair with best liquidity
    const tokenMap = new Map<string, any>();
    for (const pair of bagsPairs) {
      const mint = pair.baseToken?.address;
      if (!mint) continue;
      
      const existing = tokenMap.get(mint);
      if (!existing || (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
        tokenMap.set(mint, pair);
      }
    }
    
    console.log('Unique Bags tokens:', tokenMap.size);
    
    // Sort by volume
    return Array.from(tokenMap.values())
      .map(pairToToken)
      .sort((a, b) => b.volume24h - a.volume24h);
  } catch (e) {
    console.error('Error fetching tokens:', e);
    return [];
  }
}

function pairToToken(pair: any): BagsToken {
  return {
    mint: pair.baseToken?.address || '',
    name: pair.baseToken?.name || 'Unknown',
    symbol: pair.baseToken?.symbol || '???',
    image: pair.info?.imageUrl || '',
    price: parseFloat(pair.priceUsd) || 0,
    priceChange24h: pair.priceChange?.h24 || 0,
    volume24h: pair.volume?.h24 || 0,
    marketCap: pair.marketCap || pair.fdv || 0,
    liquidity: pair.liquidity?.usd || 0,
    holders: 0,
    createdAt: pair.pairCreatedAt ? new Date(pair.pairCreatedAt).toISOString() : '',
  };
}

export async function getTrendingTokens(): Promise<BagsToken[]> {
  const tokens = await getTokens();
  return tokens.slice(0, 20);
}

export async function getToken(mint: string): Promise<BagsToken | null> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`, {
      next: { revalidate: 30 },
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.pairs || data.pairs.length === 0) return null;
    
    const solanaPairs = data.pairs.filter((p: any) => p.chainId === 'solana');
    if (solanaPairs.length === 0) return null;
    
    const pair = solanaPairs.reduce((best: any, p: any) => 
      (p.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? p : best
    );
    
    return pairToToken(pair);
  } catch {
    return null;
  }
}
