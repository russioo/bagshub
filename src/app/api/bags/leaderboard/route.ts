import { NextRequest, NextResponse } from 'next/server';
import bagsAPI from '@/lib/bags-api';

// GET /api/bags/leaderboard - Get leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'gainers' | 'losers' | 'volume' | 'newest' | 'holders' || 'gainers';
    const limit = parseInt(searchParams.get('limit') || '20');

    const tokens = await bagsAPI.getLeaderboard(type, limit);
    
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
