import { z } from 'zod';

export const createReviewSchema = z.object({
  userId: z.string().cuid(),
  rating: z.number().min(0).max(10),
  content: z.string().min(10, { message: 'Review must be at least 10 characters long' }),
  isRewatch: z.boolean().optional(),
  watchedAt: z.string().datetime().optional(),
  show: z.object({
    tmdbId: z.number(),
    title: z.string(),
    posterPath: z.string().nullable().optional(),
  }),
});

export const likeSchema = z.object({
  userId: z.string().cuid(),
  reviewId: z.string().cuid(),
});
