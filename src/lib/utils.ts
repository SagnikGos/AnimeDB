import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getAnimeDetails = async (title: string) => {
  try {
    const response = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${title}&limit=1`
    );
    return response.data.data[0]; // Returns the first matching anime
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return null;
  }
};











const PROXY_URL = "https://gemini-proxy.sagnik-gos06.workers.dev";

export const getAnimeRecommendations = async (userPrompt: string) => {
  const requestBody = {
    contents: [{ parts: [{ text: `Based on this user request: "${userPrompt}", suggest 5 anime titles. Return only a JSON array of anime names without any additional formatting.` }] }]
  };

  try {
    const response = await axios.post(PROXY_URL, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    // ✅ Extract text response correctly
    const candidates = response.data?.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("Invalid API response: No candidates found.");
    }

    // ✅ Extract text from Gemini response
    const textResponse = candidates[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Invalid API response: No text found.");
    }

    // ✅ Remove Markdown formatting (strip ```json and ``` )
    const cleanedResponse = textResponse.replace(/```json|```/g, "").trim();

    // ✅ Convert response to JSON
    const animeList = JSON.parse(cleanedResponse);

    if (!Array.isArray(animeList)) {
      throw new Error("Invalid API response: Expected an array.");
    }

    return animeList;
  } catch (error) {
    console.error("Error fetching recommendations:", error?.response?.data || error.message);
    return [];
  }
};
  