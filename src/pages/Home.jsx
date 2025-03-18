import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top anime from Jikan API
  useEffect(() => {
    async function fetchFeaturedAnime() {
      try {
        const res = await axios.get("https://api.jikan.moe/v4/top/anime?limit=8");
        setFeaturedAnime(res.data.data);
      } catch (err) {
        setError("Failed to load anime.");
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedAnime();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="relative z-20 container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 text-transparent bg-clip-text">
            Discover Amazing Anime
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Your ultimate destination for exploring and tracking your favorite anime series and movies.
          </p>
          <Link 
            to="/search" 
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20"
          >
            Start Exploring
          </Link>
        </div>
        <div className="h-96 bg-indigo-900 bg-opacity-50 relative">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1200/500')] bg-cover bg-center opacity-30"></div>
        </div>
      </div>

      {/* Featured Anime Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Anime</h2>

        {loading && <p className="text-center text-gray-400">Loading anime...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredAnime.map((anime) => (
              <Link 
                to={`/anime/${anime.mal_id}`} 
                key={anime.mal_id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-indigo-500/20"
              >
                <div className="h-64 bg-gray-700 relative">
                  <img 
                    src={anime.images.jpg.image_url} 
                    alt={anime.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{anime.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link 
            to="/search" 
            className="text-indigo-300 hover:text-indigo-200 font-medium inline-flex items-center gap-1"
          >
            View more anime
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
