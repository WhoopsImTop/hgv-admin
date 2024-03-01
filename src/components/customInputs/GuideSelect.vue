<template>
  <div>
    <div class="Popup" v-if="showAddPopup">
      <div class="popupBackground" @click="showAddPopup = false"></div>
      <div class="addPopup">
        <guide-form insidePopup="true" @closePopup="showAddPopup = false" @newGuide="setNewGuide"/>
      </div>
    </div>
    <div class="select-container" v-if="guides.length > 0">
      <div class="combobox" @click="showSearchResults = true">
        <div class="chip-container">
          <div class="chip" v-for="guide in selectedGuides" :key="guide.id">
            <div class="chip-name">{{ guide.name }}</div>
            <div
              class="chip-remove"
              @click="selectedGuides.splice(selectedGuides.indexOf(guide), 1)"
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
          v-if="showSearchResults || selectedGuides.length === 0"
          type="search"
          v-model="search"
          placeholder="Name des Guides"
        />
        <!-- <div class="search-chip" v-if="!showSearchResults && selectedGuides.length > 0" @click="showSearchResults = true">
        <div class="chip-remove">
          <img src="@/assets/icons/search.svg" width="15" height="15" />
        </div>
        <div class="chip-name">Guide hinzufügen</div>
      </div> -->
      </div>
      <div class="selectable-options" v-if="showSearchResults">
        <div
          class="option"
          v-for="guide in computedGuides"
          :key="guide.id"
          @click="selectGuide(guide)"
        >
          <div class="option-content">
            <div class="option-avatar" v-if="guide.image">
              <img :src="guide.image[0].url" alt="avatar" />
            </div>
            <div class="option-name">{{ guide.name }}</div>
          </div>
        </div>
        <div
          v-if="computedGuides.length === 0"
          class="option"
          @click="showAddPopup = true"
        >
          "{{ search }}" hinzufügen ?
        </div>
      </div>
    </div>
    <div v-else class="loadingIndicator">
      <div class="combobox">
        <span>Lade Guides...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import guideForm from "@/components/creationForms/GuideForm.vue";
const props = defineProps({
  selectedGuides: {
    type: Array,
    default: () => [],
  },
});

const selectedGuides = ref([]);

const showSearchResults = ref(false);
const showAddPopup = ref(false);

const guides = ref([]);
const computedGuides = computed(() => {
  return guides.value.filter((guide) => {
    return guide.name.toLowerCase().includes(search.value.toLowerCase());
  });
});
const search = ref("");

const setNewGuide = (guide) => {
  selectedGuides.value.push(guide);
  guides.value.push(guide);
  showAddPopup.value = false;
};

const getGuides = async () => {
  const response = await axios.get("/guides?preview=true&per_page=300");
  return response.data.guides.data;
};

const selectGuide = (guide) => {
  if (!selectedGuides.value.includes(guide)) {
    selectedGuides.value.push(guide);
  }
};

//on click outside of combobox close search results
window.addEventListener("click", (e) => {
  if (!e.target.closest(".select-container")) {
    showSearchResults.value = false;
  }
});

function getData() {
  return selectedGuides.value.map((guide) => {
    return guide.id;
  });
}

defineExpose({
  getData,
});

onMounted(async () => {
  guides.value = await getGuides();
});

//watch if selectedGuides prop changes
watch(
  () => props.selectedGuides,
  (newVal) => {
    console.log(newVal);
    selectedGuides.value = newVal;
  }
);
</script>

<style>
.Popup {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 100;
}
.popupBackground {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
}

.addPopup {
  position: absolute;
  top: 130px;
  left: 360px;
  right: 50px;
  bottom: 50px;
  overflow-y: scroll;
  background-color: var(--light-color);
  border: 1px solid var(--primary-color);
  border-radius: 10px;
  padding: 1rem;
}

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

.option .option-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option .option-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}

.option .option-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>