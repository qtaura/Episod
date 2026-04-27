import { z } from 'zod';

export const createReviewSchema = z.object({
  userId: z.string().cuid(),
  showId: z.string().cuid(),
  rating: z.number().min(0).max(10),
  content: z.string().min(1),
});

export const likeSchema = z.object({
  userId: z.string().cuid(),
  reviewId: z.string().cuid(),
});
