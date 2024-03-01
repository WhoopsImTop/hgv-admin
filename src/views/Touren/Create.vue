<script setup>
import imageCompression from "browser-image-compression";

import LanguageContainer from "../../components/LanguageContainer.vue";
import toggleSwitch from "../../components/customInputs/toggleSwitch.vue";
import GuideSelect from "../../components/customInputs/GuideSelect.vue";
import OrtSelect from "../../components/customInputs/OrtSelect.vue";
import KategorieSelect from "../../components/customInputs/KategorieSelect.vue";
import MobilitySelect from "../../components/customInputs/MobilitaetSelect.vue";
import MapComponent from "../../components/MapComponent.vue";
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

import { onBeforeMount, onMounted, ref, computed } from "vue";
//import router
import { useRouter } from "vue-router";

const tourData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
  location: {
    lat: 0,
    lng: 0,
  },
  status: "draft",
  is_public: false,
  date: null,
  duration: null,
  needs_registration: false,
  price: 0.0,
  guides: [],
  places: [],
  images: [],
  main_image: null,
  themes: [],
});

//custom inputs
const guideSelect = ref(null);
const ortSelect = ref(null);
const kategorieSelect = ref(null);
const mobilitySelect = ref(null);
const mapContainer = ref(null);

//data
const images = ref([]);
const main_image = ref(null);

const buttonText = ref("Tour erstellen");

const errors = ref([]);

const router = useRouter();

const computedPrice = computed(() => {
  const price = tourData.value.price.replace(",", ".").replace(/[^0-9.]/g, "");
  return price;
});

const computedDuration = computed(() => {
  const duration = tourData.value.duration
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  return duration;
});

const fileSizeError = ref("");
const fileToCompresse = ref(null);
const compressingImage = ref(false);

const compressFile = () => {
  compressingImage.value = true;
  //use browser image compression to compress image
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  if (fileToCompresse.value) {
    imageCompression(fileToCompresse.value, options)
      .then((compressedFile) => {
        const formData = new FormData();
        formData.append("file", compressedFile);

        axios
          .post("/media", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            images.value.push(res.data.media);
            compressingImage.value = false;
          })
          .catch((err) => {
            console.log(err);
            window.alert("Fehler beim Upload des Bildes");
            compressingImage.value = null;
          });
      })
      .catch((err) => {
        console.log(err);
        window.alert("Fehler beim Komprimieren des Bildes");
      });
  }
};

//functions
const uploadImage = (e) => {
  fileSizeError.value = "";
  const files = e.target.files;
  //get file size
  const fileSize = files[0].size / 1024 / 1024; // in MB
  if (fileSize > 1) {
    fileSizeError.value =
      "Bild(" + fileSize.toFixed(2) + "MB) ist zu groß (max. 1MB)";
    fileToCompresse.value = files[0];
    return;
  }
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
          images.value.push(res.data.media);
        })
        .catch((err) => {
          console.log(err);
          window.alert("Fehler beim Upload des Bildes");
        });
    }
  }
};

const removeImage = (id) => {
  images.value = images.value.filter((image) => image.id !== id);
};

const validateTourData = () => {
  errors.value = [];
  if (tourData.value["name:de"] === "") {
    errors.value.push("Titel der Tour (DE) ist ein Pflichtfeld");
  }
  if (tourData.value["name:en"] === "") {
    errors.value.push("Titel der Tour (EN) ist ein Pflichtfeld");
  }
  if (images.value.length === 0) {
    errors.value.push("Es muss mindestens ein Bild hochgeladen werden");
  }
  if (tourData.value.is_public) {
    if (tourData.value.date === null) {
      errors.value.push("Datum der Tour ist ein Pflichtfeld");
    }
    if (tourData.value.duration === null) {
      errors.value.push("Dauer der Tour ist ein Pflichtfeld");
    }
    if (tourData.value.price === null) {
      errors.value.push("Preis der Tour ist ein Pflichtfeld");
    }
  }
  return errors.value.length === 0;
};

const saveTour = () => {
  if (!validateTourData()) {
    return;
  }

  //getData on map
  const mapData = mapContainer.value.getData();
  tourData.value.location.lat = mapData.lat;
  tourData.value.location.lng = mapData.lng;

  //get content of tinymce editors
  tourData.value["description:de"] = tinymce.get("editor_de").getContent();
  tourData.value["description:en"] = tinymce.get("editor_en").getContent();

  //add images ids to tourData
  tourData.value.images = images.value.map((image) => image.id);

  const guides = guideSelect.value.getData();
  const places = ortSelect.value.getData();
  const themes = kategorieSelect.value.getData();
  const mobilities = mobilitySelect.value.getData();

  tourData.value.guides = guides;
  tourData.value.places = places;
  tourData.value.themes = themes;

  if (mobilities.length === 0) {
    tourData.value.mobilities = null;
  } else {
    tourData.value.mobilities = mobilities;
  }

  if (tourData.value.is_public) {
    tourData.value.price = computedPrice.value;
    tourData.value.duration = computedDuration.value;
  }

  axios
    .post("/tours", tourData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = "Tour wurde erstellt";
      router.push("/tour-bearbeiten/" + res.data.tour.id);
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Tour konnte nicht erstellt werden");
      }
    });
};

