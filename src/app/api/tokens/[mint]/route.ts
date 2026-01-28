import { NextRequest, NextResponse } from 'next/server';
import { getTokenPairs, pairToBagsToken } from '@/lib/dexscreener';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  try {
    const { mint } = await params;

    // Get token pairs from DexScreener
    const pairs = await getTokenPairs(mint);
    
    if (!pairs || pairs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Token not found' },
        { status: 404 }
      );
    }

    // Use the first pair (highest liquidity usually)
    const pair = pairs[0];
    const token = pairToBagsToken(pair);

    // Add extra data from the pair
    const result = {
      token,
      pairs: pairs.map(p => ({
        pairAddress: p.pairAddress,
        dexId: p.dexId,
        liquidity: p.liquidity?.usd || 0,
        volume24h: p.volume?.h24 || 0,
        url: p.url,
      })),
      txns: pair.txns,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching token:', error);

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch token' },
      { status: 500 }
    );
  }
}
