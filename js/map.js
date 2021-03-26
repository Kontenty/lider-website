import L from "leaflet";

export function initMap() {
  const map = L.map("map-container").setView([52.1588, 21.0459], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([52.158, 21.0471]).addTo(map);
}
