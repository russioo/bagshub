import { NextRequest, NextResponse } from 'next/server';
import { 
  searchTokens, 
  getTopByVolume, 
  getTopGainers, 
  getTopLosers,
  getLatestTokens,
  pairToBagsToken 
} from '@/lib/dexscreener';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'trending';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || undefined;

    let tokens;

    // Search query takes priority
    if (search) {
      const pairs = await searchTokens(search);
      tokens = pairs.slice(0, limit).map(pairToBagsToken);
    } else {
      switch (type) {
        case 'trending':
        case 'volume':
          tokens = await getTopByVolume(limit);
          break;
        case 'gainers':
          tokens = await getTopGainers(limit);
          break;
        case 'losers':
          tokens = await getTopLosers(limit);
          break;
        case 'new':
          const latestPairs = await getLatestTokens();
          tokens = latestPairs.map(pairToBagsToken).slice(0, limit);
          break;
        default:
          tokens = await getTopByVolume(limit);
      }
    }

    return NextResponse.json({
      success: true,
      data: { tokens },
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}
