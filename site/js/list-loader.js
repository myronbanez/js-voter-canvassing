/*
Hide and Show List Loader
*/

import { showVotersOnMap } from "./map.js";
import { baseMap } from "./map.js";

let hideButton = document.querySelector("#list-loader-hide");
let hidableChunk = document.querySelector("#list-loader-hidable-chunk");

let hidden = 0;

hideButton.addEventListener("click", ( ) => {
  if(hidden == 0) {
    hidableChunk.style.transform = "translateX(-16em)";
    hideButton.innerHTML = `
    <span class="material-symbols-outlined">chevron_right</span>
    `;
    hidden = 1;
  } else {
    hidableChunk.style.transform = "translateX(0em)";
    hideButton.innerHTML = `
    <span class="material-symbols-outlined">chevron_left</span>
    `;
    hidden = 0;
  }
});


/*
Load List
*/

let loadButton = document.querySelector("#list-loader-load");
let toolTip = document.querySelector("#list-loader-load").querySelector(".tooltiptext");


// Util function to make sure coords are valid
function coordsAreValid(lng, lat) {
  let result = false;
  if(typeof(lng) == "number" && typeof(lat) == "number") {
    if(lng < -73 && lng > -77 && lat < 41 && lat > 38) {
      result = true;
    }
  }
  return result;
}

// Function to change button tooltip depending on input
function errorTooltip(inputNumber) {
  let interruptLoad = false;
  if(inputNumber.length == 0) {
    toolTip.innerHTML = `<div class="tooltip-content">Empty input</div>`;
    console.log(toolTip);
    interruptLoad = true;
  } else if(inputNumber.length != 4) {
    toolTip.innerHTML = `<div class="tooltip-content">Wrong digits</div>`;
    interruptLoad = true;
  }
  return interruptLoad;
}

// Function to make feature collection
function makeVoterFeatureCollection(data) {

  // Construct a geojson empty frame
  const voters = {
    type: "FeatureCollection",
    features: [],
  };

  // Write into geojson
  for(let i = 0; i < data.length; i++) {
    let thisLngLat = data[i]["TIGER/Line Lng/Lat"];
    if(typeof(thisLngLat) == "string"){

      let thisLng = Number(thisLngLat.split(",")[0]);
      let thisLat = Number(thisLngLat.split(",")[1]);

      if(coordsAreValid(thisLng, thisLat)) {
        voters.features.push( {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [thisLng, thisLat],
          },
          "properties": {
              "id": data[i]["ID Number"],
              "last_name": data[i]["Last Name"],
              "first_name": data[i]["First Name"],
              "address": data[i]["TIGER/Line Matched Address"],
          },
        });
      }
    }
  }
  return voters;
}

loadButton.addEventListener("click", ( ) => {

  // Get input list number
  let inputNumber = document.querySelector("#list-loader-input").value.replace(/\s/g, '');
  if(errorTooltip(inputNumber)) { return }

  let path = './data/voters_lists/' + inputNumber + '.csv';

  // Fetch the particular CSV file
  fetch(path)
  .then(resp => {
    // If the file exists
    if(resp.ok) {
      return resp.text();
    } else {
      // If the file doesn't exist, then show in tooltip
      toolTip.innerHTML = `<div class="tooltip-content">Wrong number</div>`;
      return;
    }
  })
  .then(text => {
    const data = Papa.parse(text, { header: true }).data;

    // Make a FeatureCollection
    const voters = makeVoterFeatureCollection(data);

    // Show voters on the map
    showVotersOnMap(voters);
    baseMap.fitBounds(baseMap.voterLayers.getBounds());
  });
});


// Refresh tooltip text when mouse moves out
loadButton.addEventListener("mouseout", ( ) => {
  toolTip.innerHTML = `<div class="tooltip-content">Load List</div>`;
});

console.log(document.querySelector("#test"));

