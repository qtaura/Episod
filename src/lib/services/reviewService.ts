import { prisma } from '../db';
import { CreateReviewData } from '../types';

export const createReview = async (data: CreateReviewData) => {
  const wordCount = data.content.split(/\s+/).filter(Boolean).length;

  return prisma.review.create({
    data: {
      ...data,
      wordCount,
      metrics: {
        create: {},
      },
    },
    include: {
      metrics: true,
    },
  });
};

export const getReviews = async () => {
  return prisma.review.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      show: true,
      likes: true,
      comments: true,
      metrics: true,
    },
  });
};
