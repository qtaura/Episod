import { describe, it, expect } from 'vitest';
import { createReviewSchema } from '@/lib/validation';

describe('createReviewSchema', () => {
  it('accepts valid payload', () => {
    const result = createReviewSchema.safeParse({
      rating: 8,
      content: 'This is long enough content',
      show: { tmdbId: 1, title: 'Test' }
    });
    expect(result.success).toBe(true);
  });
});
