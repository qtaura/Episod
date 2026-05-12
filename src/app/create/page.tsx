'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

type TmdbResult = {
  id: number;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  title?: string; // For movies
  name?: string; // For TV shows
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
};

export default function CreateReviewPage() {
  const router = useRouter();

  // Form state
  const [rating, setRating] = useState<number | ''>(5);
  const [content, setContent] = useState('');
  const [isRewatch, setIsRewatch] = useState(false);
  const [spoiler, setSpoiler] = useState(false);
  const [watchedAt, setWatchedAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TmdbResult[]>([]);
  const [selectedShow, setSelectedShow] = useState<TmdbResult | null>(null);

  // Effect to fetch search results from TMDb
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const fetchShows = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        const filteredResults = data.results.filter(
          (r: any) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path
        );
        setSearchResults(filteredResults.slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch from TMDb', err);
      }
    };

    // Basic debounce
    const handler = setTimeout(() => {
      fetchShows();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSelectShow = (show: TmdbResult) => {
    setSelectedShow(show);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!selectedShow) {
      setError('You must select a show.');
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
      const body = {
                rating: Number(rating),
        content,
        isRewatch,
        spoiler,
        watchedAt: watchedAt ? new Date(watchedAt).toISOString() : undefined,
        show: {
          tmdbId: selectedShow.id,
          title: selectedShow.title || selectedShow.name!,
          posterPath: selectedShow.poster_path,
        },
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create review');
      }

      router.push('/');
      router.refresh();

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
        
        {/* Show Search and Selection */}
        <div className="relative">
          <label htmlFor="showSearch" className="block text-sm font-medium text-gray-700 mb-1">Search for a Show or Movie</label>
          {!selectedShow ? (
            <input
              id="showSearch"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., The Office, Dune..."
              required={!selectedShow}
            />
          ) : (
            <div className="flex items-center justify-between p-2 border border-green-300 bg-green-50 rounded-md">
              <p className="font-semibold text-green-800">{selectedShow.title || selectedShow.name}</p>
              <button type="button" onClick={() => setSelectedShow(null)} className="text-sm font-semibold text-red-600 hover:text-red-800">Change</button>
            </div>
          )}
          {searchResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((show) => (
                <li key={show.id} onClick={() => handleSelectShow(show)} className="p-3 hover:bg-gray-100 cursor-pointer flex items-center">
                  <img src={`https://image.tmdb.org/t/p/w92${show.poster_path}`} alt="" className="w-10 h-14 object-cover rounded-sm mr-4" loading="lazy" />
                  <div>
                    <p className="font-semibold">{show.title || show.name}</p>
                    <p className="text-sm text-gray-500">{show.release_date?.substring(0,4) || show.first_air_date?.substring(0,4)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rest of the form */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0-10)</label>
          <input id="rating" type="number" value={rating} onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))} min="0" max="10" step="0.5" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="What did you think?" required></textarea>
        </div>

        <div>
          <label htmlFor="watchedAt" className="block text-sm font-medium text-gray-700 mb-1">Watched At (Optional)</label>
          <input id="watchedAt" type="date" value={watchedAt} onChange={(e) => setWatchedAt(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>

        <div className="flex items-center">
          <input id="isRewatch" type="checkbox" checked={isRewatch} onChange={(e) => setIsRewatch(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <label htmlFor="isRewatch" className="ml-2 block text-sm text-gray-900">This is a rewatch</label>
        </div>

        <div className="flex items-center">
          <input id="spoiler" type="checkbox" checked={spoiler} onChange={(e) => setSpoiler(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <label htmlFor="spoiler" className="ml-2 block text-sm text-gray-900">Contains spoilers</label>
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
