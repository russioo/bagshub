import { NextRequest, NextResponse } from 'next/server';
import bagsAPI from '@/lib/bags-api';

// GET /api/bags/tokens/[mint] - Get token details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  try {
    const { mint } = await params;
    const data = await bagsAPI.getToken(mint);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token' },
      { status: 500 }
    );
  }
}
