import { NextRequest, NextResponse } from 'next/server';
import { likeReview } from '@/lib/services/likeService';
import { likeSchema } from '@/lib/validation';
import { getAuthedUserId } from '@/lib/session';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { logApiEvent } from '@/lib/observability';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'local';
    if (!checkRateLimit(ip, 30, 60_000)) {
      return NextResponse.json({ message: 'Too Many Requests' }, { status: 429 });
    }

    const userId = await getAuthedUserId();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validation = likeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const review = await prisma.review.findUnique({ where: { id: validation.data.reviewId } });
    if (!review) return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    if (review.userId === userId) {
      return NextResponse.json({ message: 'You cannot like your own review' }, { status: 403 });
    }

    const like = await likeReview({ userId, reviewId: validation.data.reviewId });
    if (!like) return NextResponse.json({ message: 'Already liked' }, { status: 409 });

    logApiEvent('review_liked', { userId, reviewId: validation.data.reviewId });
    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
