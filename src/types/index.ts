// Bags Token types
export interface BagsToken {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  price: number;
  priceChange24h: number;
  priceChange7d?: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  supply: number;
  createdAt: string;
  creator?: string;
  twitter?: string;
  website?: string;
  telegram?: string;
}

// API Response types
export interface TokenListResponse {
  tokens: BagsToken[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TokenDetailResponse {
  token: BagsToken;
  priceHistory: PricePoint[];
  transactions: Transaction[];
  topHolders: Holder[];
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface Transaction {
  signature: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  wallet: string;
  timestamp: string;
}

export interface Holder {
  wallet: string;
  balance: number;
  percentage: number;
}

// Leaderboard types
export type LeaderboardType = 
  | 'trending'
  | 'gainers'
  | 'losers'
  | 'volume'
  | 'newest'
  | 'holders';

export interface LeaderboardEntry extends BagsToken {
  rank: number;
  change: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  avatar?: string;
  createdAt: string;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

// User types
export interface User {
  id: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Bookmark types
export interface Bookmark {
  id: string;
  tokenMint: string;
  token?: BagsToken;
  notes?: string;
  createdAt: string;
}

// Filter types
export type TokenCategory = 
  | 'all'
  | 'meme'
  | 'ai'
  | 'gaming'
  | 'defi'
  | 'nft'
  | 'utility';

export interface TokenFilters {
  category?: TokenCategory;
  minVolume?: number;
  minMarketCap?: number;
  minHolders?: number;
  sortBy?: 'volume' | 'marketCap' | 'price' | 'change' | 'holders' | 'newest';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// AI Research types
export interface AIResearchResult {
  tokenMint: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  riskScore: number; // 1-10
  strengths: string[];
  weaknesses: string[];
  analysis: {
    tokenomics: string;
    community: string;
    utility: string;
    team: string;
  };
  createdAt: string;
}
