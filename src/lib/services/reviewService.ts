import { prisma } from '../db';
import { CreateReviewData } from '../types';

export const createReview = async (data: CreateReviewData) => {
  const { userId, rating, content, isRewatch, watchedAt, show } = data;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return prisma.review.create({
    data: {
      rating,
      content,
      wordCount,
      isRewatch,
      watchedAt: watchedAt ? new Date(watchedAt) : null,
      user: {
        connect: { id: userId },
      },
      show: {
        connectOrCreate: {
          where: { tmdbId: show.tmdbId },
          create: {
            tmdbId: show.tmdbId,
            title: show.title,
            posterPath: show.posterPath,
          },
        },
      },
      metrics: {
        create: {},
      },
    },
    include: {
      metrics: true,
      show: true,
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
