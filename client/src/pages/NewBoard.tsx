import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import auth from "../utils/auth";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

interface Place {
  name: string;
  geometry: {
    location: google.maps.LatLng | { lat: () => number; lng: () => number };
  };
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
}

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "10px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const Board: React.FC = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    foodType: "",
    zipCode: "",
    radius: "",
  });
  const [recentSearches, setRecentSearches] = useState<
    { foodType: string; zipCode: string; radius: string }[]
  >([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAsJ1BR2yh-806KbmnN3PA-qxzw_2TJirA",
  });

  useEffect(() => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveSearch = (newSearch: {
    foodType: string;
    zipCode: string;
    radius: string;
  }) => {
    const updatedSearches = [newSearch, ...recentSearches].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearSearchHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.foodType || !searchQuery.zipCode || !searchQuery.radius) {
      alert("Please fill in all fields.");
      return;
    }

    saveSearch(searchQuery);
    console.log("Search triggered:", searchQuery);

    // Simple mock to show new markers
    setCenter({
      lat: defaultCenter.lat + Math.random() * 0.1,
      lng: defaultCenter.lng + Math.random() * 0.1,
    });

    setPlaces([
      {
        name: "Sample Place 1",
        geometry: {
          location: { lat: () => center.lat, lng: () => center.lng },
        },
        vicinity: "123 Food St",
        rating: 4.5,
      },
      {
        name: "Sample Place 2",
        geometry: {
          location: {
            lat: () => center.lat + 0.01,
            lng: () => center.lng + 0.01,
          },
        },
        vicinity: "456 Taste Ave",
        rating: 4.2,
      },
    ]);
  };

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  // 1) If the Google Maps script is not loaded yet
  if (!isLoaded) return <div>Loading...</div>;

  // 2) If user is not logged in, show a “landing page” instead of <ErrorPage/>
  if (!loginCheck) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#d2e8e4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" fontWeight="bold" color="#100f0d" gutterBottom>
          Food 4 All
        </Typography>
        <Box
          component="img"
          src="/globe.jpg"
          alt="Landing Page"
          sx={{
            width: { xs: "90%", sm: "700px" },
            height: "auto",
            borderRadius: 2,
          }}
        />
      </Box>
    );
  }

  // 3) Else user is logged in: show the “Board” content
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#d2e8e4", py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Search Fields */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#100f0d"
              sx={{ mb: 3, textAlign: "center" }}
            >
              What are you in the mood for tonight?
            </Typography>
            <Card
              elevation={4}
              sx={{ p: 3, borderRadius: 3, backgroundColor: "#f8f8f8" }}
            >
              <CardContent>
                <Box
                  component="form"
                  onSubmit={handleSearch}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Enter food type (e.g., pizza)"
                    value={searchQuery.foodType}
                    onChange={(e) =>
                      setSearchQuery((prev) => ({
                        ...prev,
                        foodType: e.target.value,
                      }))
                    }
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Enter zip code"
                    value={searchQuery.zipCode}
                    onChange={(e) =>
                      setSearchQuery((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Radius (miles)"
                    value={searchQuery.radius}
                    onChange={(e) =>
                      setSearchQuery((prev) => ({
                        ...prev,
                        radius: e.target.value,
                      }))
                    }
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#38793b",
                      color: "white",
                      fontSize: "1.1rem",
                      py: 1,
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#100f0d" },
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Display Recent Searches */}
            {recentSearches.length > 0 && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#100f0d"
                  sx={{ mb: 1 }}
                >
                  Previous Searches:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  {recentSearches.map((search, index) => (
                    <Chip
                      key={index}
                      label={`${search.foodType} - ${search.zipCode}`}
                      onClick={() =>
                        handleSearch(
                          new Event("submit") as unknown as React.FormEvent,
                        )
                      }
                      sx={{
                        bgcolor: "#38793b",
                        color: "white",
                        "&:hover": { bgcolor: "#100f0d" },
                      }}
                    />
                  ))}
                </Box>

                {/* Clear Previous Searches Button */}
                <Button
                  variant="outlined"
                  sx={{
                    mt: 2,
                    color: "#100f0d",
                    borderColor: "#100f0d",
                    "&:hover": { bgcolor: "#100f0d", color: "white" },
                  }}
                  onClick={clearSearchHistory}
                >
                  Clear Previous Searches
                </Button>
              </Box>
            )}
          </Grid>

          {/* Right Side - Map */}
          <Grid item xs={12} md={6}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
            >
              {places.map((place, index) => {
                const location = place.geometry.location;
                if (!location) return null;

                return (
                  <Marker
                    key={index}
                    position={{ lat: location.lat(), lng: location.lng() }}
                    onClick={() => handleMarkerClick(place)}
                  />
                );
              })}
              {selectedPlace && (
                <InfoWindow
                  position={{
                    lat: selectedPlace.geometry.location.lat(),
                    lng: selectedPlace.geometry.location.lng(),
                  }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <Box>
                    <Typography variant="h6">{selectedPlace.name}</Typography>
                    <Typography>
                      Rating: {selectedPlace.rating || "N/A"}
                    </Typography>
                    <Typography>{selectedPlace.vicinity}</Typography>
                  </Box>
                </InfoWindow>
              )}
            </GoogleMap>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Board;
