/**
 * Bags API Client
 * Server-side only - never expose to frontend
 * 
 * Base URL: https://public-api-v2.bags.fm/api/v1/
 * Docs: https://docs.bags.fm/
 */

import {
  BagsApiToken,
  BagsApiTokenList,
  BagsApiTokenDetails,
  BagsApiCreateTokenRequest,
  BagsApiCreateTokenResponse,
  BagsApiUploadResponse,
} from '@/types/api';

const BAGS_API_URL = process.env.BAGS_API_URL || 'https://public-api-v2.bags.fm/api/v1';
const BAGS_API_KEY = process.env.BAGS_API_KEY;

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

let rateLimitInfo: RateLimitInfo = {
  limit: 1000,
  remaining: 1000,
  reset: Date.now() + 3600000,
};

class BagsApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'BagsApiError';
  }
}

/**
 * Update rate limit info from response headers
 */
function updateRateLimitInfo(headers: Headers): void {
  const limit = headers.get('x-ratelimit-limit');
  const remaining = headers.get('x-ratelimit-remaining');
  const reset = headers.get('x-ratelimit-reset');

  if (limit) rateLimitInfo.limit = parseInt(limit, 10);
  if (remaining) rateLimitInfo.remaining = parseInt(remaining, 10);
  if (reset) rateLimitInfo.reset = parseInt(reset, 10) * 1000; // Convert to ms
}

/**
 * Get current rate limit status
 */
export function getRateLimitInfo(): RateLimitInfo {
  return { ...rateLimitInfo };
}

/**
 * Check if we should wait before making a request
 */
export function shouldThrottle(): boolean {
  if (rateLimitInfo.remaining <= 10) {
    const now = Date.now();
    if (now < rateLimitInfo.reset) {
      return true;
    }
  }
  return false;
}

/**
 * Base fetch function with auth and error handling
 */
