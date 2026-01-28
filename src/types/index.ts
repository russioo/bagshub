// ============================================
// Bags API Types
// ============================================

export interface BagsToken {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  imageUrl?: string;
  creatorAddress: string;
  createdAt: string;
  supply: string;
  decimals: number;
  // Price data
  price?: number;
  priceChange24h?: number;
  priceChange1h?: number;
  priceChange7d?: number;
  // Volume & market data
  volume24h?: number;
  marketCap?: number;
  liquidity?: number;
  // Holder data
  holderCount?: number;
  // Social links
  twitter?: string;
  telegram?: string;
  website?: string;
  // Tags/categories
  tags?: string[];
}

export interface BagsTokenHolder {
  address: string;
  balance: string;
  percentage: number;
  isCreator?: boolean;
}

export interface BagsTransaction {
  signature: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: string;
  price?: number;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
}

export interface BagsTokenStats {
  mint: string;
  price: number;
  priceHistory: PricePoint[];
  volume24h: number;
  volumeHistory: VolumePoint[];
  trades24h: number;
  buys24h: number;
  sells24h: number;
  uniqueTraders24h: number;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume?: number;
}

export interface VolumePoint {
  timestamp: string;
  volume: number;
}

// Token creation payload
export interface CreateTokenPayload {
  name: string;
  symbol: string;
  description?: string;
  image?: File | string; // File for upload or URL
  twitter?: string;
  telegram?: string;
  website?: string;
  initialBuyAmount?: number; // SOL amount for initial buy
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number; // Unix timestamp
  limit: number;
}

// ============================================
// Leaderboard Types
// ============================================

export type LeaderboardType = 
  | 'trending'
  | 'top-gainers'
  | 'top-losers'
  | 'most-volume'
  | 'newest'
  | 'most-holders';

export type TimeFrame = '1h' | '6h' | '24h' | '7d' | '30d';

export interface LeaderboardFilters {
  type: LeaderboardType;
  timeFrame: TimeFrame;
  minVolume?: number;
  minHolders?: number;
  tags?: string[];
  page?: number;
  pageSize?: number;
}

// ============================================
// User & Auth Types
// ============================================

export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthUser extends User {
  email?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

// ============================================
// Chat Types
// ============================================

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  user: User;
  roomId: string;
  createdAt: string;
  isEdited: boolean;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
  hasReacted: boolean; // current user
}

export interface ChatRoom {
  id: string;
  tokenMint: string;
  messageCount: number;
  activeUsers: number;
}

// ============================================
// Bookmark Types
// ============================================

export interface Bookmark {
  id: string;
  tokenMint: string;
  token?: BagsToken; // Populated on fetch
  notes?: string;
  createdAt: string;
}

// ============================================
// AI Research Types
// ============================================

export interface AIResearchRequest {
  tokenMint: string;
  includeHolderAnalysis?: boolean;
  includeTransactionAnalysis?: boolean;
  includeSocialAnalysis?: boolean;
}

export interface AIResearchResult {
  tokenMint: string;
  summary: string;
  riskScore: number; // 1-10
  riskFactors: string[];
  positiveFactors: string[];
  holderAnalysis?: HolderAnalysis;
  transactionPatterns?: TransactionPatterns;
  recommendation: 'bullish' | 'neutral' | 'bearish';
  confidence: number; // 0-100
  createdAt: string;
}

export interface HolderAnalysis {
  topHolderConcentration: number; // % held by top 10
  creatorHolding: number;
  averageHolding: number;
  distribution: 'concentrated' | 'moderate' | 'distributed';
}

export interface TransactionPatterns {
  buyPressure: number; // -100 to 100
  averageTradeSize: number;
  whaleActivity: 'low' | 'medium' | 'high';
  suspiciousPatterns: string[];
}

// ============================================
// Search Types
// ============================================

export interface SearchResult {
  tokens: BagsToken[];
  totalResults: number;
  query: string;
  suggestions?: string[];
}

export interface SearchFilters {
  query: string;
  tags?: string[];
  minMarketCap?: number;
  maxMarketCap?: number;
  minVolume?: number;
  sortBy?: 'relevance' | 'volume' | 'marketCap' | 'newest';
  page?: number;
  pageSize?: number;
}

// ============================================
// Category/Tag Types
// ============================================

export interface TokenCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  tokenCount: number;
}

export const TOKEN_TAGS = [
  'meme',
  'ai',
  'gaming',
  'defi',
  'nft',
  'utility',
  'community',
  'celebrity',
  'animal',
  'food',
  'music',
  'sports',
  'politics',
] as const;

export type TokenTag = typeof TOKEN_TAGS[number];
