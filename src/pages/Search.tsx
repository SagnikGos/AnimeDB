import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search as SearchIcon, 
  Loader2, 
  Star, 
  BookOpen,
  Calendar,
  RefreshCw,
  ArrowRight,
  Users,
  PlayCircle,
  Sparkles
} from "lucide-react";

// shadcn components
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`);
      setResults(res.data.data);
      
      if (res.data.data.length === 0) {
        setError("No results found. Try a different search term.");
      } else {
        // Scroll to results after a brief delay
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 500);
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

  const placeholderExamples = [
    "Naruto",
    "Attack on Titan",
    "My Hero Academia",
    "One Piece"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-x-hidden pb-24">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-[#0a0a0f] to-[#0a0a0f] z-0"></div>
        <div className="absolute inset-0 bg-[url('https://svgur.com/i/15kq.svg')] opacity-5 z-0"></div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-4 bg-indigo-800/30 text-indigo-300 border-indigo-500/30 backdrop-blur-sm px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" /> Discover Anime
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white">
              Find Your Next Favorite Anime
            </h1>
            
            <p className="text-lg text-gray-300 mb-8">
              Search from thousands of titles to find exactly what you're looking for.
            </p>
            
            <div className="bg-[#161620]/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl max-w-2xl mx-auto">
              <div className="flex items-center gap-3 bg-[#1a1a25] border border-gray-700 rounded-full pl-5 pr-1 py-1 mb-4">
                <SearchIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Try "${placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)]}"`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-white flex-1 focus:outline-none py-2"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 rounded-full"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <span>Search</span>
                  )}
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="text-gray-500">Popular searches:</span>
                {["Action", "Romance", "Fantasy", "Sci-Fi"].map((term) => (
                  <Button 
                    key={term}
                    variant="ghost" 
                    size="sm"
                    className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 rounded-full h-auto py-1 px-3"
                    onClick={() => {
                      setQuery(term);
                      handleSearch();
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div ref={resultsRef} className="container mx-auto px-4 mt-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto text-center bg-red-950/20 border border-red-900/30 rounded-lg p-6 mb-12"
          >
            <div className="text-4xl mb-4">😕</div>
            <p className="text-red-300 mb-4">{error}</p>
            <Button 
              onClick={() => setError(null)}
              variant="destructive"
              className="bg-red-900/40 hover:bg-red-800/50 text-red-100"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {loading && !error && (
          <div className="my-16">
            <div className="text-center mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="inline-block text-indigo-500 mb-4"
              >
                <RefreshCw size={48} />
              </motion.div>
              <h2 className="text-2xl font-semibold text-white">Searching anime titles...</h2>
              <p className="text-gray-400 mt-2">This might take a moment</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="bg-[#161620] border-[#27273b] overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <Skeleton className="absolute inset-0" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mt-2" />
                    <Skeleton className="h-3 w-1/2 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="mt-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 text-transparent bg-clip-text">
                  Search Results
                </h2>
                
                <p className="text-gray-400">
                  Showing {results.length} results for "{query}"
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {results.map((anime, index) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Link to={`/anime/${anime.mal_id}`} className="block h-full">
                      <Card className="bg-[#161620] border-[#27273b] overflow-hidden h-full flex flex-col group">
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <img 
                            src={anime.images.jpg.image_url} 
                            alt={anime.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <Button size="sm" variant="ghost" className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full w-full">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                          <div className="absolute top-2 right-2">
                            {anime.score && (
                              <Badge className="bg-black/60 backdrop-blur-sm text-yellow-400 border-none">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                {anime.score.toFixed(1)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <CardContent className="p-4 flex-grow flex flex-col">
                          <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors text-lg line-clamp-2">
                            {anime.title}
                          </h3>
                          
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {anime.genres?.slice(0, 2).map(genre => (
                              <Badge key={genre.mal_id} variant="secondary" className="bg-[#232330] text-gray-300 text-xs">
                                {genre.name}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="mt-2 text-sm text-gray-400 space-y-1">
                            {anime.episodes && (
                              <div className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {anime.episodes} episodes
                              </div>
                            )}
                            {anime.year && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {anime.year}
                              </div>
                            )}
                            {anime.members && (
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {(anime.members > 1000000) 
                                  ? (anime.members / 1000000).toFixed(1) + 'M' 
                                  : (anime.members > 1000)
                                    ? (anime.members / 1000).toFixed(0) + 'K'
                                    : anime.members} members
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 flex-grow">
                            <p className="text-sm text-gray-400 line-clamp-3">
                              {anime.synopsis || "No synopsis available."}
                            </p>
                          </div>
                          
                          <div className="flex justify-end mt-3">
                            <Button 
                              variant="link" 
                              className="text-indigo-400 hover:text-indigo-300 p-0 h-auto self-end"
                              asChild
                            >
                              <span className="flex items-center">
                                View details
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {results.length > 0 && (
        <section className="container mx-auto px-4 mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-blue-900"
          >
            <div className="absolute inset-0 bg-[url('https://svgur.com/i/15kq.svg')] opacity-5"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-10 md:py-16">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Looking for personalized suggestions?</h2>
                <p className="text-indigo-200 max-w-md">
                  Try our AI recommendation tool for anime suggestions tailored to your preferences.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  onClick={() => window.location.href = '/suggest'}
                  size="lg" 
                  className="rounded-full bg-white text-indigo-900 hover:bg-gray-100"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Recommendations
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}