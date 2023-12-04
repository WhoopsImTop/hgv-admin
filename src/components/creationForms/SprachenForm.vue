<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import LanguageContainer from "../LanguageContainer.vue";

import axios from "axios";

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: null,
  },
  insidePopup: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closePopup", "newLanguage"]);

const sprachenData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
});

const errors = ref([]);

const buttonText = ref(
  props.editMode ? "Sprache aktualisieren" : "Sprache erstellen"
);
const imagePreview = ref(null);

const router = useRouter();

const validateSprachenData = () => {
  errors.value = [];
  if (sprachenData.value["name:de"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (DE) ein");
  }
  if (sprachenData.value["name:en"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (EN) ein");
  }
  return errors.value.length === 0;
};

const createSprache = () => {
  if (!validateSprachenData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Sprache aktualisieren..."
    : "Sprache erstellen...";

  axios
    .post("/languages", sprachenData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode
        ? "Sprache aktualisieren"
        : "Sprache erstellen";
      if (props.insidePopup) {
        emit("newLanguage", res.data.language);
      } else {
        router.push("/sprachen");
      }
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Sprache aktualisieren"
        : "Sprache erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Erstellen der Sprache");
      }
    });
};

const updateSprache = () => {
  if (!validateSprachenData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Sprache aktualisieren..."
    : "Sprache erstellen...";

  if (sprachenData.value.image !== null) {
    sprachenData.value.image = sprachenData.value.image.id;
  }

  if (sprachenData.value.tours !== null) {
    sprachenData.value.tours = sprachenData.value.tours.map((tour) => {
      return tour.id;
    });
  }

  if (sprachenData.value.guides !== null) {
    sprachenData.value.guides = sprachenData.value.guides.map((guide) => {
      return guide.id;
    });
  }

  axios
    .patch(`/languages/${props.id}`, sprachenData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode
        ? "Sprache aktualisieren"
        : "Sprache erstellen";
      //push to guide overview
      router.push("/sprachen");
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Sprache aktualisieren"
        : "Sprache erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Aktualisieren der Sprache");
      }
    });
};

//functions
const uploadImage = (e) => {
  const files = e.target.files;
  console.log(files);
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("/media", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          sprachenData.value.image = res.data.media.id;
          imagePreview.value = res.data.media.url;
        })
        .catch((err) => {
          console.log(err);
          window.alert("Fehler beim Upload des Bildes");
        });
    }
  }
};

onMounted(async () => {
  if (props.editMode) {
    loadSprachenData();
  }
});

const loadSprachenData = () => {
  axios
    .get(`/languages/${props.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      sprachenData.value = res.data.language;
      //map data to sprachenData
      sprachenData.value["name:de"] = res.data.language.translations[0].name;
      sprachenData.value["name:en"] = res.data.language.translations[1].name;
      sprachenData.value["description:de"] =
        res.data.language.translations[0].description;
      sprachenData.value["description:en"] =
        res.data.language.translations[1].description;
      sprachenData.value.image = res.data.language.image;
      //set image preview
      if (res.data.language.image !== null) {
        imagePreview.value = res.data.language.image.url;
      }
    })
    .catch((err) => {
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        console.log(err);
      }
    });
};

//remove tinymce editor on unmount
onBeforeMount(() => {
  if (!props.insidePopup) {
    tinymce.remove();
  }
});
</script>

<template>
  <div class="row">
    <h1>
      {{ props.editMode ? "Sprache Aktualisieren" : "Sprache Erstellen" }}
    </h1>
    <router-Link v-if="!props.insidePopup" to="/sprachen" class="button-primary"
      >Abbrechen</router-Link
    >
    <button v-else class="button-primary" @click="emit('closePopup')">
      Abbrechen
    </button>
  </div>
  <hr class="divider" />
  <div class="row content-row">
    <LanguageContainer lang="de" title="Sprache (DE)">
      <template #content>
        <input
          type="text"
          v-model="sprachenData['name:de']"
          placeholder="Name"
        />
      </template>
    </LanguageContainer>
    <LanguageContainer lang="en" title="Sprache (EN)">
      <template #content>
        <input
          type="text"
          v-model="sprachenData['name:en']"
          placeholder="Name"
        />
      </template>
    </LanguageContainer>
  </div>
  <div class="row content-row">
    <LanguageContainer lang="de" title="Kürzel (DE)">
      <template #content>
        <input
          type="text"
          v-model="sprachenData['description:de']"
          placeholder="Kürzel"
        />
      </template>
    </LanguageContainer>
    <LanguageContainer lang="en" title="Kürzel (EN)">
      <template #content>
        <input
          type="text"
          v-model="sprachenData['description:en']"
          placeholder="Shortname"
        />
      </template>
    </LanguageContainer>
    <div>
      <a
        style="margin-top: 15px; margin-bottom: 5px; text-decoration: underline;"
        href="https://www.welt-flaggen.de/register/laenderkuerzel/"
      >
        Liste der Länderkürzel
      </a>
      <p>
        Bitte die Kürzel der Länder von dieser Seite nehmen damit die Flaggen
        erscheinen. Über die Suche werden die Kürzel sofort dargestellt
        (2-Stellig).
      </p>
    </div>
  </div>
  <div class="content-row">
    <button
      class="button-primary"
      @click="props.editMode ? updateSprache() : createSprache()"
    >
      {{ buttonText }}
    </button>
    <div class="errorMessages">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<style></style>
