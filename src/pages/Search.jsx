import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search as SearchIcon, Loader2 } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`);
      setResults(res.data.data);
      if (res.data.data.length === 0) {
        setError("No results found. Try a different search term.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch anime. Please try again later.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold mb-6 text-center">Find Your Next Favorite Anime</h1>
          
          <div className="bg-gray-800 p-1 rounded-full flex items-center">
            <input
              type="text"
              placeholder="Search anime titles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-white px-4 py-3 flex-1 focus:outline-none"
            />
            <button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <SearchIcon size={20} />}
              <span>Search</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-12">
            <Loader2 size={40} className="animate-spin text-indigo-400" />
          </div>
        )}

        {error && (
          <div className="text-center my-12 text-red-400">
            <p>{error}</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((anime) => (
              <Link 
                to={`/anime/${anime.mal_id}`} 
                key={anime.mal_id} 
                className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-700">
                  <img 
                    src={anime.images.jpg.image_url} 
                    alt={anime.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500 text-xs text-black font-bold px-2 py-1 rounded">
                        {anime.score ? anime.score.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-xs bg-indigo-600 px-2 py-1 rounded">
                        {anime.type || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-center line-clamp-2">{anime.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="text-center mt-8 text-gray-400">
            <p>Showing {results.length} results for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}