<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

import LanguageContainer from "../../components/LanguageContainer.vue";

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

import { useRouter } from "vue-router";

const blogData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
  "short_description:de": "",
  "short_description:en": "",
  status: "entwurf",
  slug: "",
});

const uploadedImage = ref(null);

const imageUpload = ref(false);

const buttonText = ref("Erstellen");

const router = useRouter();

const validateblogData = () => {
  if (blogData.value["name:de"] === "") {
    window.alert("Bitte geben Sie einen Namen für die Blogbeitrag ein.");
    return false;
  }
  if (blogData.value["name:en"] === "") {
    window.alert("Bitte geben Sie einen Namen für die Blogbeitrag ein.");
    return false;
  }
  return true;
};

const savePage = () => {
  if (!validateblogData()) return;
  buttonText.value = "Speichern...";

  blogData.value["description:de"] = tinymce.get("editor_de").getContent();
  blogData.value["description:en"] = tinymce.get("editor_en").getContent();
  blogData.value["short_description:de"] = tinymce
    .get("short_description_editor_de")
    .getContent();
  blogData.value["short_description:en"] = tinymce
    .get("short_description_editor_en")
    .getContent();

  //generate a slug
  blogData.value.slug = blogData.value["name:de"]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  axios
    .post("/blogs", blogData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      window.onbeforeunload = null;
      router.push("/blog");
    })
    .catch((err) => {
      buttonText.value = "Erstellen";
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Die Blogbeitrag konnte nicht erstellt werden. Bitte versuche es erneut."
      );
    });
};

const uploadImage = (event) => {
  const formData = new FormData();
  formData.append("file", event.target.files[0]);

  axios
    .post("/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      uploadImage.value = response.data.media.url;
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 401) {
        //remove token and redirect to login
        window.alert("Sitzung abgelaufen. Bitte melden Sie sich erneut an.");
        sessionStorage.removeItem("token");
        window.location.reload();
      }
    });
};

const addImageToContent = () => {
  tinymce
    .get("editor_de")
    .execCommand(
      "mceInsertContent",
      false,
      `<img src="${uploadImage.value}" />`
    );
  tinymce
    .get("editor_en")
    .execCommand(
      "mceInsertContent",
      false,
      `<img src="${uploadImage.value}" />`
    );
  imageUpload.value = false;
};

onMounted(async () => {
  await tinymce.init({
    selector: "textarea",
    skin: false,
    mode: "none",
    content_css: false,
    content_style: contentUiCss.toString() + "\n" + contentCss.toString(),
    plugins: ["advlist code link lists table"],
    toolbar:
      "undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
  bullist numlist outdent indent | removeformat | table | link | code",
    menubar: false,
    statusbar: false,
    height: 300,
    setup: (editor) => {
      editor.on("init", () => {
        editor.setContent("<p></p>");
      });
    },
  });
  document.addEventListener("input", () => {
    //notify user that he has unsaved changes if he wants to leave
    window.onbeforeunload = () => true;
  });
});

onBeforeUnmount(() => {
  tinymce.remove();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Blogbeitrag erstellen</h1>
      <router-Link to="/blog" class="button-primary">Abbrechen</router-Link>
    </div>
    <hr class="divider" />
    <div class="grid-2-cols">
      <div class="col">
        <div class="row content-row">
          <LanguageContainer lang="de" title="Titel (DE)">
            <template #content>
              <input
                type="text"
                v-model="blogData['name:de']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Kurzbeschreibung">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="short_description_editor_de"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Inhalt der Seite">
            <template #content>
              <button
                class="button-primary"
                style="margin-bottom: 10px; width: max-content"
                @click="imageUpload = true"
              >
                Bild hochladen
              </button>

              <div v-if="imageUpload" class="imageUploader">
                <div class="row content-row">
                  <input type="file" @change="uploadImage" />
                </div>
                <div class="row">
                  <button class="button-primary" @click="addImageToContent">
                    Bild einsetzen
                  </button>
                  <button class="button-secondary" @click="imageUpload = false">
                    Abbrechen
                  </button>
                </div>
              </div>

              <textarea
                for="description"
                placeholder="Beschreibung"
                id="editor_de"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
      </div>
      <div class="col">
        <div class="row content-row">
          <LanguageContainer lang="en" title="Titel (EN)">
            <template #content>
              <input
                type="text"
                v-model="blogData['name:en']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Short Description">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="short_description_editor_en"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Content of the Page">
            <template #content>
              <textarea
                for="description"
                placeholder="Description"
                id="editor_en"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
      </div>
    </div>
    <div class="content-row">
      <button class="button-primary" @click="savePage()">
        {{ buttonText }}
      </button>
      <div class="errorMessages">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.imageUploader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  width: 500px;
  z-index: 999;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
}

.grid-2-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>
