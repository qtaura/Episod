import { NextRequest, NextResponse } from 'next/server';
import { likeReview } from '@/lib/services/likeService';
import { likeSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = likeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    // Prevent users from liking their own reviews
    // const review = await prisma.review.findUnique({ where: { id: validation.data.reviewId } });
    // if (review?.userId === validation.data.userId) {
    //   return NextResponse.json({ message: 'You cannot like your own review' }, { status: 403 });
    // }

    const like = await likeReview(validation.data);
    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    // Handle unique constraint violation (user already liked the review)
    // if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    //   return NextResponse.json({ message: 'You have already liked this review' }, { status: 409 });
    // }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
