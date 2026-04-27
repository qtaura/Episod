import { Review, User } from '@prisma/client';

export type CreateReviewData = {
  userId: string;
  showId: string;
  rating: number;
  content: string;
};

export type LikeData = {
  userId: string;
  reviewId: string;
};

export type UserProfile = User & { reviews: Review[] };
