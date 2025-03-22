import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";

// shadcn components
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  PlayCircle,
  Search,
  BookmarkPlus,
  ChevronRight,
  Info,
  RefreshCw
} from "lucide-react";

// Types
interface AnimeImage {
  jpg: {
    image_url: string;
    large_image_url?: string;
  };
}

interface Anime {
  mal_id: number;
  title: string;
  images: AnimeImage;
  score: number | null;
  episodes: number | null;
  synopsis?: string;
  genres?: { name: string }[];
  year?: number;
}

interface WaifuImage {
  url: string;
  tags: { name: string }[];
  dominant_color: string;
}

export default function Home() {
  const [featuredAnime, setFeaturedAnime] = useState<Anime[]>([]);
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [waifuImage, setWaifuImage] = useState<WaifuImage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [heroLoading, setHeroLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  // Fetch random anime girl image from waifu.im API
  const fetchRandomWaifu = async () => {
    setHeroLoading(true);
    try {
      const response = await axios.get("https://api.waifu.im/search", {
        params: {
          included_tags: "waifu",
          // height: ">=2000",
          many: false,
          orientation: "LANDSCAPE",
          width: ">=2000",
          
        
        
        }
      });
      
      if (response.data.images && response.data.images.length > 0) {
        setWaifuImage(response.data.images[0]);
      }
    } catch (err) {
      console.error("Failed to fetch waifu image:", err);
    } finally {
      setHeroLoading(false);
    }
  };

  // Fetch featured and top anime from Jikan API
  useEffect(() => {
    async function fetchAnimeData() {
      try {
        const topRes = await axios.get("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=12");
        setTopAnime(topRes.data.data);
      } catch (err) {
        setError("Failed to load anime data.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnimeData();
    fetchRandomWaifu();
  }, []);

  // Auto-scroll animation for top trending section
  useEffect(() => {
    if (topAnime.length > 0 && scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const containerWidth = scrollRef.current.offsetWidth;
      
      // Only activate auto-scroll if content is wider than container
      if (scrollWidth > containerWidth) {
        const scrollAnimation = async () => {
          await controls.start({
            x: -(scrollWidth - containerWidth),
            transition: { 
              duration: 30, 
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }
          });
        };
        
        scrollAnimation();
      }
    }
  }, [topAnime, controls]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-x-hidden">
      {/* Hero Section with Random Anime Girl */}
      <div ref={containerRef} className="relative h-screen">
        {/* Hero Background */}
        {waifuImage && (
          <motion.div 
            className="absolute inset-0 z-0" 
            style={{ opacity: backgroundOpacity }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/30"></div>
            <motion.img 
              src={waifuImage.url} 
              alt="Random anime girl" 
              className="w-full h-full object-cover object-center scale-110"
              animate={{ y: [0, -100, 0] }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
              }}
              style={{ 
                imageRendering: "high-quality", 
                filter: "contrast(1.05) brightness(0.95)" 
              }}
            />
          </motion.div>
        )}
        
        {heroLoading && (
          <div className="absolute inset-0 z-0 bg-[#161620] flex items-center justify-center">
            <div className="animate-spin text-purple-500">
              <RefreshCw size={48} />
            </div>
          </div>
        )}
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            className="max-w-3xl"
            style={{ opacity: textOpacity, y: textY }}
          >
            {waifuImage ? (
              <>
                <Badge variant="outline" className="mb-4 bg-purple-800/30 text-purple-300 border-purple-500/30 backdrop-blur-sm px-3 py-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> Featured Waifu
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-2 tracking-tight text-white">
                  Welcome to AnimeStream
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                  Discover the best anime series and movies all in one place.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {waifuImage.tags.slice(0, 4).map(tag => (
                    <Badge key={tag.name} variant="secondary" className="bg-[#161620]/80 text-white backdrop-blur-sm">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-purple-600 hover:bg-purple-500 rounded-full px-6">
                    <Link to="/search">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Start Watching
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-700 bg-[#161620]/40 text-white hover:bg-[#161620] rounded-full backdrop-blur-sm"
                    onClick={fetchRandomWaifu}
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    New Waifu
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <motion.div 
            className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div 
              className="w-1 h-2 bg-purple-500 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Top Trending Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
          >
            Top Trending
          </motion.h2>
          <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
            <Link to="/search" className="flex items-center">
              See All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        )}

        {error && (
          <Card className="max-w-md mx-auto text-center bg-red-950/20 border-red-900/30">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">😞</div>
              <p className="text-red-300 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="destructive"
                className="bg-red-900/40 hover:bg-red-800/50 text-red-100"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="overflow-x-hidden pb-6">
            <div 
              ref={scrollRef} 
              className="relative w-full"
            >
              <motion.div 
                className="flex space-x-5 w-max pl-1"
                animate={controls}
                onHoverStart={() => controls.stop()}
                onHoverEnd={() => {
                  if (scrollRef.current) {
                    const scrollWidth = scrollRef.current.scrollWidth;
                    const containerWidth = scrollRef.current.offsetWidth;
                    
                    controls.start({
                      x: -(scrollWidth - containerWidth),
                      transition: { 
                        duration: 30, 
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "reverse"
                      }
                    });
                  }
                }}
              >
                {topAnime.map((anime, index) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="w-[220px]"
                  >
                    <Link to={`/anime/${anime.mal_id}`} className="block group">
                      <div className="aspect-[3/4] rounded-lg bg-[#161620] overflow-hidden relative">
                        <img 
                          src={anime.images.jpg.image_url} 
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
                          <Badge className="bg-black/60 backdrop-blur-sm text-yellow-400 border-none">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {anime.score || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-medium line-clamp-1 text-white group-hover:text-purple-400 transition-colors">
                          {anime.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </section>
      
      {/* Bottom CTA */}
      <section className="pb-24 container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-[url('https://svgur.com/i/15kq.svg')] opacity-5"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-10 md:py-16">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to dive deeper?</h2>
              <p className="text-purple-200 max-w-md">
                Explore thousands of anime titles and create your personalized watchlist.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="rounded-full bg-white text-purple-900 hover:bg-gray-100">
                <Link to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Library
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-purple-400 text-white bg-purple-900/30 hover:bg-purple-900/50">
                <Link to="/watchlist">
                  <BookmarkPlus className="mr-2 h-5 w-5" />
                  My Watchlist
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
