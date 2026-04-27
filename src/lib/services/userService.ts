import { prisma } from '../db';

export const getUserProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      reviews: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          metrics: true,
        },
      },
    },
  });
};
