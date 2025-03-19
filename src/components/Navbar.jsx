import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="bg-indigo-900 dark:bg-gray-800 text-white border-b border-indigo-800 dark:border-gray-700 shadow-md animate-fadeIn">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 transform hover:scale-105 transition-transform duration-300">
          <svg 
            viewBox="0 0 24 24" 
            className="w-8 h-8 text-indigo-300 dark:text-indigo-200 fill-current"
          >
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M16.59,7.58L10,14.17l-2.59-2.58L6,13l4,4l8-8L16.59,7.58z" />
          </svg>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 text-transparent bg-clip-text">
            AnimeDB
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/search" 
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-indigo-700 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
          >
            <Search size={16} />
            <span>Search Anime</span>
          </Link>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-indigo-700 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
