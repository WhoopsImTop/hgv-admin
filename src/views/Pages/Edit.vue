<script setup>
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

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

const pageData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
  status: "entwurf",
  slug: "",
});

const buttonText = ref("Erstellen");

const route = useRoute();
const router = useRouter();

const validatePageData = () => {
  if (pageData.value["name:de"] === "") {
    window.alert("Bitte geben Sie einen Namen für die Seite ein.");
    return false;
  }
  if (pageData.value["name:en"] === "") {
    window.alert("Bitte geben Sie einen Namen für die Seite ein.");
    return false;
  }
  return true;
};

const savePage = () => {
  if (!validatePageData()) return;
  buttonText.value = "Speichern...";

  pageData.value["description:de"] = tinymce.get("editor_de").getContent();
  pageData.value["description:en"] = tinymce.get("editor_en").getContent();

  //generate a slug
  pageData.value.slug = pageData.value["name:de"]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  axios
    .patch("/pages/" + route.params.id, pageData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      window.onbeforeunload = null;
      router.push("/pages");
    })
    .catch((err) => {
      buttonText.value = "Erstellen";
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Die Seite konnte nicht gespeichert werden. Bitte versuche es erneut."
      );
    });
};

onMounted(async () => {
  if (route.params.id) {
    const res = await axios.get(`/pages/${route.params.id}`);
    pageData.value["name:de"] = res.data.translations[0].name;
    pageData.value["name:en"] = res.data.translations[1].name;
    pageData.value["description:de"] = res.data.translations[0].description;
    pageData.value["description:en"] = res.data.translations[1].description;
    pageData.value.status = res.data.status;
    buttonText.value = "Aktualisieren";
  }

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
    height: 600,
    setup: (editor) => {
      editor.on("init", () => {
        editor.setContent("<p></p>");
      });
    },
  });

  //set content of tinymce editors
  setTimeout(() => {
    tinymce.get("editor_de").setContent(pageData.value["description:de"]);
    tinymce.get("editor_en").setContent(pageData.value["description:en"]);
  }, 100);
});

onBeforeUnmount(() => {
  tinymce.remove();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Seite erstellen</h1>
      <router-Link to="/pages" class="button-primary">Abbrechen</router-Link>
    </div>
    <hr class="divider" />
    <div class="row content-row">
      <LanguageContainer lang="de" title="Titel (DE)">
        <template #content>
          <input type="text" v-model="pageData['name:de']" placeholder="Name" />
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
    </div>
    <div class="row content-row">
      <LanguageContainer lang="en" title="Titel (EN)">
        <template #content>
          <input type="text" v-model="pageData['name:en']" placeholder="Name" />
        </template>
      </LanguageContainer>
    </div>
    <div class="row content-row">
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
      <button class="button-primary" @click="savePage()">
        {{ buttonText }}
      </button>
      <div class="errorMessages">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </div>
    </div>
  </main>
</template>
