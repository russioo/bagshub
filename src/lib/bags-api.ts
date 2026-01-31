/**
 * Bags API Client
 * https://docs.bags.fm/
 */

const BAGS_API = 'https://public-api-v2.bags.fm/api/v1';

interface BagsConfig {
  apiKey?: string;
}

class BagsAPI {
  private apiKey?: string;

  constructor(config?: BagsConfig) {
    this.apiKey = config?.apiKey || process.env.BAGS_API_KEY;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    const res = await fetch(`${BAGS_API}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (!res.ok) {
      throw new Error(`Bags API error: ${res.status}`);
    }

    return res.json();
  }

  // Get trade quote
  async getQuote(params: {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageMode?: 'auto' | 'manual';
    slippageBps?: number;
  }) {
    const query = new URLSearchParams({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount.toString(),
      slippageMode: params.slippageMode || 'auto',
    });
    
    if (params.slippageBps) {
      query.set('slippageBps', params.slippageBps.toString());
    }

    return this.fetch(`/trade/quote?${query}`);
  }

  // Create token - Step 1: Create metadata
  async createTokenInfo(data: {
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
  }) {
    return this.fetch('/tokens/info', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Create token - Step 2: Create launch transaction
  async createTokenLaunchTx(params: {
    creator: string;
    name: string;
    symbol: string;
    uri: string;
    initialBuyAmount?: number;
  }) {
    return this.fetch('/tokens/launch', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Create swap transaction
  async createSwapTx(params: {
    quoteResponse: any;
    userPublicKey: string;
  }) {
    return this.fetch('/trade/swap', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Get token creators
  async getTokenCreators(mint: string) {
    return this.fetch(`/analytics/creators?mint=${mint}`);
  }

  // Get token lifetime fees
  async getTokenFees(mint: string) {
    return this.fetch(`/analytics/fees?mint=${mint}`);
  }
}

export const bags = new BagsAPI();
export default BagsAPI;
