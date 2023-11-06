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

const emit = defineEmits(["closePopup", "newPlace"]);

const placeData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
});

const errors = ref([]);

const buttonText = ref(props.editMode ? "Ort aktualisieren" : "Ort erstellen");
const imagePreview = ref(null);

const router = useRouter();

const validateplaceData = () => {
  errors.value = [];
  if (placeData.value["name:de"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (DE) ein");
  }
  if (placeData.value["name:en"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (EN) ein");
  }
  return errors.value.length === 0;
};

const createOrt = () => {
  if (!validateplaceData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Ort aktualisieren..."
    : "Ort erstellen...";

  axios
    .post("/places", placeData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode ? "Ort aktualisieren" : "Ort erstellen";
      if (props.insidePopup) {
        emit("newPlace", res.data.place);
      } else {
        router.push("/orte");
      }
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode ? "Ort aktualisieren" : "Ort erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Erstellen des Ortes");
      }
    });
};

const updateOrt = () => {
  if (!validateplaceData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Ort aktualisieren..."
    : "Ort erstellen...";

  if (placeData.value.main_image !== null) {
    placeData.value.main_image = placeData.value.main_image.id;
  }

  if (placeData.value.tours !== null) {
    placeData.value.tours = placeData.value.tours.map((tour) => {
      return tour.id;
    });
  }

  axios
    .patch(`/places/${props.id}`, placeData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode ? "Ort aktualisieren" : "Ort erstellen";
      //push to guide overview
      router.push("/orte");
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode ? "Ort aktualisieren" : "Ort erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Aktualisieren des Ortes");
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
          placeData.value.main_image = res.data.media.id;
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
    loadplaceData();
  }
});

const loadplaceData = () => {
  axios
    .get(`/places/${props.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      placeData.value = res.data.place;
      //map data to placeData
      placeData.value["name:de"] = res.data.place.translations[0].name;
      placeData.value["name:en"] = res.data.place.translations[1].name;
      placeData.value.main_image = res.data.place.main_image;
      //set image preview
      if (res.data.place.main_image !== null) {
        imagePreview.value = res.data.place.main_image.url;
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
    <h1>{{ props.editMode ? "Ort Aktualisieren" : "Ort Erstellen" }}</h1>
    <router-Link v-if="!props.insidePopup" to="/orte" class="button-primary"
      >Abbrechen</router-Link
    >
    <button v-else class="button-primary" @click="emit('closePopup')">
      Abbrechen
    </button>
  </div>
  <hr class="divider" />
  <div class="row content-row">
    <LanguageContainer lang="de" title="Ort (DE)">
      <template #content>
        <input type="text" v-model="placeData['name:de']" placeholder="Name" />
      </template>
    </LanguageContainer>
    <LanguageContainer lang="en" title="Ort (EN)">
      <template #content>
        <input type="text" v-model="placeData['name:en']" placeholder="Name" />
      </template>
    </LanguageContainer>
  </div>
  <div class="content-row">
    <button
      class="button-primary"
      @click="props.editMode ? updateOrt() : createOrt()"
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