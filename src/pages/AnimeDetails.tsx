import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Loader2, Star, Calendar, Clock, Tag, Users, ChevronLeft } from "lucide-react";

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnime(res.data.data);
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <Link 
          to="/search" 
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
        >
          <ChevronLeft size={20} />
          Return to search
        </Link>
      </div>
    );
  }

  return anime ? (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Banner/Header */}
      <div className="h-64 md:h-80 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{ 
            backgroundImage: `url(${anime.images.jpg.large_image_url || anime.images.jpg.image_url})`,
            backgroundPosition: 'center 20%'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <Link 
            to="/search" 
            className="absolute top-8 left-4 flex items-center gap-1 text-gray-300 hover:text-white transition-colors bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full"
          >
            <ChevronLeft size={18} />
            Back
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Image and metadata */}
          <div className="md:w-1/3">
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg -mt-32 relative z-20">
              <div className="bg-gray-700 rounded-lg overflow-hidden mb-4">
                <img 
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
                  alt={anime.title} 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Stats */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={18} />
                  <div className="flex-1">
                    <span>Rating</span>
                    <div className="font-semibold text-lg">{anime.score ? anime.score.toFixed(1) : 'N/A'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="text-indigo-400" size={18} />
                  <div className="flex-1">
                    <span>Aired</span>
                    <div className="font-semibold">{anime.aired?.string || 'Unknown'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="text-indigo-400" size={18} />
                  <div className="flex-1">
                    <span>Episodes</span>
                    <div className="font-semibold">{anime.episodes || 'Unknown'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="text-indigo-400" size={18} />
                  <div className="flex-1">
                    <span>Type</span>
                    <div className="font-semibold">{anime.type || 'Unknown'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="text-indigo-400" size={18} />
                  <div className="flex-1">
                    <span>Status</span>
                    <div className="font-semibold">{anime.status || 'Unknown'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="mt-6 bg-gray-800 rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map(genre => (
                    <span 
                      key={genre.mal_id}
                      className="bg-indigo-900 px-3 py-1 rounded-full text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Details */}
          <div className="md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="text-xl text-gray-400 mb-4">{anime.title_english}</h2>
            )}
            
            {/* Synopsis */}
            <div className="bg-gray-800 rounded-lg p-6 mt-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed">{anime.synopsis || 'No synopsis available.'}</p>
            </div>
            
            {/* Additional info */}
            {anime.background && (
              <div className="bg-gray-800 rounded-lg p-6 mt-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Background</h3>
                <p className="text-gray-300 leading-relaxed">{anime.background}</p>
              </div>
            )}
            
            {/* Trailer */}
            {anime.trailer?.embed_url && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                <div className="bg-gray-800 rounded-lg p-2 shadow-lg aspect-video">
                  <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                    <p className="text-gray-400">Trailer would appear here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <p className="text-xl mb-4">Anime not found</p>
      <Link 
        to="/search" 
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
      >
        <ChevronLeft size={20} />
        Return to search
      </Link>
    </div>
  );
}