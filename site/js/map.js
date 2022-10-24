/*
INITIALIZE BASE MAP TO SHOW
*/

let baseMapComponent = document.querySelector("#map-component");
export let baseMap = L.map(baseMapComponent, { zoomControl: false }).setView([40, -75.15], 11);
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=10b978ef-d3a8-4d87-84d7-9233488f7d37', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(baseMap);

/*
FUNCTION TO SHOW VOTERS ON THE MAP
*/

function showVotersOnMap(voters) {
  if(baseMap.voterLayers !== undefined) {
    baseMap.removeLayer(baseMap.schoolLayers);
  }
  baseMap.voterLayers = L.geoJSON(voters, {
    pointToLayer: (point, latLng) => L.circleMarker(latLng),
    style: {
      radius: 7,
      color: "#0d59a9",
      stroke: true,
      opacity: 0.5,
      weight: 1,
    },
  })
  .on("click", (e) => {
    console.log(e.layer.feature.properties.id);
  })
  .bindPopup(point => point.feature.properties.last_name)
  .addTo(baseMap);
}


export {
  showVotersOnMap,
};