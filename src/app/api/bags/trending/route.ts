import { NextRequest, NextResponse } from 'next/server';
import bagsAPI from '@/lib/bags-api';

// GET /api/bags/trending - Get trending tokens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const tokens = await bagsAPI.getTrendingTokens(limit);
    
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending tokens' },
      { status: 500 }
    );
  }
}
