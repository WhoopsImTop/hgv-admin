<template>
  <div>
    <div class="d-flex text-center" style="margin: 10px 0">
      <div class="row" style="justify-content: unset">
        <div class="col" style="margin-right: 10px">
          <input id="address" type="textbox" value="" placeholder="Suche nach Adresse" />
        </div>
        <div class="col">
          <input
            type="button"
            class="button-primary"
            value="Adresse Suchen"
            @click="codeAddress()"
          />
        </div>
      </div>
    </div>
    <div ref="mapDiv" style="width: 100%; height: 400px" />
  </div>
</template>
  
  <script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = "AIzaSyBw_QNEvvoRbs-czfH2GbPPkupqDdJTxhg";

const props = defineProps({
  coordinates: {
    type: Object,
    default: () => [],
  },
});

const currPos = computed(() => ({
  lat: props.coordinates.lat || 53.551086,
  lng: props.coordinates.lng || 9.993682,
}));

const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY });
const mapDiv = ref(null);
const marker = ref(null);

let geocoder = ref(null);
let map = ref(null);
let clickListener = null;

onMounted(async () => {
  await loader.load();
  map.value = new google.maps.Map(mapDiv.value, {
    center: currPos.value,
    zoom: 9,
  });

  geocoder.value = new google.maps.Geocoder();

  clickListener = map.value.addListener("click", handleMapClick);

  //add marker to map if coordinates are passed
  if (props.coordinates.lat && props.coordinates.lng) {
    marker.value = new google.maps.Marker({
      map: map.value,
      position: props.coordinates,
      title: "Adresse",
    });
  }

  console.log(props.coordinates);
});

const codeAddress = () => {
  const address = document.getElementById("address").value;
  geocoder.value.geocode({ address }, (results, status) => {
    if (status === "OK") {
      map.value.setCenter(results[0].geometry.location);
      marker.value = new google.maps.Marker({
        map: map.value,
        position: results[0].geometry.location,
        title: "Adresse",
      });
    } else {
      alert("Die Adresse konnte nicht gefunden werden: " + status);
    }
  });
};

onUnmounted(async () => {
  if (clickListener) clickListener.remove();

  if (map.value) {
    map.value = null;
  }
});

const handleMapClick = (e) => {
  const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  // Entferne den vorherigen Marker (falls vorhanden)
  if (marker.value) {
    marker.value = null;
  }
  marker.value = new google.maps.Marker({
    map: map.value,
    position: location,
    title: "Adresse",
  });
};

const getData = () => {
  // Return coordinates
  return {
    lat: marker.value.position.lat(),
    lng: marker.value.position.lng(),
  }
};

defineExpose({ getData });
</script>
  
  <style>
/* Add necessary CSS styling for the map container if needed */
</style>
  