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

const emit = defineEmits(["closePopup", "newCertificate"]);

const certificateData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
  image: null,
});

const errors = ref([]);

const buttonText = ref(
  props.editMode ? "Zertifikat aktualisieren" : "Zertifikat erstellen"
);
const imagePreview = ref(null);

const router = useRouter();

const validateCertificateData = () => {
  errors.value = [];
  if (certificateData.value["name:de"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (DE) ein");
  }
  if (certificateData.value["name:en"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (EN) ein");
  }
  return errors.value.length === 0;
};

const createCertificate = () => {
  if (!validateCertificateData()) {
    return;
  }

  buttonText.value = props.editMode
    ? "Zertifikat aktualisieren..."
    : "Zertifikat erstellen...";

  //get tinymce content
  certificateData.value["description:de"] = tinymce
    .get("editor_de")
    .getContent();
  certificateData.value["description:en"] = tinymce
    .get("editor_en")
    .getContent();

  axios
    .post("/certificates", certificateData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode
        ? "Zertifikat aktualisieren"
        : "Zertifikat erstellen";
      if (props.insidePopup) {
        emit("newCertificate", res.data.certificate);
      } else {
        router.push("/zertifikate");
      }
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Zertifikat aktualisieren"
        : "Zertifikat erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Erstellen der Zertifikat");
      }
    });
};

const updateCertificate = () => {
  if (!validateCertificateData()) {
    return;
  }

  buttonText.value = props.editMode
    ? "Zertifikat aktualisieren..."
    : "Zertifikat erstellen...";

  //get tinymce content
  certificateData.value["description:de"] = tinymce
    .get("editor_de")
    .getContent();
  certificateData.value["description:en"] = tinymce
    .get("editor_en")
    .getContent();
  console.log(certificateData.value);
  if (certificateData.value.image && certificateData.value.image !== null) {
    certificateData.value.image = certificateData.value.image;
  }

  axios
    .patch(`/certificates/${props.id}`, certificateData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode
        ? "Zertifikat aktualisieren"
        : "Zertifikat erstellen";
      //push to guide overview
      router.push("/zertifikate");
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Zertifikat aktualisieren"
        : "Zertifikat erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Aktualisieren der Zertifikat");
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
          certificateData.value.image = res.data.media.id;
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
    loadcertificateData();
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
        editor.setContent("<p>Zertifikats Beschreibung</p>");
      });
    },
  });
  document.addEventListener("input", () => {
    //notify user that he has unsaved changes if he wants to leave
    window.onbeforeunload = () => true;
  });
});

const loadcertificateData = () => {
  axios
    .get(`/certificates/${props.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      certificateData.value = res.data.certificate;
      //map data to sprachenData
      certificateData.value["name:de"] =
        res.data.certificate.translations[0].name;
      certificateData.value["name:en"] =
        res.data.certificate.translations[1].name;
      
      if(res.data.certificate.image && res.data.certificate.image !== null) {
        certificateData.value.image = res.data.certificate.image;
      }
      //set image preview
      if (res.data.certificate.image !== null) {
        imagePreview.value = res.data.certificate.image.url;
      }

      //set tinymce content
      tinymce
        .get("editor_de")
        .setContent(res.data.certificate.translations[0].description);
      tinymce
        .get("editor_en")
        .setContent(res.data.certificate.translations[1].description);
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
      {{ props.editMode ? "Zertifikat Aktualisieren" : "Zertifikat Erstellen" }}
    </h1>
    <router-Link
      v-if="!props.insidePopup"
      to="/zertifikate"
      class="button-primary"
      >Abbrechen</router-Link
    >
    <button v-else class="button-primary" @click="emit('closePopup')">
      Abbrechen
    </button>
  </div>
  <hr class="divider" />
  <div class="row content-row">
    <LanguageContainer lang="de" title="Zertifikat (DE)">
      <template #content>
        <input
          type="text"
          v-model="certificateData['name:de']"
          placeholder="Name"
        />
      </template>
    </LanguageContainer>
    <LanguageContainer lang="en" title="Zertifikat (EN)">
      <template #content>
        <input
          type="text"
          v-model="certificateData['name:en']"
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
    <h3>Zertifikat Bild</h3>
    <hr class="divider" />
    <div class="image" v-if="imagePreview">
      <img :src="imagePreview" />
    </div>
    <div class="row">
      <div class="col">
        <input type="file" @change="uploadImage" />
      </div>
    </div>
  </div>
  <div class="content-row">
    <button
      class="button-primary"
      @click="props.editMode ? updateCertificate() : createCertificate()"
    >
      {{ buttonText }}
    </button>
    <div class="errorMessages">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<style>
.image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  position: relative;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
