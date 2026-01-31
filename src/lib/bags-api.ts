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

// Get trending Solana tokens from DexScreener
export async function getTokens(): Promise<BagsToken[]> {
  try {
    // Get Solana token pairs sorted by volume
    const res = await fetch('https://api.dexscreener.com/token-boosts/top/v1', {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      // Fallback: Get trending from token profiles
      return getTokensFallback();
    }
    
    const data = await res.json();
    
    // Filter for Solana only
    const solanaPairs = (data || [])
      .filter((p: any) => p.chainId === 'solana')
      .slice(0, 50);
    
    if (solanaPairs.length === 0) {
      return getTokensFallback();
    }
    
    // Get detailed data for each token
    const mints = solanaPairs.map((p: any) => p.tokenAddress).filter(Boolean);
    return getTokensByMints(mints);
  } catch {
    return getTokensFallback();
  }
}

async function getTokensFallback(): Promise<BagsToken[]> {
  try {
    // Try token profiles endpoint
    const res = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    const solanaTokens = (data || [])
      .filter((t: any) => t.chainId === 'solana')
      .slice(0, 50);
    
    const mints = solanaTokens.map((t: any) => t.tokenAddress).filter(Boolean);
    return getTokensByMints(mints);
  } catch {
    return [];
  }
}

async function getTokensByMints(mints: string[]): Promise<BagsToken[]> {
  if (mints.length === 0) return [];
  
  try {
    const mintStr = mints.slice(0, 30).join(',');
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintStr}`, {
      next: { revalidate: 30 },
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.pairs) return [];
    
    // Group by token and get best pair
    const tokenMap = new Map<string, any>();
    for (const pair of data.pairs) {
      if (pair.chainId !== 'solana') continue;
      
      const mint = pair.baseToken?.address;
      if (!mint) continue;
      
      const existing = tokenMap.get(mint);
      if (!existing || (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
        tokenMap.set(mint, pair);
      }
    }
    
    return Array.from(tokenMap.values())
      .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
      .map(pairToToken);
  } catch {
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
  return tokens.sort((a, b) => b.volume24h - a.volume24h).slice(0, 20);
}

export async function getToken(mint: string): Promise<BagsToken | null> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`, {
      next: { revalidate: 30 },
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.pairs || data.pairs.length === 0) return null;
    
    // Get Solana pair with best liquidity
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
