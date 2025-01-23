/* function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 40.7128, lng: -74.0060 }, // Example: NYC
    });

    const service = new google.maps.places.PlacesService(map);

    const request = {
        location: { lat: 40.7128, lng: -74.0060 },
        radius: 5000, // Search radius in meters
        keyword: "pizza", // Example food type
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
                new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name,
                });
            });
        }
    });
} */
