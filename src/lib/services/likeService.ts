import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { LikeData } from '../types';

export const likeReview = async (data: LikeData) => {
  try {
    return await prisma.like.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return null;
    }
    throw error;
  }
};