onMounted(async () => {
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
        editor.setContent(
          "<p>Starte hier mit der Beschreibung deiner Tour.</p>"
        );
      });
    },
  });
  document.addEventListener("input", () => {
    //notify user that he has unsaved changes if he wants to leave
    window.onbeforeunload = () => true;
  });
});

//remove tinymce editor on unmount
onBeforeMount(() => {
  tinymce.remove();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Tour erstellen</h1>
      <router-Link to="/" class="button-primary">Abbrechen</router-Link>
    </div>
    <hr class="divider" />
    <div class="creation-grid">
      <div class="main-content">
        <h4>Allgemeine Informationen</h4>
        <hr class="divider" />
        <div class="row content-row">
          <language-container lang="de" title="Titel der Tour">
            <template #content>
              <input
                type="text"
                for="title"
                placeholder="Titel"
                v-model="tourData['name:de']"
              />
            </template>
          </language-container>
          <language-container lang="en" title="title of the tour">
            <template #content>
              <input
                type="text"
                for="title"
                placeholder="Title"
                v-model="tourData['name:en']"
              />
            </template>
          </language-container>
        </div>
        <div class="row content-row">
          <language-container lang="de" title="Beschreibung der Tour">
            <template #content>
              <textarea
                for="description"
                placeholder="Beschreibung"
                id="editor_de"
                v-model="tourData['description:de']"
              ></textarea>
            </template>
          </language-container>
          <language-container lang="en" title="Description of the tour">
            <template #content>
              <textarea
                for="description"
                placeholder="Description"
                id="editor_en"
                v-model="tourData['description:en']"
              ></textarea>
            </template>
          </language-container>
        </div>
        <div class="content-row">
          <h4>Standort</h4>
          <hr class="divider" />
          <MapComponent ref="mapContainer" />
        </div>
        <div class="content-row">
          <h4>Bilder</h4>
          <hr class="divider" />
          <div class="images" v-if="images.length > 0">
            <div class="image" v-for="image in images" :key="image.id">
              <button
                class="removeImage"
                @click="removeImage(image.id)"
                draggable="true"
                @drop="reorderImages(image.id)"
                @dragover="allowDrop"
                @dragstart="dragImage"
              >
                <img src="@/assets/icons/delete.svg" width="25" height="25" />
              </button>
              <img :src="image.url" />
            </div>
          </div>
          <input type="file" @change="uploadImage" />
          <p class="error">{{ fileSizeError }}</p>
          <button
            v-if="fileSizeError"
            class="button-primary"
            @click="compressFile"
            :disabled="compressingImage"
          >
            {{ compressingImage ? "Komprimiere Bild..." : "Bild verkleinern" }}
          </button>
        </div>
        <div class="content-row">
          <toggle-switch
            :value="tourData.is_public"
            titel="Öffentliche Tour"
            @input="tourData.is_public = $event"
          />
          <div v-if="tourData.is_public">
            <hr class="divider" />
            <div class="input-container">
              <h5>Datum der Tour</h5>
              <input type="date" v-model="tourData.date" />
            </div>
            <div class="input-container">
              <h5>Wie lange geht die Tour</h5>
              <input
                type="text"
                v-model="tourData.duration"
                placeholder="bspw. 1,5 Stunden"
              />
            </div>
            <div class="input-container">
              <h5>Preis</h5>
              <input
                type="text"
                v-model="tourData.price"
                placeholder="bspw. 10.50€"
              />
            </div>
            <toggle-switch
              :value="tourData.needs_registration"
              titel="Anmeldung erforderlich"
              @input="tourData.needs_registration = $event"
            />
          </div>
        </div>
      </div>

      <div class="creation-sidebar">
        <div class="sidebar-item">
          <h4>Guide hinzufügen</h4>
          <hr class="divider" />
          <guide-select ref="guideSelect" />
        </div>
        <div class="sidebar-item">
          <h4>Ort hinzufügen</h4>
          <hr class="divider" />
          <ort-select ref="ortSelect" />
        </div>
        <div class="sidebar-item">
          <h4>Kategorien hinzufügen</h4>
          <hr class="divider" />
          <kategorie-select ref="kategorieSelect" />
        </div>
        <div class="sidebar-item">
          <h4>Mobilität hinzufügen</h4>
          <hr class="divider" />
          <mobility-select ref="mobilitySelect" />
        </div>
        <div class="sidebar-item">
          <h4>Veröffentlichen</h4>
          <hr class="divider" />
          <div class="input-container">
            <select v-model="tourData.status">
              <option value="draft">Entwurf</option>
              <option value="published">Veröffentlichen</option>
            </select>
          </div>
          <button class="button-primary" @click="saveTour">
            {{ buttonText }}
          </button>
          <div class="errorMessages">
            <p v-for="error in errors" :key="error">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.creation-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 1rem;
}

.main-content {
  grid-column: 1 / span 9;
  padding: 20px;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
}

.creation-sidebar {
  grid-column: 10 / span 3;
}

.sidebar-item {
  padding: 20px;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  margin-bottom: 10px;
}

.images {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  margin: 10px 0;
}

.image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  position: relative;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  overflow: hidden;
}

.removeImage {
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  padding: 2px;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.error {
  margin-top: 10px;
  margin-bottom: 15px;
  color: var(--error-color);
  font-weight: regular !important;
}
</style>
