import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-indigo-900 text-white border-b border-indigo-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <svg 
            viewBox="0 0 24 24" 
            className="w-8 h-8 text-indigo-300 fill-current"
          >
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M16.59,7.58L10,14.17l-2.59-2.58L6,13l4,4l8-8L16.59,7.58z" />
          </svg>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 text-transparent bg-clip-text">AnimeDB</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/search" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-indigo-700 hover:bg-indigo-600 transition-colors">
            <Search size={16} />
            <span>Search Anime</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}