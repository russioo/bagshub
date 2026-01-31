import type { BagsToken, TokenListResponse, TokenDetailResponse, PricePoint, Transaction, Holder } from '@/types';

const BAGS_API_BASE = 'https://public-api-v2.bags.fm/api/v1';
const API_KEY = process.env.BAGS_API_KEY || '';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

class BagsAPI {
  private rateLimitRemaining = 1000;
  private rateLimitReset = Date.now();

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    // Check rate limit
    if (this.rateLimitRemaining <= 0 && Date.now() < this.rateLimitReset) {
      throw new Error('Rate limit exceeded. Please wait.');
    }

    const response = await fetch(`${BAGS_API_BASE}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Update rate limit info
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    if (remaining) this.rateLimitRemaining = parseInt(remaining);
    if (reset) this.rateLimitReset = parseInt(reset) * 1000;

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'API Error' }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // Get all tokens with pagination
  async getTokens(page = 1, limit = 50, sort = 'volume'): Promise<TokenListResponse> {
    return this.request<TokenListResponse>(
      `/tokens?page=${page}&limit=${limit}&sort=${sort}`
    );
  }

  // Get trending tokens
  async getTrendingTokens(limit = 20): Promise<BagsToken[]> {
    const data = await this.request<{ tokens: BagsToken[] }>(
      `/tokens/trending?limit=${limit}`
    );
    return data.tokens;
  }

  // Get token by mint address
  async getToken(mint: string): Promise<TokenDetailResponse> {
    return this.request<TokenDetailResponse>(`/tokens/${mint}`);
  }

  // Get token price history
  async getPriceHistory(mint: string, interval = '1h', limit = 100): Promise<PricePoint[]> {
    const data = await this.request<{ history: PricePoint[] }>(
      `/tokens/${mint}/price-history?interval=${interval}&limit=${limit}`
    );
    return data.history;
  }

  // Get token transactions
  async getTransactions(mint: string, limit = 50): Promise<Transaction[]> {
    const data = await this.request<{ transactions: Transaction[] }>(
      `/tokens/${mint}/transactions?limit=${limit}`
    );
    return data.transactions;
  }

  // Get token holders
  async getHolders(mint: string, limit = 20): Promise<Holder[]> {
    const data = await this.request<{ holders: Holder[] }>(
      `/tokens/${mint}/holders?limit=${limit}`
    );
    return data.holders;
  }

  // Search tokens
  async searchTokens(query: string, limit = 20): Promise<BagsToken[]> {
    const data = await this.request<{ tokens: BagsToken[] }>(
      `/tokens/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return data.tokens;
  }

  // Get leaderboard
  async getLeaderboard(
    type: 'gainers' | 'losers' | 'volume' | 'newest' | 'holders',
    limit = 20
  ): Promise<BagsToken[]> {
    const data = await this.request<{ tokens: BagsToken[] }>(
      `/tokens/leaderboard/${type}?limit=${limit}`
    );
    return data.tokens;
  }

  // Create token (requires auth)
  async createToken(tokenData: {
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    twitter?: string;
    website?: string;
    telegram?: string;
  }): Promise<{ mint: string; signature: string }> {
    return this.request('/tokens/create', {
      method: 'POST',
      body: tokenData,
    });
  }

  // Upload image for token
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BAGS_API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json();
  }

  // Get rate limit status
  getRateLimitStatus() {
    return {
      remaining: this.rateLimitRemaining,
      resetAt: new Date(this.rateLimitReset),
    };
  }
}

export const bagsAPI = new BagsAPI();
export default bagsAPI;
