import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Chip, Button, Card, CardContent } from "@mui/material";

const SearchHistory: React.FC = () => {
  const [recentSearches, setRecentSearches] = useState<{ foodType: string; zipCode: string; radius: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load search history from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearchClick = (search: { foodType: string; zipCode: string; radius: string }) => {
    // Navigate to NewBoard.tsx and prefill the search fields
    navigate("/", { state: { searchQuery: search } });
  };

  const clearSearchHistory = () => {
    setRecentSearches([]); // Clear UI
    localStorage.removeItem("recentSearches"); // Clear localStorage
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, minHeight: "100vh" }}>
      <Card elevation={4} sx={{ p: 3, borderRadius: 3, backgroundColor: "#f8f8f8", textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" color="#100f0d" sx={{ mb: 3 }}>
            Search History
          </Typography>

          {recentSearches.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 3 }}>
              {recentSearches.map((search, index) => (
                <Chip
                  key={index}
                  label={`${search.foodType} - ${search.zipCode}`}
                  onClick={() => handleSearchClick(search)}
                  sx={{
                    bgcolor: "#38793b",
                    color: "white",
                    "&:hover": { bgcolor: "#100f0d" }
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No recent searches found.
            </Typography>
          )}

          {recentSearches.length > 0 && (
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                color: "#100f0d",
                borderColor: "#100f0d",
                "&:hover": { bgcolor: "#100f0d", color: "white" }
              }}
              onClick={clearSearchHistory}
            >
              Clear Search History
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default SearchHistory;
