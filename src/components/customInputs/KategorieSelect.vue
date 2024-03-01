<template>
  <div>
    <div class="Popup" v-if="showAddPopup">
      <div class="popupBackground" @click="showAddPopup = false"></div>
      <div class="addPopup">
        <kategorie-form
          :insidePopup="true"
          @closePopup="showAddPopup = false"
          @newTheme="setnewTheme"
        />
      </div>
    </div>
    <div class="select-container" v-if="themes.length > 0">
      <div class="combobox" @click="showSearchResults = true">
        <div class="chip-container">
          <div
            class="chip"
            v-for="categorie in selectedthemes"
            :key="categorie.id"
          >
            <div class="chip-name">{{ categorie.name }}</div>
            <div
              class="chip-remove"
              @click="
                selectedthemes.splice(selectedthemes.indexOf(categorie), 1)
              "
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
          v-if="showSearchResults || selectedthemes.length === 0"
          type="search"
          v-model="search"
          placeholder="Name der Kategorie"
        />
        <!-- <div class="search-chip" v-if="!showSearchResults && selectedthemes.length > 0" @click="showSearchResults = true">
        <div class="chip-remove">
          <img src="@/assets/icons/search.svg" width="15" height="15" />
        </div>
        <div class="chip-name">categorie hinzufügen</div>
      </div> -->
      </div>
      <div class="selectable-options" v-if="showSearchResults">
        <div
          class="option"
          v-for="categorie in computedthemes"
          :key="categorie.id"
          @click="selectcategorie(categorie)"
        >
          <div class="option-content">
            <div class="option-avatar" v-if="categorie.image">
              <img :src="categorie.image.url" alt="avatar" />
            </div>
            <div class="option-name">{{ categorie.name }}</div>
          </div>
        </div>
        <div
          v-if="computedthemes.length === 0"
          class="option"
          @click="showAddPopup = true"
        >
          "{{ search }}" hinzufügen ?
        </div>
      </div>
    </div>
    <div v-else class="loadingIndicator">
      <div class="combobox">
        <span>Lade Kategorien...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import KategorieForm from "../creationForms/KategorieForm.vue";
const props = defineProps({
  selectedthemes: {
    type: Array,
    default: () => [],
  },
});

const selectedthemes = ref([]);

const showSearchResults = ref(false);
const showAddPopup = ref(false);

const themes = ref([]);
const computedthemes = computed(() => {
  return themes.value.filter((categorie) => {
    return categorie.name.toLowerCase().includes(search.value.toLowerCase());
  });
});
const search = ref("");

const setnewTheme = (theme) => {
  selectedthemes.value.push(theme);
  themes.value.push(theme);
  showAddPopup.value = false;
};

const getthemes = async () => {
  const response = await axios.get("/themes");
  return response.data.themes;
};

const selectcategorie = (categorie) => {
  if (!selectedthemes.value.includes(categorie)) {
    selectedthemes.value.push(categorie);
  }
};

//on click outside of combobox close search results
window.addEventListener("click", (e) => {
  if (!e.target.closest(".select-container")) {
    showSearchResults.value = false;
  }
});

function getData() {
  return selectedthemes.value.map((theme) => {
    return theme.id;
  });
}

defineExpose({
  getData,
});

onMounted(async () => {
  themes.value = await getthemes();
});

watch(
  () => props.selectedthemes,
  (newVal) => {
    selectedthemes.value = newVal;
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

  z-index: 20;
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