import { NextRequest, NextResponse } from 'next/server';
import bagsAPI from '@/lib/bags-api';

// GET /api/bags/tokens - Get all tokens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sort = searchParams.get('sort') || 'volume';

    const data = await bagsAPI.getTokens(page, limit, sort);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}
