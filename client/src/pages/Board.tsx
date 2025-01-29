import { useState, useLayoutEffect } from "react";
import ErrorPage from "./ErrorPage";
import auth from "../utils/auth";
import { Recipe } from "../interfaces/Recipe";
import { Video } from "../interfaces/Video";
import { YouTubeAPIItem } from "../interfaces/YouTubeAPIItem";
import axios from "axios";
import { Box, Stack } from "@mui/material";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Board = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchType, setSearchType] = useState<"youtube" | "recipes" | null>(null);

  const checkLogin = () => {
    setLoginCheck(auth.loggedIn());
  };

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  const fetchRecipes = async (query: string) => {
    try {
      const apiKey = import.meta.env.VITE_SPOON_API;
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`
      );
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setError(true);
    }
  };

  const handleSearchVideos = async (query: string) => {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          key: API_KEY,
          maxResults: 6,
        },
      });

      const videoData: Video[] = response.data.items.map((item: YouTubeAPIItem) => ({
        id: item.id.videoId || "",
        title: item.snippet.title || "",
        thumbnail: item.snippet.thumbnails.high.url || "",
      }));

      setVideos(videoData);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleSearch = (e: React.FormEvent, type: "youtube" | "recipes") => {
    e.preventDefault();
    setSearchType(type);
    if (searchQuery.trim()) {
      if (type === "recipes") {
        setVideos([]);
        fetchRecipes(searchQuery);
      } else if (type === "youtube") {
        setRecipes([]);
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
            <h1>Food 4 All</h1>
          </div>
          <img
            src="/globe.jpg"
            className="img-fluid border rounded-3 shadow-lg mb-4"
            alt="image-landing"
            width="700"
            height="500"
            loading="lazy"
          />
        </div>
      ) : (
        <Box sx={{ width: "100%", position: "relative" }}>
          {/* Background Image Section */}
          <Box
            sx={{
              backgroundImage: "url('knife.jpg')",
              backgroundRepeat: "repeat-x",
              backgroundSize: "cover",
              display: "flex",
              justifyContent: "center",
              padding: "15%",
              position: "relative",
            }}
          >
            {/* Search Form */}
            <form>
              <input
                className="search-form"
                type="text"
                placeholder="Search for a recipe or video..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="search-buttons">
                <button type="button" onClick={(e) => handleSearch(e, "recipes")}>
                  Search Recipes
                </button>
                <button type="button" onClick={(e) => handleSearch(e, "youtube")}>
                  Search Videos
                </button>
              </div>
            </form>

            {/* Right-Side Navigation Icons */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: "20px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.7)", // Slight transparency
                borderRadius: "10px",
                padding: "8px",
              }}
            >
              <Stack spacing={2}>
                <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
              </Stack>
            </Box>
          </Box>

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
                  <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                    Watch Video
                  </a>
                </div>
              ))}
            </div>
          )}
        </Box>
      )}
    </>
  );
};

export default Board;
