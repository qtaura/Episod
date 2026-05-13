import { prisma } from '../db';
import { CreateReviewData } from '../types';

const publicUserSelect = {
  id: true,
  username: true,
  email: true,
  createdAt: true
} as const;

export const createReview = async (userId: string, data: CreateReviewData) => {
  const { rating, content, isRewatch, spoiler, watchedAt, show } = data;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return prisma.review.create({
    data: {
      rating,
      content,
      wordCount,
      isRewatch,
      spoiler,
      watchedAt: watchedAt ? new Date(watchedAt) : null,
      user: {
        connect: { id: userId }
      },
      show: {
        connectOrCreate: {
          where: { tmdbId: show.tmdbId },
          create: {
            tmdbId: show.tmdbId,
            title: show.title,
            posterPath: show.posterPath
          }
        }
      },
      metrics: {
        create: {}
      }
    },
    include: {
      metrics: true,
      show: true,
      user: {
        select: publicUserSelect
      }
    }
  });
};

export const getReviews = async () => {
  return prisma.review.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: publicUserSelect
      },
      show: true,
      likes: true,
      comments: true,
      metrics: true
    }
  });
};
