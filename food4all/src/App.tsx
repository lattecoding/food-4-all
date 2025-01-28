import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [foodType, setFoodType] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [service, setService] = useState<google.maps.places.PlacesService | null>(null);
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [favorites, setFavorites] = useState<google.maps.places.PlaceResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMapResults, setShowMapResults] = useState(false);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null); // Lazy initialization

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
      setInfoWindow(new google.maps.InfoWindow()); // Initialize InfoWindow here
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

    setErrorMessage("");
    clearMarkers();
    setShowMapResults(false);

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
          const detailedResults: google.maps.places.PlaceResult[] = [];
          const newMarkers: google.maps.Marker[] = [];

          places.filter((place) => place.place_id).forEach((place) => {
            const detailsRequest: google.maps.places.PlaceDetailsRequest = { placeId: place.place_id! };

            service.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
              if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                detailedResults.push(placeDetails);

                if (placeDetails.geometry?.location) {
                  const marker = new google.maps.Marker({
                    position: placeDetails.geometry.location,
                    map,
                    title: placeDetails.name,
                  });

                  // Add a click listener to open InfoWindow
                  marker.addListener("click", () => {
                    if (infoWindow) {
                      infoWindow.close(); // Close the global InfoWindow if it’s already open
                      infoWindow.setContent(`
                        <div>
                          <h3>${placeDetails.name}</h3>
                          <p>Rating: ${placeDetails.rating || "N/A"}</p>
                          <p>${placeDetails.vicinity || "No address available"}</p>
                          ${
                            placeDetails.formatted_phone_number
                              ? `<p>Phone: ${placeDetails.formatted_phone_number}</p>`
                              : ""
                          }
                          ${
                            placeDetails.website
                              ? `<a href="${placeDetails.website}" target="_blank">Visit Website</a>`
                              : ""
                          }
                        </div>
                      `);
                      infoWindow.open(map, marker); // Open the InfoWindow on the selected marker
                    }
                  });

                  newMarkers.push(marker);
                }

                if (detailedResults.length === places.length) {
                  setResults(detailedResults);
                  setMarkers(newMarkers);
                  setShowMapResults(true);
                }
              }
            });
          });
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
        <span key={i} className={`star ${i <= Math.round(rating) ? "filled" : "empty"}`}>
          {i <= Math.round(rating) ? "★" : "☆"}
        </span>
      );
    }
    return <div className="stars">{stars}</div>;
  };

  const addToFavorites = (place: google.maps.places.PlaceResult) => {
    setFavorites((prev) => [...prev, place]);
  };

  const removeFromFavorites = (placeId: string | undefined) => {
    setFavorites((prev) => prev.filter((fav) => fav.place_id !== placeId));
  };

  return (
    <div>
      <h1>Food 4 All</h1>
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

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div
        id="mapResultsContainer"
        className={`map-results-container ${showMapResults ? "visible" : ""}`}
      >
        <div id="map" className="map"></div>

        <div id="results" className="results">
  <ul>
    {results.map((place, index) => (
      <li key={index}>
        <div className="place-name">{place.name}</div>
        <div className="place-rating">
          Rating: {place.rating || "N/A"} {generateStars(place.rating || 0)}
        </div>
        <p>{place.vicinity}</p>
        {place.formatted_phone_number ? (
          <p>Phone: {place.formatted_phone_number}</p>
        ) : (
          <p>Phone not available</p>
        )}
        {place.website ? (
          <a href={place.website} target="_blank" rel="noreferrer">
            Visit Website
          </a>
        ) : (
          <p>No Website Provided</p>
        )}
        <button onClick={() => addToFavorites(place)}>Add to Favorites</button>
      </li>
    ))}
  </ul>
</div>


      </div>

      <div id="favorites">
        <h2>Favorites</h2>
        <ul>
          {favorites.map((place, index) => (
            <li key={index}>
              <div className="place-name">{place.name}</div>
              <button onClick={() => removeFromFavorites(place.place_id)}>
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
