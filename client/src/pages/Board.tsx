import { useState, useLayoutEffect } from "react";
import ErrorPage from "./ErrorPage";
import auth from "../utils/auth";
import { Recipe } from "../interfaces/Recipe";
import { Video } from "../interfaces/Video";
import { YouTubeAPIItem } from "../interfaces/YouTubeAPIItem";
import axios from "axios";

const Board = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchType, setSearchType] = useState<"youtube" | "recipes" | null>(
    null,
  );

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  const fetchRecipes = async (query: string) => {
    try {
      const apiKey = import.meta.env.VITE_SPOON_API;
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`,
      );
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setError(true);
    }
  };

  const handleSearchVideos = async (query: string) => {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // Get API key from the environment file
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            key: API_KEY, // Use the API key here
            maxResults: 6,
          },
        },
      );

      const videoData: Video[] = response.data.items.map(
        (item: YouTubeAPIItem) => ({
          id: item.id.videoId || "",
          title: item.snippet.title || "",
          thumbnail: item.snippet.thumbnails.high.url || "",
        }),
      );

      setVideos(videoData);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleSearch = (e: React.FormEvent, type: "youtube" | "recipes") => {
    e.preventDefault();
    setSearchType(type); // Set the search type based on which button was clicked
    if (searchQuery.trim()) {
      if (type === "recipes") {
        setVideos([]); // Clear videos when switching to recipe search
        fetchRecipes(searchQuery);
      } else if (type === "youtube") {
        setRecipes([]); // Clear recipes when switching to video search
        handleSearchVideos(searchQuery);
      }
    }
  };

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
      {!loginCheck ? (
        <div className="login-notice">
          <div className="page-title border rounded-3">
            <h1>Let's Get Cooking</h1>
          </div>
          <img
            src="/landingpage.jpeg"
            className="img-fluid border rounded-3 shadow-lg mb-4"
            alt="image-landing"
            width="700"
            height="500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="container-xl">
          <div className="search-container">
            <form>
              <input className="search-form"
                type="text"
                placeholder="Search for a recipe or video..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="search-buttons">
                <button
                  type="button"
                  onClick={(e) => handleSearch(e, "recipes")}
                >
                  Search Recipes
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSearch(e, "youtube")}
                >
                  Search Videos
                </button>
              </div>
            </form>
          </div>

          {/* Show Recipes */}
          {searchType === "recipes" && recipes.length > 0 && (
            <div className="recipe-results">
              {recipes.slice(0, 6).map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <img src={recipe.image} alt={recipe.title} />
                  <h3>{recipe.title}</h3>
                  <a
                    href={`https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Recipe
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Show YouTube Videos */}
          {searchType === "youtube" && videos.length > 0 && (
            <div className="video-results">
              {videos.map((video) => (
                <div key={video.id} className="video-card">
                  <img src={video.thumbnail} alt={video.title} />
                  <h3>{video.title}</h3>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Video
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Board;
