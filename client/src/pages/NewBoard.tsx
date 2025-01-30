import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import ErrorPage from "./ErrorPage";
import auth from "../utils/auth";
import { Box, Typography, Container, TextField, Button, Card, CardContent, Grid,  } from "@mui/material";

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
  const [searchQuery, setSearchQuery] = useState({ foodType: "", zipCode: "", radius: "" });
  const [error] = useState(false);
  const [places] = useState<Place[]>([]);
  const [center] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAsJ1BR2yh-806KbmnN3PA-qxzw_2TJirA",
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (error) return <ErrorPage />;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#d2e8e4", py: 5 }}>
      {!loginCheck ? (
        // Landing Page
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "#38793b",
              mb: 3,
            }}
          >
            Food 4 All
          </Typography>
          <Box
            component="img"
            src="/globe.jpg"
            alt="Landing Page"
            sx={{
              width: "60%",
              maxWidth: 700,
              height: "auto",
              borderRadius: 4,
              boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
              mb: 4,
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#38793b",
              color: "#f8f8f8",
              fontSize: "1.2rem",
              px: 4,
              py: 1,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#100f0d" },
            }}
            onClick={() => (window.location.href = "/login")}
          >
            Login to Continue
          </Button>
        </Container>
      ) : (
        // Search + Map Side by Side Layout
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Side - Search Fields */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" color="#100f0d" sx={{ mb: 3, textAlign: "center" }}>
                What are you in the mood for tonight?
              </Typography>
              <Card elevation={4} sx={{ p: 3, borderRadius: 3, backgroundColor: "#f8f8f8" }}>
                <CardContent>
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      console.log("Search triggered");
                    }}
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
                        setSearchQuery((prev) => ({ ...prev, foodType: e.target.value }))
                      }
                      sx={{ bgcolor: "white", borderRadius: 1 }}
                    />
                    <TextField
                      fullWidth
                      label="Enter zip code"
                      value={searchQuery.zipCode}
                      onChange={(e) =>
                        setSearchQuery((prev) => ({ ...prev, zipCode: e.target.value }))
                      }
                      sx={{ bgcolor: "white", borderRadius: 1 }}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="Radius (miles)"
                      value={searchQuery.radius}
                      onChange={(e) =>
                        setSearchQuery((prev) => ({ ...prev, radius: e.target.value }))
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
            </Grid>

            {/* Right Side - Map */}
            <Grid item xs={12} md={6}>
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                {places.map((place, index) => {
                  const location = place.geometry.location;
                  if (!location) return null;

                  const lat = typeof location.lat === "function" ? location.lat() : location.lat;
                  const lng = typeof location.lng === "function" ? location.lng() : location.lng;

                  return (
                    <Marker
                      key={index}
                      position={{ lat, lng }}
                      onClick={() => setSelectedPlace(place)}
                    />
                  );
                })}
                {selectedPlace && selectedPlace.geometry.location && (
                  <InfoWindow
                    position={{
                      lat: typeof selectedPlace.geometry.location.lat === "function"
                        ? selectedPlace.geometry.location.lat()
                        : selectedPlace.geometry.location.lat,
                      lng: typeof selectedPlace.geometry.location.lng === "function"
                        ? selectedPlace.geometry.location.lng()
                        : selectedPlace.geometry.location.lng,
                    }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <Box>
                      <Typography variant="h6">{selectedPlace.name}</Typography>
                      <Typography>Rating: {selectedPlace.rating || "N/A"}</Typography>
                      <Typography>{selectedPlace.vicinity}</Typography>
                    </Box>
                  </InfoWindow>
                )}
              </GoogleMap>
            </Grid>
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default Board;
