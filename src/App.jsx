import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import AnimeDetails from "./pages/AnimeDetails.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
      </Routes>
    </div>
  );
}

export default App;
