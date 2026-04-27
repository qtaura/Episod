import { Review, User, ReviewMetrics } from '@prisma/client';

export type CreateReviewData = {
  userId: string;
  showId: string;
  rating: number;
  content: string;
  isRewatch?: boolean;
  watchedAt?: string | Date;
};

export type LikeData = {
  userId: string;
  reviewId: string;
};

export type ReviewWithMetrics = Review & { metrics: ReviewMetrics | null };

export type UserProfile = User & { reviews: ReviewWithMetrics[] };
