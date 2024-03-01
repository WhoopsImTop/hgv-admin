<template>
  <div>
    <div class="Popup" v-if="showAddPopup">
      <div class="popupBackground" @click="showAddPopup = false"></div>
      <div class="addPopup">
        <MobilitaetForm
          :insidePopup="true"
          @closePopup="showAddPopup = false"
          @newMobility="setNewmobility"
        />
      </div>
    </div>
    <div class="select-container" v-if="mobilitys.length > 0">
      <div class="combobox" @click="showSearchResults = true">
        <div class="chip-container">
          <div class="chip" v-for="mobility in selectedMobilites" :key="mobility.id">
            <div class="chip-name">{{ mobility.name }}</div>
            <div
              class="chip-remove"
              @click="selectedMobilites.splice(selectedMobilites.indexOf(mobility), 1)"
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
          v-if="showSearchResults || selectedMobilites.length === 0"
          type="search"
          v-model="search"
          placeholder="Name der Mobilität"
        />
        <!-- <div class="search-chip" v-if="!showSearchResults && selectedMobilites.length > 0" @click="showSearchResults = true">
        <div class="chip-remove">
          <img src="@/assets/icons/search.svg" width="15" height="15" />
        </div>
        <div class="chip-name">mobility hinzufügen</div>
      </div> -->
      </div>
      <div class="selectable-options" v-if="showSearchResults">
        <div
          class="option"
          v-for="mobility in computedmobilitys"
          :key="mobility.id"
          @click="selectmobility(mobility)"
        >
          <div class="option-content">
            <div class="option-avatar" v-if="mobility.image">
              <img :src="mobility.image.url" alt="avatar" />
            </div>
            <div class="option-name">{{ mobility.name }}</div>
          </div>
        </div>
        <div
          v-if="computedmobilitys.length === 0"
          class="option"
          @click="showAddPopup = true"
        >
          "{{ search }}" hinzufügen ?
        </div>
      </div>
    </div>
    <div v-else class="loadingIndicator">
      <div class="combobox">
        <span>Lade Mobilitäten...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import MobilitaetForm from "../creationForms/MobilitaetForm.vue";
const props = defineProps({
  selectedMobilites: {
    type: Array,
    default: () => [],
  },
});

const selectedMobilites = ref([]);

const showSearchResults = ref(false);
const showAddPopup = ref(false);

const mobilitys = ref([]);
const computedmobilitys = computed(() => {
  return mobilitys.value.filter((mobility) => {
    return mobility.name.toLowerCase().includes(search.value.toLowerCase());
  });
});
const search = ref("");

const setNewmobility = (mobility) => {
  console.log(mobility);
  selectedMobilites.value.push(mobility);
  mobilitys.value.push(mobility);
  showAddPopup.value = false;
};

const getmobilitys = async () => {
  const response = await axios.get("/mobility");
  return response.data.mobilities;
};

const selectmobility = (mobility) => {
  if (!selectedMobilites.value.includes(mobility)) {
    selectedMobilites.value.push(mobility);
  }
};

//on click outside of combobox close search results
window.addEventListener("click", (e) => {
  if (!e.target.closest(".select-container")) {
    showSearchResults.value = false;
  }
});

function getData() {
  return selectedMobilites.value.map((mobility) => {
    return mobility.id;
  });
}

defineExpose({
  getData,
});

onMounted(async () => {
  mobilitys.value = await getmobilitys();
});

watch(
  () => props.selectedMobilites,
  (newVal) => {
    selectedMobilites.value = newVal;
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