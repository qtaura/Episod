import { NextRequest, NextResponse } from 'next/server';
import { getFeed } from '@/lib/services/feedService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Safely parse and apply constraints to pagination parameters.
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);

    const page = Math.max(1, rawPage);
    const limit = Math.min(Math.max(1, rawLimit), 50); // Min 1, Max 50

    const feed = await getFeed({ page, limit });

    return NextResponse.json(feed);
  } catch (error) {
    console.error('Feed generation error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
