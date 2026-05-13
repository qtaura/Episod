import { NextRequest, NextResponse } from 'next/server';
import { createReview, getReviews } from '@/lib/services/reviewService';
import { createReviewSchema } from '@/lib/validation';
import { getAuthedUserId } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthedUserId();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validation = createReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const review = await createReview(userId, validation.data);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
