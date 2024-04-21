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

const landingPageData = ref({
  "landing_component_title:de": "",
  "landing_component_title:en": "",
  "landing_component_description:de": "",
  "landing_component_description:en": "",
  "tour_component_title:de": "",
  "tour_component_title:en": "",
  "tour_component_description:de": "",
  "tour_component_description:en": "",
  "public_tour_component_title:de": "",
  "public_tour_component_title:en": "",
  "public_tour_component_description:de": "",
  "public_tour_component_description:en": "",
  "guide_component_title:de": "",
  "guide_component_title:en": "",
  "guide_component_description:de": "",
  "guide_component_description:en": "",
});

const buttonText = ref("Erstellen");

const router = useRouter();

const savePage = () => {
  buttonText.value = "Speichern...";

  landingPageData.value["landing_component_description:de"] =
    tinymce.get("landing_component_description_de").getContent() || "";
  landingPageData.value["landing_component_description:en"] =
    tinymce.get("landing_component_description_en").getContent() || "";
  landingPageData.value["tour_component_description:de"] =
    tinymce.get("tour_component_description_de").getContent() || "";
  landingPageData.value["tour_component_description:en"] =
    tinymce.get("tour_component_description_en").getContent() || "";
  landingPageData.value["public_tour_component_description:de"] =
    tinymce.get("public_tour_component_description_de").getContent() || "";
  landingPageData.value["public_tour_component_description:en"] =
    tinymce.get("public_tour_component_description_en").getContent() || "";
  landingPageData.value["guide_component_description:de"] =
    tinymce.get("guide_component_description_de").getContent() || "";
  landingPageData.value["guide_component_description:en"] =
    tinymce.get("guide_component_description_en").getContent() || "";

  axios
    .patch("/landingpages/4", landingPageData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      window.onbeforeunload = null;
      router.push("/");
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

  getData();
});

const getData = () => {
  axios
    .get("/landingpages/4", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      landingPageData.value = response.data;

      tinymce
        .get("landing_component_description_de")
        .setContent(response.data.translations[0].landing_component_description || "");
      tinymce
        .get("landing_component_description_en")
        .setContent(response.data.translations[1].landing_component_description || "");
      tinymce
        .get("tour_component_description_de")
        .setContent(response.data.translations[0].tour_component_description || "");
      tinymce
        .get("tour_component_description_en")
        .setContent(response.data.translations[1].tour_component_description || "");
      tinymce
        .get("public_tour_component_description_de")
        .setContent(
          response.data.translations[0].public_tour_component_description || ""
        );
      tinymce
        .get("public_tour_component_description_en")
        .setContent(
          response.data.translations[1].public_tour_component_description || ""
        );
      tinymce
        .get("guide_component_description_de")
        .setContent(response.data.translations[0].guide_component_description || "");
      tinymce
        .get("guide_component_description_en")
        .setContent(response.data.translations[1].guide_component_description || "");

      landingPageData.value["landing_component_title:de"] =
        response.data.translations[0].landing_component_title || "";

      landingPageData.value["landing_component_title:en"] =
        response.data.translations[1].landing_component_title || "";

      landingPageData.value["tour_component_title:de"] =
        response.data.translations[0].tour_component_title || "";

      landingPageData.value["tour_component_title:en"] =
        response.data.translations[1].tour_component_title || "";

      landingPageData.value["public_tour_component_title:de"] =
        response.data.translations[0].public_tour_component_title || "";

      landingPageData.value["public_tour_component_title:en"] =
        response.data.translations[1].public_tour_component_title || "";

      landingPageData.value["guide_component_title:de"] =
        response.data.translations[0].guide_component_title || "";

      landingPageData.value["guide_component_title:en"] =
        response.data.translations[1].guide_component_title || "";
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

onBeforeUnmount(() => {
  tinymce.remove();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Startseite Texte</h1>
      <router-Link to="/" class="button-primary">Abbrechen</router-Link>
    </div>
    <hr class="divider" />
    <div class="grid-2-cols">
      <div class="col">
        <div class="row content-row">
          <LanguageContainer lang="de" title="Überschrift">
            <template #content>
              <input
                type="text"
                v-model="landingPageData['landing_component_title:de']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Text">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="landing_component_description_de"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Überschrift">
            <template #content>
              <input
                type="text"
                v-model="landingPageData['tour_component_title:de']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Text">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="tour_component_description_de"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Überschrift">
            <template #content>
              <input
                type="text"
                v-model="landingPageData['public_tour_component_title:de']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Text">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="public_tour_component_description_de"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Überschrift">
            <template #content>
              <input
                type="text"
                v-model="landingPageData['guide_component_title:de']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="de" title="Text">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="guide_component_description_de"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
      </div>
      <div class="col">
        <div class="row content-row">
          <LanguageContainer lang="en" title="Überschrift">
            <template #content>
              <input
                type="text"
                v-model="landingPageData['landing_component_title:en']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Text">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="landing_component_description_en"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Überschrift">
            <template #content>
              <input
                type="text"
                v-model="landingPageData['tour_component_title:en']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Text">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="tour_component_description_en"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Überschrift">
            <template #content>
              <input
                type="text"
                v-model="landingPageData['public_tour_component_title:en']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Text">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="public_tour_component_description_en"
              ></textarea>
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Überschrift">
            <template #content>
              <input
                type="text"
                v-model="landingPageData['guide_component_title:en']"
                placeholder="Name"
              />
            </template>
          </LanguageContainer>
        </div>
        <div class="row content-row">
          <LanguageContainer lang="en" title="Text">
            <template #content>
              <textarea
                for="short_description"
                placeholder="Beschreibung"
                id="guide_component_description_en"
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
