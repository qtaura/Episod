'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateReviewPage() {
  const router = useRouter();
  const [showId, setShowId] = useState('');
  const [rating, setRating] = useState<number | ''>(5);
  const [content, setContent] = useState('');
  const [isRewatch, setIsRewatch] = useState(false);
  const [watchedAt, setWatchedAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple frontend validation
    if (!showId) {
      setError('Show ID is required.');
      return;
    }
    if (rating === '' || rating < 0 || rating > 10) {
      setError('Rating must be between 0 and 10.');
      return;
    }
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const body: any = {
        // In a real app, this would come from the authenticated user's session
        userId: 'clxko5gxr00001234567890ab', // Temporary hardcoded user ID
        showId,
        rating: Number(rating),
        content,
        isRewatch,
      };

      if (watchedAt) {
        body.watchedAt = new Date(watchedAt).toISOString();
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create review');
      }

      // On success, redirect to the homepage
      router.push('/');
      router.refresh(); // Recommended to ensure the new review appears

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Create Review</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg border border-gray-200">
        <div>
          <label htmlFor="showId" className="block text-sm font-medium text-gray-700 mb-1">Show ID (Temporary)</label>
          <input
            id="showId"
            type="text"
            value={showId}
            onChange={(e) => setShowId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., clyjf5o92000008l43n98b5rh"
            required
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0-10)</label>
          <input
            id="rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
            min="0"
            max="10"
            step="0.5"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="What did you think?"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="watchedAt" className="block text-sm font-medium text-gray-700 mb-1">Watched At (Optional)</label>
          <input
            id="watchedAt"
            type="date"
            value={watchedAt}
            onChange={(e) => setWatchedAt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            id="isRewatch"
            type="checkbox"
            checked={isRewatch}
            onChange={(e) => setIsRewatch(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isRewatch" className="ml-2 block text-sm text-gray-900">This is a rewatch</label>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </main>
  );
}
