import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// shadcn components
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

import {
  PlayCircle,
  Star,
  Calendar,
  Clock,
  Tag,
  Users,
  ChevronLeft,
  ExternalLink,
  Heart,
  Share2,
  BookOpen,
  Sparkles,
  RefreshCw,
  Search
} from "lucide-react";

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [similarAnime, setSimilarAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnime(res.data.data);
        
        // Fetch similar anime based on genre
        if (res.data.data.genres && res.data.data.genres.length > 0) {
          const primaryGenre = res.data.data.genres[0].mal_id;
          const similarRes = await axios.get(`https://api.jikan.moe/v4/anime?genres=${primaryGenre}&limit=6&order_by=popularity`);
          // Filter out the current anime
          const filtered = similarRes.data.data.filter(item => item.mal_id !== parseInt(id));
          setSimilarAnime(filtered.slice(0, 4)); // Limit to 4 similar anime
        }
      } catch (error) {
        console.error("Error fetching anime details:", error);
        setError("Failed to load anime details. Please try again later.");
      }
      setLoading(false);
    }
    
    fetchAnime();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="inline-block text-purple-500 mb-4"
          >
            <RefreshCw size={48} />
          </motion.div>
          <h2 className="text-2xl font-semibold text-white">Loading anime details...</h2>
          <p className="text-gray-400 mt-2">This might take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white p-8 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md mx-auto text-center bg-red-950/20 border border-red-900/30 rounded-lg p-6 mb-12"
        >
          <div className="text-4xl mb-4">😕</div>
          <p className="text-red-300 mb-4">{error}</p>
          <Button 
            onClick={() => window.history.back()}
            variant="destructive"
            className="bg-red-900/40 hover:bg-red-800/50 text-red-100"
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return anime ? (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-x-hidden pb-24">
      {/* Hero Banner */}
      <div className="relative min-h-[70vh] flex items-end">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15" 
          style={{ 
            backgroundImage: `url(${anime.images.jpg.large_image_url || anime.images.jpg.image_url})`,
            backgroundPosition: 'center 20%'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-purple-900/30"></div>
        <div className="absolute inset-0 bg-[url('https://svgur.com/i/15kq.svg')] opacity-5 z-0"></div>
        
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 relative pb-12 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:flex-row md:items-end gap-8"
          >
            {/* Anime Poster */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-64 md:w-72 shrink-0"
            >
              <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-purple-500/20">
                <img 
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
                  alt={anime.title} 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
            
            {/* Title and Core Info */}
            <div className="flex-1 text-center md:text-left">
              <Badge variant="outline" className="mb-4 bg-purple-800/30 text-purple-300 border-purple-500/30 backdrop-blur-sm px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" /> {anime.type || "TV"}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white">
                {anime.title}
              </h1>
              
              {anime.title_english && anime.title_english !== anime.title && (
                <h2 className="text-xl text-gray-400 mb-4">{anime.title_english}</h2>
              )}
              
              {/* Stats Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                {anime.score && (
                  <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                    <span className="font-bold text-yellow-300">{anime.score.toFixed(1)}</span>
                  </div>
                )}
                
                {anime.episodes && (
                  <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-400 mr-2" />
                    <span>{anime.episodes} episodes</span>
                  </div>
                )}
                
                {anime.aired?.prop?.from?.year && (
                  <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-400 mr-2" />
                    <span>{anime.aired.prop.from.year}</span>
                  </div>
                )}
                
                {anime.status && (
                  <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Tag className="h-5 w-5 text-purple-400 mr-2" />
                    <span>{anime.status}</span>
                  </div>
                )}
              </div>
              
              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 justify-center md:justify-start">
                  {anime.genres.map(genre => (
                    <Badge 
                      key={genre.mal_id}
                      className="bg-[#232330] text-gray-300 hover:bg-purple-900/50"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
                <Button className="bg-purple-600 hover:bg-purple-500 rounded-full px-6">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Now
                </Button>
                
                <Button variant="outline" className="border-gray-700 bg-[#161620]/40 text-white hover:bg-[#161620] rounded-full">
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Favorites
                </Button>
                
                <Button variant="outline" className="border-gray-700 bg-[#161620]/40 text-white hover:bg-[#161620] rounded-full">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={detailsRef} className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column - Synopsis and Trailer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            {/* Synopsis */}
            <Card className="bg-[#161620] border-[#27273b] overflow-hidden mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">
                  {anime.synopsis || 'No synopsis available.'}
                </p>
              </CardContent>
            </Card>
            
            {/* Trailer */}
            {anime.trailer?.embed_url && (
              <Card className="bg-[#161620] border-[#27273b] overflow-hidden mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-white">Trailer</h2>
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={anime.trailer.embed_url}
                      title={`${anime.title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Background Info */}
            {anime.background && (
              <Card className="bg-[#161620] border-[#27273b] overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-white">Background</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {anime.background}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
          
          {/* Side Column - Details and Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Detailed Information */}
            <Card className="bg-[#161620] border-[#27273b] overflow-hidden mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Information</h2>
                
                <div className="space-y-4">
                  {anime.type && (
                    <div className="flex items-start gap-3">
                      <Tag className="text-purple-400 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-gray-400 text-sm">Type</p>
                        <p className="text-white">{anime.type}</p>
                      </div>
                    </div>
                  )}
                  
                  {anime.episodes && (
                    <div className="flex items-start gap-3">
                      <BookOpen className="text-purple-400 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-gray-400 text-sm">Episodes</p>
                        <p className="text-white">{anime.episodes}</p>
                      </div>
                    </div>
                  )}
                  
                  {anime.duration && (
                    <div className="flex items-start gap-3">
                      <Clock className="text-purple-400 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-gray-400 text-sm">Duration</p>
                        <p className="text-white">{anime.duration}</p>
                      </div>
                    </div>
                  )}
                  
                  {anime.aired?.string && (
                    <div className="flex items-start gap-3">
                      <Calendar className="text-purple-400 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-gray-400 text-sm">Aired</p>
                        <p className="text-white">{anime.aired.string}</p>
                      </div>
                    </div>
                  )}
                  
                  {anime.status && (
                    <div className="flex items-start gap-3">
                      <Tag className="text-purple-400 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-gray-400 text-sm">Status</p>
                        <p className="text-white">{anime.status}</p>
                      </div>
                    </div>
                  )}
                  
                  {anime.rating && (
                    <div className="flex items-start gap-3">
                      <Users className="text-purple-400 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-gray-400 text-sm">Rating</p>
                        <p className="text-white">{anime.rating}</p>
                      </div>
                    </div>
                  )}
                  
                  {anime.score && (
                    <div className="flex items-start gap-3">
                      <Star className="text-yellow-400 shrink-0 mt-1" size={18} />
                      <div>
                        <p className="text-gray-400 text-sm">Score</p>
                        <p className="text-white">{anime.score.toFixed(1)} ({anime.scored_by ? anime.scored_by.toLocaleString() : 'N/A'} users)</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* External Links */}
                {anime.url && (
                  <Button 
                    className="w-full mt-6 bg-purple-600 hover:bg-purple-500"
                    asChild
                  >
                    <a href={anime.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on MyAnimeList
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <Card className="bg-[#161620] border-[#27273b] overflow-hidden mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-white">Studios</h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.map(studio => (
                      <Badge 
                        key={studio.mal_id}
                        className="bg-purple-900/40 text-purple-200 border-purple-700/30"
                      >
                        {studio.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Similar Anime Section */}
      {similarAnime.length > 0 && (
        <div className="container mx-auto px-4 mt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Similar Anime
            </h2>
            <p className="text-gray-400 mt-2">
              You might also enjoy these anime
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {similarAnime.map((similarAnime, index) => (
                <motion.div
                  key={similarAnime.mal_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Link to={`/anime/${similarAnime.mal_id}`}>
                    <Card className="bg-[#161620] border-[#27273b] overflow-hidden h-full flex flex-col group">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img 
                          src={similarAnime.images.jpg.large_image_url || similarAnime.images.jpg.image_url} 
                          alt={similarAnime.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <Button size="sm" variant="ghost" className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full w-full">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2">
                          {similarAnime.score && (
                            <Badge className="bg-black/60 backdrop-blur-sm text-yellow-400 border-none">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {similarAnime.score}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className="p-4 flex-grow flex flex-col">
                        <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors text-lg">
                          {similarAnime.title}
                        </h3>
                        
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {similarAnime.genres?.slice(0, 2).map(genre => (
                            <Badge key={genre.mal_id} variant="secondary" className="bg-[#232330] text-gray-300 text-xs">
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-400 space-y-1">
                          {similarAnime.episodes && (
                            <div className="flex items-center">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {similarAnime.episodes} episodes
                            </div>
                          )}
                          {similarAnime.year && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {similarAnime.year}
                            </div>
                          )}
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
      
      {/* Bottom CTA */}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Looking for more anime?</h2>
              <p className="text-purple-200 max-w-md">
                Discover more anime based on your preferences with our smart recommendation system.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                onClick={() => window.location.href = '/search'}
                size="lg" 
                className="rounded-full bg-white text-purple-900 hover:bg-gray-100"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Anime
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  ) : (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto text-center bg-red-950/20 border border-red-900/30 rounded-lg p-6 mb-12"
      >
        <div className="text-4xl mb-4">😕</div>
        <p className="text-red-300 mb-4">Anime not found</p>
        <Button 
          onClick={() => window.history.back()}
          variant="destructive"
          className="bg-red-900/40 hover:bg-red-800/50 text-red-100"
        >
          Go Back
        </Button>
      </motion.div>
    </div>
  );
}