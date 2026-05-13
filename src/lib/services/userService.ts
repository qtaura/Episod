import { prisma } from '../db';

const publicUserSelect = {
  id: true,
  username: true,
  email: true,
  createdAt: true
} as const;

export const getUserProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...publicUserSelect,
      reviews: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          show: true,
          metrics: true
        }
      }
    }
  });
};
