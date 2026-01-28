/**
 * DexScreener API Client
 * Free API for token market data on Solana
 * Docs: https://docs.dexscreener.com/api/reference
 */

import type { BagsToken } from '@/types';

const DEXSCREENER_API = 'https://api.dexscreener.com';

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: {
    imageUrl?: string;
    websites?: { label: string; url: string }[];
    socials?: { type: string; url: string }[];
  };
  boosts?: {
    active: number;
  };
}

export interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexScreenerPair[] | null;
}

/**
 * Search for tokens by query
 */
export async function searchTokens(query: string): Promise<DexScreenerPair[]> {
  const response = await fetch(`${DEXSCREENER_API}/latest/dex/search?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status}`);
  }
  
  const data: DexScreenerResponse = await response.json();
  
  // Filter for Solana pairs only
  return (data.pairs || []).filter(pair => pair.chainId === 'solana');
}

/**
 * Get token pairs by token address
 */
export async function getTokenPairs(tokenAddress: string): Promise<DexScreenerPair[]> {
  const response = await fetch(`${DEXSCREENER_API}/latest/dex/tokens/${tokenAddress}`);
  
  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status}`);
  }
  
  const data: DexScreenerResponse = await response.json();
  return (data.pairs || []).filter(pair => pair.chainId === 'solana');
}

/**
 * Get boosted/trending tokens on Solana
 */
export async function getTrendingTokens(): Promise<DexScreenerPair[]> {
  // DexScreener doesn't have a direct trending endpoint, so we search for popular terms
  // and sort by volume
  const response = await fetch(`${DEXSCREENER_API}/token-boosts/top/v1`);
  
  if (!response.ok) {
    // Fallback to searching popular tokens
    return searchTokens('solana');
  }
  
  const boosts = await response.json();
  
  // Filter for Solana and get token details
  const solanaMints = boosts
    .filter((b: any) => b.chainId === 'solana')
    .slice(0, 20)
    .map((b: any) => b.tokenAddress);
  
  if (solanaMints.length === 0) {
    return searchTokens('solana');
  }
  
  // Fetch details for each token
  const pairs: DexScreenerPair[] = [];
  for (const mint of solanaMints.slice(0, 10)) {
    try {
      const tokenPairs = await getTokenPairs(mint);
      if (tokenPairs.length > 0) {
        pairs.push(tokenPairs[0]);
      }
    } catch (e) {
      // Skip failed requests
    }
  }
  
  return pairs;
}

/**
 * Get latest token profiles (new launches)
 */
export async function getLatestTokens(): Promise<DexScreenerPair[]> {
  const response = await fetch(`${DEXSCREENER_API}/token-profiles/latest/v1`);
  
  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status}`);
  }
  
  const profiles = await response.json();
  
  // Filter for Solana tokens
  const solanaProfiles = profiles
    .filter((p: any) => p.chainId === 'solana')
    .slice(0, 20);
  
  // Get pair data for each
  const pairs: DexScreenerPair[] = [];
  for (const profile of solanaProfiles.slice(0, 10)) {
    try {
      const tokenPairs = await getTokenPairs(profile.tokenAddress);
      if (tokenPairs.length > 0) {
        // Merge profile info with pair data
        const pair = tokenPairs[0];
        pair.info = {
          imageUrl: profile.icon,
          websites: profile.links?.filter((l: any) => l.type === 'website'),
          socials: profile.links?.filter((l: any) => ['twitter', 'telegram', 'discord'].includes(l.type)),
        };
        pairs.push(pair);
      }
    } catch (e) {
      // Skip failed requests
    }
  }
  
  return pairs;
}

/**
 * Convert DexScreener pair to our BagsToken format
 */
export function pairToBagsToken(pair: DexScreenerPair): BagsToken {
  const twitter = pair.info?.socials?.find(s => s.type === 'twitter')?.url;
  const telegram = pair.info?.socials?.find(s => s.type === 'telegram')?.url;
  const website = pair.info?.websites?.[0]?.url;
  
  return {
    mint: pair.baseToken.address,
    name: pair.baseToken.name,
    symbol: pair.baseToken.symbol,
    imageUrl: pair.info?.imageUrl,
    creatorAddress: '', // Not available from DexScreener
    createdAt: pair.pairCreatedAt 
      ? new Date(pair.pairCreatedAt).toISOString() 
      : new Date().toISOString(),
    supply: '0',
    decimals: 9,
    price: parseFloat(pair.priceUsd) || 0,
    priceChange24h: pair.priceChange?.h24 || 0,
    priceChange1h: pair.priceChange?.h1 || 0,
    priceChange7d: 0, // Not directly available
    volume24h: pair.volume?.h24 || 0,
    marketCap: pair.marketCap || pair.fdv || 0,
    liquidity: pair.liquidity?.usd || 0,
    holderCount: 0, // Not available from DexScreener
    twitter: twitter ? twitter.replace('https://twitter.com/', '').replace('https://x.com/', '') : undefined,
    telegram: telegram ? telegram.replace('https://t.me/', '') : undefined,
    website,
    tags: guessTokenTags(pair.baseToken.name, pair.baseToken.symbol),
  };
}

/**
 * Guess token tags based on name/symbol
 */
function guessTokenTags(name: string, symbol: string): string[] {
  const tags: string[] = [];
  const combined = `${name} ${symbol}`.toLowerCase();
  
  if (combined.includes('ai') || combined.includes('gpt') || combined.includes('bot')) {
    tags.push('ai');
  }
  if (combined.includes('game') || combined.includes('play')) {
    tags.push('gaming');
  }
  if (combined.includes('defi') || combined.includes('swap') || combined.includes('finance')) {
    tags.push('defi');
  }
  if (combined.includes('dog') || combined.includes('cat') || combined.includes('pepe') || 
      combined.includes('doge') || combined.includes('shib') || combined.includes('inu')) {
    tags.push('meme');
  }
  if (combined.includes('nft')) {
    tags.push('nft');
  }
  
  // Default to meme if no tags found (most Solana tokens are memes)
  if (tags.length === 0) {
    tags.push('meme');
  }
  
  return tags;
}

/**
 * Get top tokens by volume on Solana
 */
export async function getTopByVolume(limit: number = 20): Promise<BagsToken[]> {
  // Search for popular Solana tokens
  const pairs = await searchTokens('solana');
  
  // Sort by 24h volume
  const sorted = pairs
    .filter(p => p.volume?.h24 > 0)
    .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
    .slice(0, limit);
  
  return sorted.map(pairToBagsToken);
}

/**
 * Get top gainers on Solana
 */
export async function getTopGainers(limit: number = 20): Promise<BagsToken[]> {
  const pairs = await searchTokens('solana');
  
  const sorted = pairs
    .filter(p => (p.priceChange?.h24 || 0) > 0 && p.volume?.h24 > 1000)
    .sort((a, b) => (b.priceChange?.h24 || 0) - (a.priceChange?.h24 || 0))
    .slice(0, limit);
  
  return sorted.map(pairToBagsToken);
}

/**
 * Get top losers on Solana
 */
export async function getTopLosers(limit: number = 20): Promise<BagsToken[]> {
  const pairs = await searchTokens('solana');
  
  const sorted = pairs
    .filter(p => (p.priceChange?.h24 || 0) < 0 && p.volume?.h24 > 1000)
    .sort((a, b) => (a.priceChange?.h24 || 0) - (b.priceChange?.h24 || 0))
    .slice(0, limit);
  
  return sorted.map(pairToBagsToken);
}
