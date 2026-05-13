import { prisma } from '../db';
import { FeedReview } from '../types';

type FeedOptions = {
  page?: number;
  limit?: number;
};

const publicUserSelect = {
  id: true,
  username: true,
  email: true,
  createdAt: true
} as const;

// V1: Fetches a batch of recent reviews, then ranks and paginates in-memory.
export const getFeed = async (options: FeedOptions = {}): Promise<FeedReview[]> => {
  const { page = 1, limit = 20 } = options;

  const recentReviews = await prisma.review.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 200,
    include: {
      user: {
        select: publicUserSelect
      },
      show: true,
      metrics: true
    }
  });

  const scoredReviews = recentReviews.map((review) => {
    const score = (review.metrics?.likes ?? 0) * 3 + (review.metrics?.comments ?? 0) * 5 + review.wordCount / 50;
    return { ...review, score };
  });

  scoredReviews.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const startIndex = (page - 1) * limit;
  return scoredReviews.slice(startIndex, startIndex + limit);
};
