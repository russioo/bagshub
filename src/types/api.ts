// ============================================
// Bags API Specific Types (matching their schema)
// ============================================

// These types match the Bags API response structure
// Update based on actual API documentation at docs.bags.fm

export interface BagsApiToken {
  id: string;
  mint: string;
  name: string;
  symbol: string;
  uri?: string;
  description?: string;
  image?: string;
  creator?: string;
  createdAt?: string;
  supply?: string;
  decimals?: number;
  // Extend based on actual API response
}

export interface BagsApiTokenList {
  tokens: BagsApiToken[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface BagsApiTokenDetails extends BagsApiToken {
  holders?: number;
  volume24h?: number;
  marketCap?: number;
  price?: number;
  priceChange?: {
    '1h'?: number;
    '24h'?: number;
    '7d'?: number;
  };
}

export interface BagsApiCreateTokenRequest {
  name: string;
  symbol: string;
  description?: string;
  image?: string; // Base64 or URL
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface BagsApiCreateTokenResponse {
  success: boolean;
  token?: BagsApiToken;
  transactionSignature?: string;
  error?: string;
}

export interface BagsApiUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// API Error responses
export interface BagsApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Rate limit headers
export interface BagsRateLimitHeaders {
  'x-ratelimit-limit': string;
  'x-ratelimit-remaining': string;
  'x-ratelimit-reset': string;
}
