<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import LanguageContainer from "../LanguageContainer.vue";

import axios from "axios";

import tinymce from "tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/skins/ui/oxide/skin.css";

/* Import plugins */
import "tinymce/plugins/advlist";
import "tinymce/plugins/code";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";

/* Import content css */
import contentUiCss from "tinymce/skins/ui/oxide/content.css?inline";
import contentCss from "tinymce/skins/content/default/content.css?inline";

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

const emit = defineEmits(["closePopup", "newMobility"]);

const mobilitaetData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
});

const errors = ref([]);

const buttonText = ref(
  props.editMode ? "Mobilität aktualisieren" : "Mobilität erstellen"
);
const imagePreview = ref(null);

const router = useRouter();

const validateMobilitaetData = () => {
  errors.value = [];
  if (mobilitaetData.value["name:de"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (DE) ein");
  }
  if (mobilitaetData.value["name:en"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (EN) ein");
  }
  return errors.value.length === 0;
};

const createMobilitaet = () => {
  if (!validateMobilitaetData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Mobilität aktualisieren..."
    : "Mobilität erstellen...";

  //get tinymce content
  mobilitaetData.value["description:de"] = tinymce
    .get("editor_de")
    .getContent();
  mobilitaetData.value["description:en"] = tinymce
    .get("editor_en")
    .getContent();

  axios
    .post("/mobility", mobilitaetData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode
        ? "Mobilität aktualisieren"
        : "Mobilität erstellen";
      if (props.insidePopup) {
        emit("newMobility", res.data.mobility);
      } else {
        //push to guide overview
        router.push("/mobilitaet");
      }
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Mobilität aktualisieren"
        : "Mobilität erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Erstellen der Mobilität");
      }
    });
};

const updateMobilitaet = () => {
  if (!validateMobilitaetData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Mobilität aktualisieren..."
    : "Mobilität erstellen...";

  //get tinymce content
  mobilitaetData.value["description:de"] = tinymce
    .get("editor_de")
    .getContent();
  mobilitaetData.value["description:en"] = tinymce
    .get("editor_en")
    .getContent();

  if (mobilitaetData.value.main_image !== null) {
    mobilitaetData.value.main_image = mobilitaetData.value.main_image.id;
  }

  if (mobilitaetData.value.tours !== null) {
    mobilitaetData.value.tours = mobilitaetData.value.tours.map((tour) => {
      return tour.id;
    });
  }

  if (mobilitaetData.value.guides !== null) {
    mobilitaetData.value.guides = mobilitaetData.value.guides.map((guide) => {
      return guide.id;
    });
  }

  axios
    .patch(
      `/mobility/${props.id}`,
      mobilitaetData.value,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
    .then((res) => {
      buttonText.value = props.editMode
        ? "Mobilität aktualisieren"
        : "Mobilität erstellen";
      //push to guide overview
      router.push("/mobilitaet");
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Mobilität aktualisieren"
        : "Mobilität erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Aktualisieren der Mobilität");
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
          mobilitaetData.value.main_image = res.data.media.id;
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
    loadMobilitaetData();
  }
  tinymce.init({
    selector: "textarea",
    skin: false,
    mode: "none",
    content_css: false,
    content_style: contentUiCss.toString() + "\n" + contentCss.toString(),
    plugins: ["advlist code link lists table"],
    toolbar:
      "undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | table",
    menubar: false,
    statusbar: false,
    height: 200,
    setup: (editor) => {
      editor.on("init", () => {
        editor.setContent("<p>Mobilitäts Beschreibung</p>");
      });
    },
  });
  document.addEventListener("input", () => {
    //notify user that he has unsaved changes if he wants to leave
    window.onbeforeunload = () => true;
  });
});

const loadMobilitaetData = () => {
  axios
    .get(`/mobility/${props.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      mobilitaetData.value = res.data.mobility;
      //map data to sprachenData
      mobilitaetData.value["name:de"] = res.data.mobility.translations[0].name;
      mobilitaetData.value["name:en"] = res.data.mobility.translations[1].name;
      mobilitaetData.value.main_image = res.data.mobility.main_image;
      //set image preview
      if (res.data.mobility.main_image !== null) {
        imagePreview.value = res.data.mobility.main_image.url;
      }

      //set tinymce content
      tinymce
        .get("editor_de")
        .setContent(res.data.mobility.translations[0].description);
      tinymce
        .get("editor_en")
        .setContent(res.data.mobility.translations[1].description);
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
      {{ props.editMode ? "Mobilität Aktualisieren" : "Mobilität Erstellen" }}
    </h1>
    <router-Link
      v-if="!props.insidePopup"
      to="/mobilitaet"
      class="button-primary"
      >Abbrechen</router-Link
    >
    <button v-else class="button-primary" @click="emit('closePopup')">
      Abbrechen
    </button>
  </div>
  <hr class="divider" />
  <div class="row content-row">
    <LanguageContainer lang="de" title="Mobilität (DE)">
      <template #content>
        <input
          type="text"
          v-model="mobilitaetData['name:de']"
          placeholder="Name"
        />
      </template>
    </LanguageContainer>
    <LanguageContainer lang="en" title="Mobilität (EN)">
      <template #content>
        <input
          type="text"
          v-model="mobilitaetData['name:en']"
          placeholder="Name"
        />
      </template>
    </LanguageContainer>
  </div>
  <div class="row content-row">
    <LanguageContainer lang="de" title="Beschreibung">
      <template #content>
        <textarea
          for="description"
          placeholder="Beschreibung"
          id="editor_de"
        ></textarea>
      </template>
    </LanguageContainer>
    <LanguageContainer lang="en" title="Description">
      <template #content>
        <textarea
          for="description"
          placeholder="Description"
          id="editor_en"
        ></textarea>
      </template>
    </LanguageContainer>
  </div>
  <div class="content-row">
    <button
      class="button-primary"
      @click="props.editMode ? updateMobilitaet() : createMobilitaet()"
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