import { FeedReview } from '@/lib/types';

async function getFeed(): Promise<FeedReview[]> {
  try {
    // Use a relative URL for server-side fetching in Next.js.
    // It's simpler and avoids issues with domain resolution during the build process.
    const res = await fetch('/api/feed', {
      cache: 'no-store', // Ensure fresh data on every request
    });

    if (!res.ok) {
      console.error('Failed to fetch feed', res.status, res.statusText);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('An error occurred while fetching the feed:', error);
    return [];
  }
}

export default async function HomePage() {
  const feed = await getFeed();

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Episod Feed</h1>
      <div className="space-y-6">
        {feed.map(review => (
          <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-800">@{review.user.username}</p>
              <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">{review.show.title}</h2>
              <p className="text-lg text-yellow-500 font-bold">{review.rating.toFixed(1)} / 10</p>
            </div>
            <p className="text-gray-700 leading-relaxed">{review.content}</p>
          </div>
        ))}
        {feed.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">The feed is currently empty.</p>
          </div>
        )}
      </div>
    </main>
  );
}
