import { Review, User, ReviewMetrics, Show } from '@prisma/client';

export type PublicUser = Pick<User, 'id' | 'username' | 'email' | 'createdAt'>;

export type CreateReviewData = {
  rating: number;
  content: string;
  isRewatch?: boolean;
  spoiler?: boolean;
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

export type UserProfile = PublicUser & { reviews: (Review & { metrics: ReviewMetrics | null; show: Show })[] };

export type FeedReview = Review & {
  user: PublicUser;
  show: Show;
  metrics: ReviewMetrics | null;
  score: number;
};
