import { prisma } from '../db';
import { LikeData } from '../types';

export const likeReview = async (data: LikeData) => {
  // Use an upsert to handle cases where the like might already exist,
  // though the unique constraint in the schema also prevents duplicates.
  // This approach can be extended to handle un-liking.
  return prisma.like.create({
    data,
  });
};
