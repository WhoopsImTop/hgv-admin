<template>
  <div>
    <div class="Popup" v-if="showAddPopup">
      <div class="popupBackground" @click="showAddPopup = false"></div>
      <div class="addPopup">
        <Zertifikateform
          :insidePopup="true"
          @closePopup="showAddPopup = false"
          @newCertificate="setNewcertificate"
        />
      </div>
    </div>
    <div class="select-container">
      <div class="combobox" @click="showSearchResults = true">
        <div class="chip-container">
          <div class="chip" v-for="certificate in selectedCertificate" :key="certificate.id">
            <div class="chip-name">{{ certificate.name }}</div>
            <div
              class="chip-remove"
              @click="selectedCertificate.splice(selectedCertificate.indexOf(certificate), 1)"
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
          v-if="showSearchResults || selectedCertificate.length === 0"
          type="search"
          v-model="search"
          placeholder="Name des Zertifikates"
        />
        <!-- <div class="search-chip" v-if="!showSearchResults && selectedCertificate.length > 0" @click="showSearchResults = true">
        <div class="chip-remove">
          <img src="@/assets/icons/search.svg" width="15" height="15" />
        </div>
        <div class="chip-name">certificate hinzufügen</div>
      </div> -->
      </div>
      <div class="selectable-options" v-if="showSearchResults">
        <div
          class="option"
          v-for="certificate in computedcertificates"
          :key="certificate.id"
          @click="selectcertificate(certificate)"
        >
          <div class="option-content">
            <div class="option-avatar" v-if="certificate.image">
              <img :src="certificate.image.url" alt="avatar" />
            </div>
            <div class="option-name">{{ certificate.name }}</div>
          </div>
        </div>
        <div
          v-if="computedcertificates.length === 0"
          class="option"
          @click="showAddPopup = true"
        >
          "{{ search }}" hinzufügen ?
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import Zertifikateform from "../creationForms/Zertifikateform.vue";
const props = defineProps({
  selectedCertificate: {
    type: Array,
    default: () => [],
  },
});

const selectedCertificate = ref([]);

const showSearchResults = ref(false);
const showAddPopup = ref(false);

const certificates = ref([]);
const computedcertificates = computed(() => {
  return certificates.value.filter((certificate) => {
    return certificate.name.toLowerCase().includes(search.value.toLowerCase());
  });
});
const search = ref("");

const setNewcertificate = (certificate) => {
  selectedCertificate.value.push(certificate);
  certificates.value.push(certificate);
  showAddPopup.value = false;
};

const getcertificates = async () => {
  const response = await axios.get("/certificates");
  return response.data.certificates;
};

const selectcertificate = (certificate) => {
  if (!selectedCertificate.value.includes(certificate)) {
    selectedCertificate.value.push(certificate);
  }
};

//on click outside of combobox close search results
window.addEventListener("click", (e) => {
  if (!e.target.closest(".select-container")) {
    showSearchResults.value = false;
  }
});

function getData() {
  return selectedCertificate.value.map((certificate) => {
    return certificate.id;
  });
}

defineExpose({
  getData,
});

onMounted(async () => {
  certificates.value = await getcertificates();
});

watch(
  () => props.selectedCertificate,
  (newVal) => {
    if(newVal === null) {
      selectedCertificate.value = [];
    } else {
      selectedCertificate.value = newVal;
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