async function bagsApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!BAGS_API_KEY) {
    throw new BagsApiError('BAGS_API_KEY is not configured', 500);
  }

  if (shouldThrottle()) {
    const waitTime = rateLimitInfo.reset - Date.now();
    throw new BagsApiError(
      `Rate limit approaching. Please wait ${Math.ceil(waitTime / 1000)} seconds.`,
      429
    );
  }

  const url = `${BAGS_API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': BAGS_API_KEY,
      ...options.headers,
    },
  });

  updateRateLimitInfo(response.headers);

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new BagsApiError(errorMessage, response.status);
  }

  return response.json();
}

// ============================================
// Token Endpoints
// ============================================

/**
 * Get list of tokens with optional filters
 */
export async function getTokens(params?: {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'volume' | 'marketCap' | 'trending';
  search?: string;
}): Promise<BagsApiTokenList> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.search) searchParams.set('search', params.search);

  const queryString = searchParams.toString();
  const endpoint = `/tokens${queryString ? `?${queryString}` : ''}`;
  
  return bagsApiFetch<BagsApiTokenList>(endpoint);
}

/**
 * Get trending tokens
 */
export async function getTrendingTokens(params?: {
  limit?: number;
  timeFrame?: '1h' | '6h' | '24h';
}): Promise<BagsApiTokenList> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.timeFrame) searchParams.set('timeFrame', params.timeFrame);

  const queryString = searchParams.toString();
  const endpoint = `/tokens/trending${queryString ? `?${queryString}` : ''}`;
  
  return bagsApiFetch<BagsApiTokenList>(endpoint);
}

/**
 * Get newly launched tokens
 */
export async function getNewTokens(params?: {
  limit?: number;
  page?: number;
}): Promise<BagsApiTokenList> {
  const searchParams = new URLSearchParams();
  searchParams.set('sort', 'newest');
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.page) searchParams.set('page', params.page.toString());

  const endpoint = `/tokens?${searchParams.toString()}`;
  
  return bagsApiFetch<BagsApiTokenList>(endpoint);
}

/**
 * Get token details by mint address
 */
export async function getTokenByMint(mint: string): Promise<BagsApiTokenDetails> {
  return bagsApiFetch<BagsApiTokenDetails>(`/tokens/${mint}`);
}

/**
 * Get token holders
 */
export async function getTokenHolders(mint: string, params?: {
  page?: number;
  limit?: number;
}): Promise<{
  holders: Array<{
    address: string;
    balance: string;
    percentage: number;
  }>;
  total: number;
}> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const endpoint = `/tokens/${mint}/holders${queryString ? `?${queryString}` : ''}`;
  
  return bagsApiFetch(endpoint);
}

/**
 * Get token transactions
 */
export async function getTokenTransactions(mint: string, params?: {
  page?: number;
  limit?: number;
  type?: 'buy' | 'sell' | 'all';
}): Promise<{
  transactions: Array<{
    signature: string;
    type: 'buy' | 'sell';
    amount: string;
    price: number;
    timestamp: string;
  }>;
  total: number;
}> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.type && params.type !== 'all') searchParams.set('type', params.type);

  const queryString = searchParams.toString();
  const endpoint = `/tokens/${mint}/transactions${queryString ? `?${queryString}` : ''}`;
  
  return bagsApiFetch(endpoint);
}

/**
 * Get token price history for charts
 */
export async function getTokenPriceHistory(mint: string, params?: {
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  from?: number; // Unix timestamp
  to?: number;
}): Promise<{
  prices: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}> {
  const searchParams = new URLSearchParams();
  if (params?.interval) searchParams.set('interval', params.interval);
  if (params?.from) searchParams.set('from', params.from.toString());
  if (params?.to) searchParams.set('to', params.to.toString());

  const queryString = searchParams.toString();
  const endpoint = `/tokens/${mint}/prices${queryString ? `?${queryString}` : ''}`;
  
  return bagsApiFetch(endpoint);
}

// ============================================
// Token Creation Endpoints
// ============================================

/**
 * Upload an image for token creation
 */
export async function uploadImage(
  imageBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<BagsApiUploadResponse> {
  if (!BAGS_API_KEY) {
    throw new BagsApiError('BAGS_API_KEY is not configured', 500);
  }

  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: mimeType });
  formData.append('file', blob, filename);

  const response = await fetch(`${BAGS_API_URL}/upload`, {
    method: 'POST',
    headers: {
      'x-api-key': BAGS_API_KEY,
    },
    body: formData,
  });

  updateRateLimitInfo(response.headers);

  if (!response.ok) {
    throw new BagsApiError('Failed to upload image', response.status);
  }

  return response.json();
}

/**
 * Create a new token
 */
export async function createToken(
  data: BagsApiCreateTokenRequest
): Promise<BagsApiCreateTokenResponse> {
  return bagsApiFetch<BagsApiCreateTokenResponse>('/tokens', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// Search Endpoints
// ============================================

/**
 * Search tokens by name or symbol
 */
export async function searchTokens(
  query: string,
  params?: {
    limit?: number;
    page?: number;
  }
): Promise<BagsApiTokenList> {
  const searchParams = new URLSearchParams();
  searchParams.set('search', query);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.page) searchParams.set('page', params.page.toString());

  const endpoint = `/tokens?${searchParams.toString()}`;
  
  return bagsApiFetch<BagsApiTokenList>(endpoint);
}

// ============================================
// Leaderboard Helpers
// ============================================

/**
 * Get top gainers
 */
export async function getTopGainers(params?: {
  limit?: number;
  timeFrame?: '1h' | '24h' | '7d';
}): Promise<BagsApiTokenList> {
  const searchParams = new URLSearchParams();
  searchParams.set('sort', 'gainers');
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.timeFrame) searchParams.set('timeFrame', params.timeFrame);

  return bagsApiFetch<BagsApiTokenList>(`/tokens?${searchParams.toString()}`);
}

/**
 * Get top losers
 */
export async function getTopLosers(params?: {
  limit?: number;
  timeFrame?: '1h' | '24h' | '7d';
}): Promise<BagsApiTokenList> {
  const searchParams = new URLSearchParams();
  searchParams.set('sort', 'losers');
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.timeFrame) searchParams.set('timeFrame', params.timeFrame);

  return bagsApiFetch<BagsApiTokenList>(`/tokens?${searchParams.toString()}`);
}

/**
 * Get tokens by volume
 */
export async function getByVolume(params?: {
  limit?: number;
  timeFrame?: '1h' | '24h' | '7d';
}): Promise<BagsApiTokenList> {
  const searchParams = new URLSearchParams();
  searchParams.set('sort', 'volume');
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.timeFrame) searchParams.set('timeFrame', params.timeFrame);

  return bagsApiFetch<BagsApiTokenList>(`/tokens?${searchParams.toString()}`);
}

export { BagsApiError };
