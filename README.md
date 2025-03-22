# Anime Database Website

## Overview
This website suggests anime based on user input using AI-powered recommendations based on users mood & interests and the website will fetch relevant anime titles using the Gemini API. The details for the suggested anime are then retrieved from the Jikan API and displayed.

## Features
- AI-Powered Anime Suggestions (Using Gemini API)
- Fetch Real-Time Anime Data (Using Jikan API)
- Search & Discover Anime
- Responsive UI (Built with React & TailwindCSS)
- Seamless API Integration

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend Proxy: Cloudflare Workers (Bypassing CORS restrictions)
- AI Recommendation: Gemini API
- Anime Data: Jikan API

## How It Works
1. User enters a full prompt (e.g., "I want a dark fantasy anime with strong character development.")
2. Gemini API suggests relevant anime titles.
3. Jikan API fetches details (image, synopsis, rating, etc.).
4. Anime is displayed in an interactive format.

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/anime-recommendation.git
   cd anime-recommendation
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Gemini API Key (Store in Cloudflare Workers Secrets)
   - Jikan API (Public, no key required)
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open in browser:
   ```
   http://localhost:5173
   ```

## Deployment
- Frontend: Vercel
- Backend Proxy: Cloudflare Workers

## Contributing
Feel free to submit issues, feature requests, or pull requests.

## License
MIT License © 2025 [Your Name]

