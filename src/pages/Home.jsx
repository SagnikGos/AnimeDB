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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-indigo-950 text-gray-900 dark:text-white snap-y snap-mandatory">
      {/* Hero Section */}
      <section className="relative overflow-hidden snap-start">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 z-10"></div>
        <div className="relative z-20 container mx-auto px-4 py-24 text-center animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 text-transparent bg-clip-text">
            Discover Amazing Anime
          </h1>
          <p className="text-xl text-indigo-100 dark:text-indigo-200 max-w-2xl mx-auto mb-8 font-light">
            Your ultimate destination for exploring and tracking your favorite anime series and movies.
          </p>
          <Link 
            to="/search" 
            className="px-8 py-4 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-medium rounded-full inline-flex items-center gap-2 transition-all shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1"
          >
            <span>Start Exploring</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-indigo-500/20 to-transparent"></div>
          <div className="animate-float bg-[url('https://svgur.com/i/15kq.svg')] opacity-10 w-full h-full bg-repeat"></div>
        </div>
      </section>

      {/* Featured Anime Section */}
      <section className="container mx-auto px-4 py-16 snap-start">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-300 to-purple-300 text-transparent bg-clip-text">
          Featured Anime
        </h2>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-700/30"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto text-center bg-red-900/20 p-6 rounded-xl">
            <div className="text-4xl mb-4">😞</div>
            <p className="text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-700/30 hover:bg-red-600/40 text-red-100 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          // Marquee container: duplicate items for seamless horizontal animation
          <div className="relative overflow-hidden py-4">
            <div className="flex gap-6 animate-marquee whitespace-nowrap">
              {featuredAnime.concat(featuredAnime).map((anime, index) => (
                <Link 
                  to={`/anime/${anime.mal_id}`} 
                  key={`${anime.mal_id}-${index}`}
                  className="group bg-gray-800/50 rounded-xl overflow-hidden shadow-xl hover:shadow-indigo-500/20 transition-transform duration-300 transform hover:-translate-y-2 min-w-[250px]"
                >
                  <div className="h-64 bg-gray-700 relative overflow-hidden">
                    <img 
                      src={anime.images.jpg.image_url} 
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-sm font-medium">{anime.score || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 leading-snug">{anime.title}</h3>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-1">
                      {anime.episodes ? `${anime.episodes} eps` : 'TBA'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            to="/search" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600/30 dark:bg-indigo-500/30 hover:bg-indigo-600/40 dark:hover:bg-indigo-500/40 text-indigo-100 rounded-full transition-colors group"
          >
            <span>View All Anime</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Inline Styles for Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
