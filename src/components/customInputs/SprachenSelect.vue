<template>
  <div>
    <div class="Popup" v-if="showAddPopup">
      <div class="popupBackground" @click="showAddPopup = false"></div>
      <div class="addPopup">
        <SprachenForm
          :insidePopup="true"
          @closePopup="showAddPopup = false"
          @newLanguage="setNewlanguage"
        />
      </div>
    </div>
    <div class="select-container" v-if="languages.length > 0">
      <div class="combobox" @click="showSearchResults = true">
        <div class="chip-container">
          <div class="chip" v-for="language in selectedLanguages" :key="language.id">
            <div class="chip-name">{{ language.name }}</div>
            <div
              class="chip-remove"
              @click="selectedLanguages.splice(selectedLanguages.indexOf(language), 1)"
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
          v-if="showSearchResults || selectedLanguages.length === 0"
          type="search"
          v-model="search"
          placeholder="Name der Sprache"
        />
        <!-- <div class="search-chip" v-if="!showSearchResults && selectedLanguages.length > 0" @click="showSearchResults = true">
        <div class="chip-remove">
          <img src="@/assets/icons/search.svg" width="15" height="15" />
        </div>
        <div class="chip-name">language hinzufügen</div>
      </div> -->
      </div>
      <div class="selectable-options" v-if="showSearchResults">
        <div
          class="option"
          v-for="language in computedlanguages"
          :key="language.id"
          @click="selectlanguage(language)"
        >
          <div class="option-content">
            <div class="option-avatar" v-if="language.image">
              <img :src="language.image.url" alt="avatar" />
            </div>
            <div class="option-name">{{ language.name }}</div>
          </div>
        </div>
        <div
          v-if="computedlanguages.length === 0"
          class="option"
          @click="showAddPopup = true"
        >
          "{{ search }}" hinzufügen ?
        </div>
      </div>
    </div>
    <div v-else class="loadingIndicator">
      <div class="combobox">
        <span>Lade Sprache...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import SprachenForm from "../creationForms/SprachenForm.vue";
const props = defineProps({
  selectedLanguages: {
    type: Array,
    default: () => [],
  },
});

const selectedLanguages = ref([]);

const showSearchResults = ref(false);
const showAddPopup = ref(false);

const languages = ref([]);
const computedlanguages = computed(() => {
  return languages.value.filter((language) => {
    return language.name.toLowerCase().includes(search.value.toLowerCase());
  });
});
const search = ref("");

const setNewlanguage = (language) => {
  selectedLanguages.value.push(language);
  languages.value.push(language);
  showAddPopup.value = false;
};

const getlanguages = async () => {
  const response = await axios.get("/languages");
  return response.data.languages;
};

const selectlanguage = (language) => {
  if (!selectedLanguages.value.includes(language)) {
    selectedLanguages.value.push(language);
  }
};

//on click outside of combobox close search results
window.addEventListener("click", (e) => {
  if (!e.target.closest(".select-container")) {
    showSearchResults.value = false;
  }
});

function getData() {
  return selectedLanguages.value.map((language) => {
    return language.id;
  });
}

defineExpose({
  getData,
});

onMounted(async () => {
  languages.value = await getlanguages();
});

watch(
  () => props.selectedLanguages,
  (newVal) => {
    if (newVal === null) {
      selectedLanguages.value = [];
    } else {
      selectedLanguages.value = newVal;
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