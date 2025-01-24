import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [foodType, setFoodType] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [service, setService] = useState<google.maps.places.PlacesService | null>(null);
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMapResults, setShowMapResults] = useState(false); // Track map and results visibility

  useEffect(() => {
    const initMap = () => {
      const defaultLocation = { lat: 40.7128, lng: -74.006 }; // NYC
      const mapInstance = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 12,
          center: defaultLocation,
        }
      );
      setMap(mapInstance);
      setService(new google.maps.places.PlacesService(mapInstance));
      console.log("Map initialized");
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAsJ1BR2yh-806KbmnN3PA-qxzw_2TJirA&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      initMap();
    }
  }, []);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const searchFood = async () => {
    if (!foodType || !zipCode || !radius) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (!map || !service) {
      setErrorMessage("Map is not initialized. Please wait and try again.");
      return;
    }

    setErrorMessage(""); // Clear previous errors
    clearMarkers(); // Clear existing markers
    setShowMapResults(true); // Hide map until results are fetched

    const radiusInMeters = parseFloat(radius) * 1609.34;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyAsJ1BR2yh-806KbmnN3PA-qxzw_2TJirA`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (!data.results.length) {
        setErrorMessage("Invalid zip code. Please try again.");
        return;
      }

      const location = data.results[0].geometry.location;
      map.setCenter(location);

      const request = {
        location,
        radius: radiusInMeters,
        keyword: foodType,
      };

      service.nearbySearch(request, (places, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && places) {
          setResults(places); // Update results in the list
          setShowMapResults(true); // Show map and results
          const newMarkers: google.maps.Marker[] = places.map((place) => {
            if (place.geometry && place.geometry.location) {
              const marker = new google.maps.Marker({
                position: place.geometry.location,
                map,
                title: place.name,
              });

              // Add an info window for each marker
              const infoWindow = new google.maps.InfoWindow({
                content: `<div>
                  <h3>${place.name}</h3>
                  <p>Rating: ${place.rating || "N/A"}</p>
                  <p>${place.vicinity || "No address available"}</p>
                  ${
                    place.website
                      ? `<a href="${place.website}" target="_blank">Visit Website</a>`
                      : ""
                  }
                </div>`,
              });

              marker.addListener("click", () => {
                infoWindow.open(map, marker);
              });

              return marker;
            }
            return null;
          });

          setMarkers(newMarkers.filter((marker): marker is google.maps.Marker => marker !== null));
        } else {
          setErrorMessage("No places found. Try again.");
        }
      });
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Error fetching places:", error);
    }
  };

  const generateStars = (rating: number) => {
    const maxStars = 5;
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= Math.round(rating) ? "filled" : "empty"}`}
        >
          {i <= Math.round(rating) ? "★" : "☆"}
        </span>
      );
    }
    return <div className="stars">{stars}</div>;
  };

  return (
    <div>
      <h1>Food 4 All</h1>
      {/* Search Controls */}
      <div id="controls">
        <input
          type="text"
          placeholder="Enter food type (e.g., pizza)"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter zip code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Radius (miles)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
        <button onClick={searchFood}>Search</button>
      </div>

      {/* Display Error Message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Map and Results Section */}
      <div
  id="mapResultsContainer"
  className={`map-results-container ${showMapResults ? "visible" : ""}`}
>
  {/* Map */}
  <div id="map" className="map"></div>

  {/* Results List */}
  <div id="results" style={{ flex: 1 }}>
    <ul>
      {results.map((place, index) => (
        <li key={index}>
          <div className="place-name">{place.name}</div>
          <div className="place-rating">
            Rating: {place.rating || "N/A"} {generateStars(place.rating || 0)}
          </div>
          <p>{place.vicinity}</p>
          {place.website && (
            <div className="place-website">
              <a href={place.website} target="_blank" rel="noreferrer">
                Visit Website
              </a>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
</div>
    </div>
  );
}

export default App;
