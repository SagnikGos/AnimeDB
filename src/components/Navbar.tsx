import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Home, 
  BookmarkPlus, 
  TrendingUp,
  User,
  LogOut
} from "lucide-react";

// shadcn components
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../components/ui/dropdown-menu";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Explore", path: "/explore", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Watchlist", path: "/watchlist", icon: <BookmarkPlus className="w-4 h-4" /> },
  ];

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-[#0a0a0f]/90 backdrop-blur-md py-2 shadow-lg" 
            : "bg-transparent py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="rounded-full bg-purple-600 p-2 flex items-center justify-center"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-white fill-current"
              >
                <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M16.59,7.58L10,14.17l-2.59-2.58L6,13l4,4l8-8L16.59,7.58z" />
              </svg>
            </motion.div>
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              AnimeStream
            </motion.span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`relative group flex items-center gap-1 font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
                <motion.div 
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 ${
                    location.pathname === link.path ? "w-full" : "w-0"
                  }`}
                  initial={false}
                  animate={{ width: location.pathname === link.path ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#161620] rounded-full p-2">
              <Link to="/search" aria-label="Search">
                <Search className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-300 hover:text-white hover:bg-[#161620] rounded-full"
              aria-label="Toggle Dark Mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
            
            {/* User Profile Dropdown */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0 h-auto hover:bg-transparent">
                  <Avatar className="h-9 w-9 border-2 border-purple-500 hover:border-purple-400 transition-colors">
                    <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" alt="User avatar" />
                    <AvatarFallback className="bg-purple-600 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#161620] border-[#27273b] text-gray-200 shadow-lg shadow-purple-900/20">
                <DropdownMenuLabel className="text-gray-400">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700/50" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-[#20202d] focus:bg-[#20202d] cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#20202d] focus:bg-[#20202d] cursor-pointer">
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    <span>Watchlist</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-700/50" />
                <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-[#20202d] focus:bg-[#20202d] cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300 hover:text-white hover:bg-[#161620] rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? "open" : "closed"}
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: mobileMenuOpen ? 90 : 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-md pt-20 px-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      location.pathname === link.path 
                        ? "bg-purple-600/20 text-purple-400 border-l-4 border-purple-500" 
                        : "text-gray-300 hover:bg-[#161620]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <div className="h-px bg-gradient-to-r from-purple-500/20 via-purple-300/10 to-transparent my-4" />
                
                <button 
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-[#161620]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Log out</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}