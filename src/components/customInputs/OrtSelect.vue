<template>
  <div>
    <div class="Popup" v-if="showAddPopup">
      <div class="popupBackground" @click="showAddPopup = false"></div>
      <div class="addPopup">
        <OrtFrom
          :insidePopup="true"
          @closePopup="showAddPopup = false"
          @newPlace="setNewPlace"
        />
      </div>
    </div>
    <div class="select-container" v-if="places.length > 0">
      <div class="combobox" @click="showSearchResults = true">
        <div class="chip-container">
          <div class="chip" v-for="place in selectedplaces" :key="place.id">
            <div class="chip-name">{{ place.name }}</div>
            <div
              class="chip-remove"
              @click="selectedplaces.splice(selectedplaces.indexOf(place), 1)"
            >
              <img
                src="@/assets/icons/close.svg"
                alt="close"
                width="15"
                height="15"
              />
            </div>
          </div>
        </div>
        <input
          v-if="showSearchResults || selectedplaces.length === 0"
          type="search"
          v-model="search"
          placeholder="Name des Ortes"
        />
        <!-- <div class="search-chip" v-if="!showSearchResults && selectedplaces.length > 0" @click="showSearchResults = true">
        <div class="chip-remove">
          <img src="@/assets/icons/search.svg" width="15" height="15" />
        </div>
        <div class="chip-name">place hinzufügen</div>
      </div> -->
      </div>
      <div class="selectable-options" v-if="showSearchResults">
        <div
          class="option"
          v-for="place in computedplaces"
          :key="place.id"
          @click="selectplace(place)"
        >
          <div class="option-content">
            <div class="option-avatar" v-if="place.image">
              <img :src="place.image.url" alt="avatar" />
            </div>
            <div class="option-name">{{ place.name }}</div>
          </div>
        </div>
        <div
          v-if="computedplaces.length === 0"
          class="option"
          @click="showAddPopup = true"
        >
          "{{ search }}" hinzufügen ?
        </div>
      </div>
    </div>
    <div v-else class="loadingIndicator">
      <div class="combobox">
        <span>Lade Orte...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import OrtFrom from "../creationForms/OrtFrom.vue";
const props = defineProps({
  selectedplaces: {
    type: Array,
    default: () => [],
  },
});

const selectedplaces = ref([]);

const showSearchResults = ref(false);
const showAddPopup = ref(false);

const places = ref([]);
const computedplaces = computed(() => {
  return places.value.filter((place) => {
    return place.name.toLowerCase().includes(search.value.toLowerCase());
  });
});
const search = ref("");

const setNewPlace = (place) => {
  selectedplaces.value.push(place);
  places.value.push(place);
  showAddPopup.value = false;
};

const getplaces = async () => {
  const response = await axios.get("/places");
  return response.data.places;
};

const selectplace = (place) => {
  if (!selectedplaces.value.includes(place)) {
    selectedplaces.value.push(place);
  }
};

//on click outside of combobox close search results
window.addEventListener("click", (e) => {
  if (!e.target.closest(".select-container")) {
    showSearchResults.value = false;
  }
});

function getData() {
  return selectedplaces.value.map((place) => {
    return place.id;
  });
}

defineExpose({
  getData,
});

onMounted(async () => {
  places.value = await getplaces();
});

watch(
  () => props.selectedplaces,
  (newVal) => {
    selectedplaces.value = newVal;
  }
);
</script>

<style>
.select-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.combobox {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.combobox .chip-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.combobox .chip-container .chip {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.combobox .chip-container .chip .chip-name {
  margin-right: 0.5rem;
}

.search-chip {
  background-color: var(--secondary-color);
  border: 2px solid var(--primary-color);
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  margin-top: 7.5px;
}

.search-chip .chip-name {
  font-size: 12px;
  margin: 0;
}

.search-chip .chip-remove {
  margin-right: 0.5rem;
}

.combobox input {
  border: none;
  outline: none;
  background-color: transparent;
  min-width: unset;
  font-size: 1rem;
  color: var(--primary-color);
}

.selectable-options {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background-color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--primary-color);
}

.option {
  padding: 15px 15px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.option:not(:last-child) {
  border-bottom: 1px solid var(--primary-color);
}
</style>
