// mapFilter.js

document.addEventListener("DOMContentLoaded", () => {
  let map;
  let markers = [];
  let appData = {};

  const citySelect = document.getElementById("city-select");
  const typeSelect = document.getElementById("type-select");

  /**
   * Load JSON data and initialize app
   */
  async function loadAndInitializeMap() {
    try {
      const response = await fetch("assets/data/data.json");
      appData = await response.json();

      populateCityDropdown();
      initializeMap();
      updateMarkers();
      attachEventListeners();

    } catch (error) {
      console.error("Error loading JSON data:", error);
    }
  }

  /**
   * Fill the city dropdown with data from JSON
   */
  function populateCityDropdown() {
    citySelect.innerHTML = ""; // Clear previous options

    Object.entries(appData.cities).forEach(([key, city], index) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = city.name;
      if (index === 0) option.selected = true;
      citySelect.appendChild(option);
    });
  }

  /**
   * Initialize the Leaflet map using the first city
   */
  function initializeMap() {
    const selectedCityKey = citySelect.value;
    const coordinates = appData.cities[selectedCityKey].coords;

    if (!selectedCityKey || !appData.cities[selectedCityKey]) {
  console.warn("No se pudo inicializar el mapa: ciudad no válida");
  return;
}


    map = L.map("map").setView(coordinates, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
  }

  /**
   * Add and update map markers based on current selection
   */
  function updateMarkers() {
    // Clear previous markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    const selectedCity = citySelect.value;
    const selectedType = typeSelect.value;
    const cityCoords = appData.cities[selectedCity].coords;

    map.setView(cityCoords, 13);

    appData.institutions.forEach(inst => {
      if (
        inst.city === selectedCity &&
        (!selectedType || inst.type === selectedType)
      ) {
        const marker = L.marker([inst.lat, inst.lng]).addTo(map);
        marker.bindPopup(inst.name);
        markers.push(marker);
      }
    });
  }

  /**
   * Attach listeners to update map when dropdowns change
   */
  function attachEventListeners() {
    citySelect.addEventListener("change", updateMarkers);
    typeSelect.addEventListener("change", updateMarkers);
  }

  // Call initializer
  loadAndInitializeMap();
});
