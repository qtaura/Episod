import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@episod.app' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@episod.app'
    }
  });

  const show = await prisma.show.upsert({
    where: { tmdbId: 1399 },
    update: {},
    create: {
      tmdbId: 1399,
      title: 'Game of Thrones',
      posterPath: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg'
    }
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      showId: show.id,
      rating: 8.5,
      content: 'Strong characters and high production value. Great baseline for Episod seed data.',
      wordCount: 13,
      metrics: { create: { likes: 0, comments: 0, views: 0, score: 0 } }
    }
  });
}

main().finally(() => prisma.$disconnect());
