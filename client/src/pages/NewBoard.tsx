import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import ErrorPage from "./ErrorPage";
import auth from "../utils/auth";

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
  height: "400px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const Board: React.FC = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ foodType: "", zipCode: "", radius: "" });
  const [error, setError] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAsJ1BR2yh-806KbmnN3PA-qxzw_2TJirA",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { foodType, zipCode, radius } = searchQuery;

    if (!foodType || !zipCode || !radius) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyAsJ1BR2yh-806KbmnN3PA-qxzw_2TJirA`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (!data.results.length) {
        alert("Invalid zip code.");
        return;
      }

      const location = data.results[0].geometry.location;
      setCenter(location);

      const radiusInMeters = parseFloat(radius) * 1609.34;
      const service = new window.google.maps.places.PlacesService(document.createElement("div"));
      const request = {
        location,
        radius: radiusInMeters,
        keyword: foodType,
      };

      service.nearbySearch(
        request,
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const mappedResults: Place[] = results.map((result) => ({
              name: result.name || "Unknown Place",
              geometry: {
                location:
                  result.geometry?.location || { lat: () => 0, lng: () => 0 },
              },
              rating: result.rating,
              user_ratings_total: result.user_ratings_total,
              vicinity: result.vicinity,
            }));
            setPlaces(mappedResults);
          } else {
            alert("No results found.");
          }
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (error) return <ErrorPage />;

  return (
    <div className="board-container">
      {!loginCheck ? (
        <div className="login-notice">
          <h1>Food 4 All</h1>
          <img
            src="/landingpage.jpeg"
            alt="Landing Page"
            className="img-fluid"
            width="700"
            height="500"
          />
        </div>
      ) : (
        <div className="container-xl">
          {/* Search Controls */}
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Enter food type (e.g., pizza)"
                value={searchQuery.foodType}
                onChange={(e) =>
                  setSearchQuery((prev) => ({ ...prev, foodType: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Enter zip code"
                value={searchQuery.zipCode}
                onChange={(e) =>
                  setSearchQuery((prev) => ({ ...prev, zipCode: e.target.value }))
                }
              />
              <input
                type="number"
                placeholder="Radius (miles)"
                value={searchQuery.radius}
                onChange={(e) =>
                  setSearchQuery((prev) => ({ ...prev, radius: e.target.value }))
                }
              />
              <button type="submit">Search</button>
            </form>
          </div>

          {/* Map and Results */}
          <div id="mapResultsContainer" className="map-results-container">
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
      <div>
        <h3>{selectedPlace.name}</h3>
        <p>Rating: {selectedPlace.rating || "N/A"}</p>
        <p>{selectedPlace.vicinity}</p>
      </div>
    </InfoWindow>
  )}
</GoogleMap>


            {/* Results List */}
            <div id="results" className="results-list">
              <ul>
                {places.map((place, index) => (
                  <li key={index}>
                    <div className="place-name">{place.name}</div>
                    <div className="place-rating">
                      Rating: {place.rating || "N/A"} ({place.user_ratings_total || 0} reviews)
                    </div>
                    <button>Add to Favorites</button>
                    <button>Ordered Here</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
