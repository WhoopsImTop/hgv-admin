<template>
  <div>
    <div class="select-container">
      <div class="combobox" @click="showSearchResults = true">
        <div class="chip-container">
          <div class="chip" v-for="tours in selectedTours" :key="tours.id">
            <div class="chip-name">{{ tours.name }}</div>
            <div
              class="chip-remove"
              @click="selectedTours.splice(selectedTours.indexOf(tours), 1)"
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
          v-if="showSearchResults || selectedTours.length === 0"
          type="search"
          v-model="search"
          placeholder="Name der Tour eingeben"
        />
      </div>
      <div class="selectable-options" v-if="showSearchResults">
        <div
          class="option"
          v-for="tours in computedtours"
          :key="tours.id"
          @click="selecttours(tours)"
        >
          <div class="option-content">
            <div class="option-avatar" v-if="tours.image">
              <img :src="tours.image.url" alt="avatar" />
            </div>
            <div class="option-name">{{ tours.name }}</div>
          </div>
        </div>
        <div
          v-if="computedtours.length === 0"
          class="option"
        >
          Keine Tour mit diesem Namen gefunden
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
const props = defineProps({
  selectedTours: {
    type: Array,
    default: () => [],
  },
});

const selectedTours = ref([]);

const showSearchResults = ref(false);
const showAddPopup = ref(false);

const tours = ref([]);
const computedtours = computed(() => {
  return tours.value.filter((tours) => {
    return tours.name.toLowerCase().includes(search.value.toLowerCase());
  });
});
const search = ref("");

const setNewtours = (tours) => {
  selectedTours.value.push(tours);
  tours.value.push(tours);
  showAddPopup.value = false;
};

const gettours = async () => {
  const response = await axios.get("/tours");
  return response.data.tours;
};

const selecttours = (tours) => {
  if (!selectedTours.value.includes(tours)) {
    selectedTours.value.push(tours);
  }
};

//on click outside of combobox close search results
window.addEventListener("click", (e) => {
  if (!e.target.closest(".select-container")) {
    showSearchResults.value = false;
  }
});

function getData() {
  return selectedTours.value.map((tours) => {
    return tours.id;
  });
}

defineExpose({
  getData,
});

onMounted(async () => {
  tours.value = await gettours();
});

watch(
  () => props.selectedTours,
  (newVal) => {
    if(newVal === null) {
      selectedTours.value = [];
    } else {
      selectedTours.value = newVal;
    }
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