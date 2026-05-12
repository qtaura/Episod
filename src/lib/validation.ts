import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().min(0).max(10),
  content: z.string().min(10, { message: 'Review must be at least 10 characters long' }),
  isRewatch: z.boolean().optional(),
  spoiler: z.boolean().optional(),
  watchedAt: z.string().datetime().optional(),
  show: z.object({
    tmdbId: z.number(),
    title: z.string(),
    posterPath: z.string().nullable().optional()
  })
});

export const likeSchema = z.object({
  reviewId: z.string().cuid()
});
