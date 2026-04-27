import { Review, User, ReviewMetrics, Show } from '@prisma/client';

export type CreateReviewData = {
  userId: string;
  rating: number;
  content: string;
  isRewatch?: boolean;
  watchedAt?: string | Date;
  show: {
    tmdbId: number;
    title: string;
    posterPath?: string | null;
  };
};

export type LikeData = {
  userId: string;
  reviewId: string;
};

export type ReviewWithMetrics = Review & { metrics: ReviewMetrics | null };

export type UserProfile = User & { reviews: ReviewWithMetrics[] };

export type FeedReview = Review & {
  user: User;
  show: Show;
  metrics: ReviewMetrics | null;
  score: number;
};
