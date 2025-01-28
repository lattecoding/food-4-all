import React, { useEffect } from "react";

interface MapResultsProps {
  results: google.maps.places.PlaceResult[];
  map: google.maps.Map | null;
  onClearMarkers: () => void;
  generateStars: (rating: number) => JSX.Element;
}

const MapResults: React.FC<MapResultsProps> = ({
  results,
  map,
  onClearMarkers,
  generateStars,
}) => {
  useEffect(() => {
    if (map && results.length) {
      onClearMarkers(); // Clear existing markers

      results.forEach((place) => {
        if (place.geometry?.location) {
          new google.maps.Marker({
            position: place.geometry.location,
            map,
            title: place.name,
          });
        }
      });
    }
  }, [results, map, onClearMarkers]);

  return (
    <div id="mapResultsContainer" className={results.length ? "visible" : ""}>
      <div id="map" style={{ flex: 1, height: "400px" }}></div>
      <div id="results" style={{ flex: 1 }}>
        <ul>
          {results.map((place, index) => (
            <li key={index}>
              <div className="place-name">{place.name}</div>
              <div className="place-rating">
                Rating: {place.rating || "N/A"} {generateStars(place.rating || 0)}
              </div>
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
  );
};

export default MapResults;