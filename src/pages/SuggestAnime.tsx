import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAnimeRecommendations, getAnimeDetails } from "../lib/utils";

// shadcn components
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import {
  PlayCircle,
  Search,
  Star,
  Sparkles,
  RefreshCw,
  BookOpen,
  ArrowRight,
  Calendar,
  Users
} from "lucide-react";

// Types
interface AnimeDetails {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
    };
  };
  score: number | null;
  episodes: number | null;
  synopsis?: string;
  genres?: { name: string }[];
  year?: number;
  members?: number;
  status?: string;
}

export default function SuggestAnime() {
  const [userPrompt, setUserPrompt] = useState("");
  const [animeList, setAnimeList] = useState<AnimeDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async () => {
    if (!userPrompt.trim()) {
      setError("Please describe what kind of anime you're looking for");
      return;
    }

    setLoading(true);
    setAnimeList([]);
    setError(null);
    
    try {
      const recommendations = await getAnimeRecommendations(userPrompt);
      
      if (!recommendations || recommendations.length === 0) {
        setError("No recommendations found. Try adjusting your description.");
        setLoading(false);
        return;
      }
      
      const animeDetails = await Promise.all(
        recommendations.map((title: string) => getAnimeDetails(title))
      );

      const filteredResults = animeDetails.filter(Boolean) as AnimeDetails[]; 
      setAnimeList(filteredResults);
      
      if (filteredResults.length === 0) {
        setError("Couldn't find details for the recommended anime. Please try again.");
      } else {
        // Scroll to results after a brief delay
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    } catch (err) {
      setError("An error occurred while fetching recommendations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const placeholderExamples = [
    "A dark fantasy with philosophical themes and complex characters",
    "Something lighthearted with comedy and romance for beginners",
    "An action-packed series with strategic battles and plot twists",
    "A sci-fi anime with deep worldbuilding and political intrigue"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-x-hidden pb-24">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-[#0a0a0f] to-[#0a0a0f] z-0"></div>
        <div className="absolute inset-0 bg-[url('https://svgur.com/i/15kq.svg')] opacity-5 z-0"></div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-4 bg-purple-800/30 text-purple-300 border-purple-500/30 backdrop-blur-sm px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" /> AI-Powered Recommendations
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white">
              Discover Your Perfect Anime
            </h1>
            
            <p className="text-lg text-gray-300 mb-8">
              Describe your preferences, mood, or interests, and our AI will find the perfect anime matches for you.
            </p>
            
            <div className="bg-[#161620]/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl max-w-2xl mx-auto">
              <Textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder={placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)]}
                className="bg-[#1a1a25] border-gray-700 text-white placeholder:text-gray-500 resize-none mb-4 min-h-[120px]"
              />
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={fetchSuggestions}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-500 rounded-full px-6 w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Finding Anime...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Get Suggestions
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => setUserPrompt("")}
                  variant="outline" 
                  className="border-gray-700 bg-[#161620]/40 text-white hover:bg-[#161620] rounded-full w-full sm:w-auto"
                >
                  Clear Input
                </Button>
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
                className="inline-block text-purple-500 mb-4"
              >
                <RefreshCw size={48} />
              </motion.div>
              <h2 className="text-2xl font-semibold text-white">Discovering perfect anime for you...</h2>
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

        {animeList.length > 0 && !loading && (
          <div className="mt-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Your Recommendations
                </h2>
                
                <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={fetchSuggestions}>
                  Refresh
                  <RefreshCw className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 mt-2">
                Based on: "{userPrompt}"
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {animeList.map((anime, index) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Card className="bg-[#161620] border-[#27273b] overflow-hidden h-full flex flex-col">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img 
                          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
                          alt={anime.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <Button size="sm" variant="ghost" className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full w-full">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Watch
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2">
                          {anime.score && (
                            <Badge className="bg-black/60 backdrop-blur-sm text-yellow-400 border-none">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {anime.score}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className="p-4 flex-grow flex flex-col">
                        <h3 className="font-medium text-white hover:text-purple-400 transition-colors text-lg">
                          {anime.title}
                        </h3>
                        
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {anime.genres?.slice(0, 2).map(genre => (
                            <Badge key={genre.name} variant="secondary" className="bg-[#232330] text-gray-300 text-xs">
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
                        
                        <p className="text-sm text-gray-400 mt-3 line-clamp-3 flex-grow">
                          {anime.synopsis || "No synopsis available."}
                        </p>
                        
                        <Button 
                          variant="link" 
                          className="text-purple-400 hover:text-purple-300 p-0 h-auto mt-2 self-start"
                          asChild
                        >
                          <a href={`/anime/${anime.mal_id}`} >
                            More details
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {animeList.length > 0 && (
        <section className="container mx-auto px-4 mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900"
          >
            <div className="absolute inset-0 bg-[url('https://svgur.com/i/15kq.svg')] opacity-5"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-10 md:py-16">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Want more specific anime?</h2>
                <p className="text-purple-200 max-w-md">
                  Try describing exactly what you're looking for, including genres, themes, or similar shows you've enjoyed.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => {
                      document.querySelector('textarea')?.focus();
                    }, 800);
                  }}
                  size="lg" 
                  className="rounded-full bg-white text-purple-900 hover:bg-gray-100"
                >
                  <Search className="mr-2 h-5 w-5" />
                  New Search
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}