import { NextRequest, NextResponse } from 'next/server';
import bagsAPI from '@/lib/bags-api';

// GET /api/bags/search - Search tokens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query.trim()) {
      return NextResponse.json({ tokens: [] });
    }

    const tokens = await bagsAPI.searchTokens(query, limit);
    
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error searching tokens:', error);
    return NextResponse.json(
      { error: 'Failed to search tokens' },
      { status: 500 }
    );
  }
}
