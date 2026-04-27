import { prisma } from '../db';
import { FeedReview } from '../types';

type FeedOptions = {
  page?: number;
  limit?: number;
};

// V1: Fetches a batch of recent reviews, then ranks and paginates in-memory.
// This is a pragmatic approach for an initial version.
export const getFeed = async (options: FeedOptions = {}): Promise<FeedReview[]> => {
  const { page = 1, limit = 20 } = options;

  // 1. Fetch a larger pool of recent reviews from the database.
  const recentReviews = await prisma.review.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 200, // Fetch the 200 most recent reviews to rank.
    include: {
      user: true,
      show: true,
      metrics: true,
    },
  });

  // 2. Calculate a score for each review in-memory.
  const scoredReviews = recentReviews.map(review => {
    const metrics = review.metrics;
    // The `metrics` relation can be null if a review was created before the metrics model was added.
    // In a future-proof system, this should always exist, and the score calculation would be even simpler.
    const score =
      (metrics?.likes ?? 0) * 3 +
      (metrics?.comments ?? 0) * 5 +
      (review.wordCount / 50);

    return {
      ...review,
      score, // Attach the transient score for sorting.
    };
  });

  // 3. Sort the reviews by the calculated score, then by creation date.
  scoredReviews.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score; // Primary sort: score descending
    }
    return b.createdAt.getTime() - a.createdAt.getTime(); // Secondary sort: date descending
  });

  // 4. Paginate the sorted results.
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return scoredReviews.slice(startIndex, endIndex);
};
