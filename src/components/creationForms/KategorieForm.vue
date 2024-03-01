<script setup>
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
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

const emit = defineEmits(["closePopup", "newTheme"]);

const kategorieData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
});

const errors = ref([]);

const buttonText = ref(
  props.editMode ? "Kategorie aktualisieren" : "Kategorie erstellen"
);
const imagePreview = ref(null);

const router = useRouter();

const validateKategorieData = () => {
  errors.value = [];
  if (kategorieData.value["name:de"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (DE) ein");
  }
  if (kategorieData.value["name:en"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (EN) ein");
  }
  return errors.value.length === 0;
};

const createKategorie = () => {
  if (!validateKategorieData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Kategorie aktualisieren..."
    : "Kategorie erstellen...";

  //duplicate german name to english name if not set
  if (kategorieData.value["name:en"] === "") {
    kategorieData.value["name:en"] = kategorieData.value["name:de"];
  }

  //duplicate german description to english description if not set
  if (kategorieData.value["description:en"] === "") {
    kategorieData.value["description:en"] =
      kategorieData.value["description:de"];
  }

  axios
    .post("/themes", kategorieData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode
        ? "Kategorie aktualisieren"
        : "Kategorie erstellen";
      if (props.insidePopup) {
        emit("newTheme", res.data.theme);
      } else {
        router.push("/kategorien");
      }
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Kategorie aktualisieren"
        : "Kategorie erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Erstellen de Kategorie");
      }
    });
};

const updateKategorie = () => {
  if (!validateKategorieData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Kategorie aktualisieren..."
    : "Kategorie erstellen...";

  if (kategorieData.value.image && kategorieData.value.image !== null) {
    kategorieData.value.image = kategorieData.value.image.id;
  }

  if (kategorieData.value.tours !== null) {
    kategorieData.value.tours = kategorieData.value.tours.map((tour) => {
      return tour.id;
    });
  }

  axios
    .patch(
      `/themes/${props.id}`,
      kategorieData.value,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
    .then((res) => {
      buttonText.value = props.editMode
        ? "Kategorie aktualisieren"
        : "Kategorie erstellen";
      //push to guide overview
      router.push("/kategorien");
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Kategorie aktualisieren"
        : "Kategorie erstellen";
      if (err.response && err.response.status && err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Aktualisieren der Kategorie");
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
          kategorieData.value.image = res.data.media.id;
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
    loadkategorieData();
  }
});

const loadkategorieData = () => {
  axios
    .get(`/themes/${props.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      kategorieData.value = res.data.theme;
      //map data to kategorieData
      kategorieData.value["name:de"] = res.data.theme.translations[0].name;
      kategorieData.value["name:en"] = res.data.theme.translations[1].name;
      kategorieData.value.image = res.data.theme.image;
      //set image preview
      if (res.data.theme.image && res.data.theme.image !== null) {
        imagePreview.value = res.data.theme.image.url;
      }
    })
    .catch((err) => {
      if (err.response && err.response.status && err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        console.log(err);
      }
    });
};

//remove tinymce editor on unmount
onBeforeUnmount(() => {
  if (!props.insidePopup) {
    tinymce.remove();
  }
});
</script>

<template>
  <div class="row">
    <h1>
      {{ props.editMode ? "Kategorie Aktualisieren" : "Kategorie Erstellen" }}
    </h1>
    <router-Link
      v-if="!props.insidePopup"
      to="/kategorien"
      class="button-primary"
      >Abbrechen</router-Link
    >
    <button v-else class="button-primary" @click="emit('closePopup')">
      Abbrechen
    </button>
  </div>
  <hr class="divider" />
  <div class="row content-row">
    <LanguageContainer lang="de" title="Kategorie (DE)">
      <template #content>
        <input
          type="text"
          v-model="kategorieData['name:de']"
          placeholder="Name"
        />
      </template>
    </LanguageContainer>
    <LanguageContainer lang="en" title="Kategorie (EN)">
      <template #content>
        <input
          type="text"
          v-model="kategorieData['name:en']"
          placeholder="Name"
        />
      </template>
    </LanguageContainer>
  </div>
  <div class="content-row">
    <button
      class="button-primary"
      @click="props.editMode ? updateKategorie() : createKategorie()"
    >
      {{ buttonText }}
    </button>
    <div class="errorMessages">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<style>
</style>