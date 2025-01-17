let map; // Declare map variable globally

function initMap() {
  console.log("Initializing map...");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      console.log("User's location:", lat, lon);

      var platform = new H.service.Platform({
        'apikey': 'fA6q4GlxWmZq2MdVI6OLbP79wOKz4QRCQr5Q9rkXbyc'
      });

      var layers = platform.createDefaultLayers();

      map = new H.Map(document.getElementById('map-container'), layers.vector.normal.map, {
        center: { lat: lat, lng: lon },
        zoom: 14
      });

      console.log("Map created");

      var userMarker = new H.map.Marker({ lat: lat, lng: lon });
      map.addObject(userMarker);

      var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      var ui = H.ui.UI.createDefault(map, layers);

      console.log("Map rendered");

      // Get polling stations near the user's location
      fetchPollingStations(lat, lon);
    }, function(error) {
      console.error("Geolocation failed:", error.message);
    });
  } else {
    console.error("Geolocation not supported by this browser.");
  }
}

// Function to fetch nearby polling stations using HERE API
function fetchPollingStations(lat, lon) {
  const apiKey = 'fA6q4GlxWmZq2MdVI6OLbP79wOKz4QRCQr5Q9rkXbyc';
  const url = `https://discover.search.hereapi.com/v1/discover?at=${lat},${lon}&q=voting+booth&apiKey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("Polling stations data:", data); // Check data structure
      if (data.items) {
        displayPollingStations(data.items);
      } else {
        console.log("No polling stations found.");
        displayPollingStations([]);  // Pass empty array if no locations found
      }
    })
    .catch(error => console.error('Error fetching polling stations:', error));
}


// Function to display polling stations in the list
function displayPollingStations(locations) {
  const pollingStationList = document.getElementById('polling-station-list');
  pollingStationList.innerHTML = ''; // Clear existing list

  if (locations.length === 0) {
    // Display a message if no locations are available
    const noLocationsMessage = document.createElement('li');
    noLocationsMessage.textContent = "No polling stations found.";
    pollingStationList.appendChild(noLocationsMessage);
    return;
  }

  locations.forEach((location, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('polling-station-item');
    
    // Get the basic name of the polling station (fallback to "Polling Station" if no title is available)
    const title = location.title || 'Polling Station';

    // Extract address details
    const address = location.address && location.address.label ? location.address.label : 'No address available';

    // Extract hours of operation (assuming it's in an array, and checking if it's available)
    const hours = location.openingHours && location.openingHours[0] && location.openingHours[0].text ? location.openingHours[0].text : 'Hours not available';

    // Extract phone number (assuming it's in an array, and checking if it's available)
    const phone = location.contacts && location.contacts[0] && location.contacts[0].phone && location.contacts[0].phone[0] && location.contacts[0].phone[0].value ? location.contacts[0].phone[0].value : 'Phone number not available';

    // Extract coordinates to place marker on map
    const position = location.position;

    console.log("Polling poistion:", position.lat, position.lng);

    var userMarker = new H.map.Marker({ lat: position.lat, lng: position.lng });
    map.addObject(userMarker);

    // Create HTML content for each item
    listItem.innerHTML = `
      <strong>${title}</strong><br>
      Address: ${address}<br>
      Hours: ${hours}<br>
      Phone: ${phone}
    `;

    // Add click event to center the map on the polling station when clicked
    listItem.addEventListener('click', function() {
      centerMapOnLocation(location, map);  // Pass map to center function
    });

    pollingStationList.appendChild(listItem);
  });
  console.log("Polling stations displayed in list.");
}

// Function to center the map on the selected polling station
function centerMapOnLocation(location, map) {
  const lat = location.position.lat;
  const lon = location.position.lng;

  if (!lat || !lon) {
    console.error("No valid coordinates found for this location.");
    return;
  }

  map.setCenter({ lat: lat, lng: lon });
  const marker = new H.map.Marker({ lat: lat, lng: lon });
  map.addObject(marker);
  map.setZoom(16);
}


// Start map on page load
document.addEventListener("DOMContentLoaded", initMap);
