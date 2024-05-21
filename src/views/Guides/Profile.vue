<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import LanguageContainer from "../../components/LanguageContainer.vue";

import CertificateSelect from "../../components/customInputs/CertificateSelect.vue";
import SprachenSelect from "../../components/customInputs/SprachenSelect.vue";
import SkillSelect from "../../components/customInputs/SkillSelect.vue";
import MobilitaetSelect from "../../components/customInputs/MobilitaetSelect.vue";

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
  showButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["closePopup", "newGuide"]);

//custom inputs
const certificateSelect = ref(null);
const languageSelect = ref(null);
const mobilitySelect = ref(null);
const skillSelect = ref(null);

const guideData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
  contact: {},
  image: null,
  languages: [],
  skills: [],
  mobility: [],
  certificates: [],
});

const passwordData = ref({
  oldPassword: "",
  newPassword: "",
  newPasswordRepeat: "",
});

const changePassword = () => {
  if (passwordData.value.newPassword !== passwordData.value.newPasswordRepeat) {
    window.alert("Die neuen Passwörter stimmen nicht überein");
    return;
  }

  if (guideData.tours !== null) {
    guideData.value.tours = guideData.value.tours.map((tour) => {
      return tour.id;
    });
  }

  if (guideData.languages !== null) {
    guideData.value.languages = guideData.value.languages.map((language) => {
      return language.id;
    });
  }

  if (guideData.skills !== null) {
    guideData.value.skills = guideData.value.skills.map((skill) => {
      return skill.id;
    });
  }

  if (guideData.mobility !== null) {
    guideData.value.mobility = guideData.value.mobility.map((mobility) => {
      return mobility.id;
    });
  }

  if (guideData.certificates !== null) {
    guideData.value.certificates = guideData.value.certificates.map(
      (certificate) => {
        return certificate.id;
      }
    );
  }

  //if guideData.image is object get id key
  if (
    typeof guideData.value.image === "object" &&
    guideData.value.image !== null
  ) {
    guideData.value.image = guideData.value.image.id;
  }

  guideData.value["description:de"] = tinymce.get("editor_de").getContent();
  guideData.value["description:en"] = tinymce.get("editor_en").getContent();

  const certificates = certificateSelect.value.getData();
  const languages = languageSelect.value.getData();
  const mobility = mobilitySelect.value.getData();
  const skills = skillSelect.value.getData();

  guideData.value.certificates = certificates;
  guideData.value.languages = languages;
  guideData.value.mobility = mobility;
  guideData.value.skills = skills;

  let requestBody = guideData.value;
  requestBody.password = passwordData.value.newPassword;

  axios
    .patch(`/guides/${route.params.id}`, requestBody, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      window.alert("Passwort erfolgreich geändert");
      passwordData.value = {
        oldPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      };
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("guideId");
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        window.alert(
          "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an"
        );
        sessionStorage.removeItem("token");
        window.location.reload();
      } else {
        window.alert(
          "Fehler beim Ändern des Passworts. " + 
          err.response.data.error
        );
        window.location.reload();
      }
    });
};

const errors = ref([]);

const buttonText = ref("Profil aktualisieren");
const imagePreview = ref(null);

const route = useRoute();

const validateGuideData = () => {
  const certificates = certificateSelect.value.getData();
  const languages = languageSelect.value.getData();
  const mobility = mobilitySelect.value.getData();
  const skills = skillSelect.value.getData();

  guideData.value.certificates = certificates;
  guideData.value.languages = languages;
  guideData.value.mobility = mobility;
  guideData.value.skills = skills;

  errors.value = [];
  if (guideData.value["name:de"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (DE) ein");
  }
  if (guideData.value["name:en"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (EN) ein");
  }
  if (guideData.value.languages.length === 0) {
    errors.value.push("Bitte wählen Sie mindestens eine Sprache aus");
  }
  return errors.value.length === 0;
};

const updateGuide = () => {
  if (!validateGuideData()) {
    return;
  }

  buttonText.value = "Profil wird aktualisiert...";

  if (guideData.tours !== null) {
    guideData.value.tours = guideData.value.tours.map((tour) => {
      return tour.id;
    });
  }

  if (guideData.languages !== null) {
    guideData.value.languages = guideData.value.languages.map((language) => {
      return language.id;
    });
  }

  if (guideData.skills !== null) {
    guideData.value.skills = guideData.value.skills.map((skill) => {
      return skill.id;
    });
  }

  if (guideData.mobility !== null) {
    guideData.value.mobility = guideData.value.mobility.map((mobility) => {
      return mobility.id;
    });
  }

  if (guideData.certificates !== null) {
    guideData.value.certificates = guideData.value.certificates.map(
      (certificate) => {
        return certificate.id;
      }
    );
  }

  //if guideData.image is object get id key
  if (
    typeof guideData.value.image === "object" &&
    guideData.value.image !== null
  ) {
    guideData.value.image = guideData.value.image.id;
  }

  guideData.value["description:de"] = tinymce.get("editor_de").getContent();
  guideData.value["description:en"] = tinymce.get("editor_en").getContent();

  const certificates = certificateSelect.value.getData();
  const languages = languageSelect.value.getData();
  const mobility = mobilitySelect.value.getData();
  const skills = skillSelect.value.getData();

  guideData.value.certificates = certificates;
  guideData.value.languages = languages;
  guideData.value.mobility = mobility;
  guideData.value.skills = skills;

  axios
    .patch(`/guides/${route.params.id}`, guideData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = "Profil aktualisieren";
      window.alert("Profil erfolgreich aktualisiert");
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = "Profil aktualisieren";
      if (err.response.status === 401) {
        window.alert(
          "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an"
        );
        sessionStorage.removeItem("token");
        window.location.reload();
      } else {
        window.alert("Fehler beim Aktualisieren des Guides");
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
          guideData.value.image = res.data.media.id;
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
  loadGuideData();
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
        editor.setContent("<p></p>");
      });
    },
  });
  document.addEventListener("input", () => {
    //notify user that he has unsaved changes if he wants to leave
    window.onbeforeunload = () => true;
  });
});

const loadGuideData = () => {
  axios
    .get(`/guides/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      guideData.value = res.data.guide;
      //map data to guideData
      guideData.value["name:de"] = res.data.guide.translations[0].name;
      guideData.value["name:en"] = res.data.guide.translations[1].name;
      guideData.value["description:de"] =
        res.data.guide.translations[0].description;
      guideData.value["description:en"] =
        res.data.guide.translations[1].description;
      if (
        res.data.guide.contact !== null &&
        !Array.isArray(JSON.parse(res.data.guide.contact))
      ) {
        guideData.value.contact = JSON.parse(res.data.guide.contact);
      } else {
        guideData.value.contact = {};
      }

      imagePreview.value = res.data.guide.image
        ? res.data.guide.image[0].url
        : null;
      guideData.value.languages = res.data.guide.languages;
      guideData.value.skills = res.data.guide.skills;
      guideData.value.mobility = res.data.guide.mobility;
      guideData.value.certificates = res.data.guide.certificates;
      //set image preview
      if (res.data.guide.image !== null) {
        imagePreview.value = res.data.guide.image[0].url;
      }
      //set tinymce content
      tinymce
        .get("editor_de")
        .setContent(res.data.guide.translations[0].description || "");
      tinymce
        .get("editor_en")
        .setContent(res.data.guide.translations[1].description || "");

      console.log(guideData);
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        window.alert(
          "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an"
        );
        sessionStorage.removeItem("token");
        window.location.reload();
      } else {
        console.log(err);
      }
    });
};

const removeImage = () => {
  guideData.value.image = null;
  imagePreview.value = null;
};

//remove tinymce editor on unmount
onBeforeMount(() => {
  if (!props.insidePopup) {
    tinymce.remove();
  }
});
</script>

<template>
  <div class="profile-container">
    <h1>Profil Aktualisieren</h1>
    <hr class="divider" />
    <div class="row content-row">
      <LanguageContainer lang="de" title="Name">
        <template #content>
          <input
            type="text"
            v-model="guideData['name:de']"
            placeholder="Name"
          />
        </template>
      </LanguageContainer>
      <LanguageContainer lang="en" title="Name">
        <template #content>
          <input
            type="text"
            v-model="guideData['name:en']"
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
      <h3>Guide Eigenschaften</h3>
      <hr class="divider" />
      <div class="row">
        <div class="col" style="width: 23%; min-width: 200px">
          <span>Zertifikatsauswahl</span>
          <CertificateSelect
            ref="certificateSelect"
            :selected-certificate="guideData.certificates"
          />
        </div>
        <div class="col" style="width: 23%; min-width: 200px">
          <span>Sprachauswahl</span>
          <SprachenSelect
            ref="languageSelect"
            :selected-languages="guideData.languages"
          />
        </div>
        <div class="col" style="width: 23%; min-width: 200px">
          <span>Mobilitätsauswahl</span>
          <MobilitaetSelect
            ref="mobilitySelect"
            :selected-mobilites="guideData.mobility"
          />
        </div>
        <div class="col" style="width: 23%; min-width: 200px">
          <span>Themenauswahl</span>
          <SkillSelect ref="skillSelect" :selected-skills="guideData.skills" />
        </div>
      </div>
    </div>
    <div class="content-row">
      <h3>Kontakt</h3>
      <hr class="divider" />
      <div class="row">
        <div class="col">
          <span>Email</span>
          <input
            type="text"
            placeholder="Email"
            v-model="guideData.contact.email"
          />
        </div>
        <div class="col">
          <span>Telefon</span>
          <input
            type="text"
            placeholder="Telefon"
            v-model="guideData.contact.phone"
          />
        </div>
        <div class="col">
          <span>Webseite</span>
          <input
            type="text"
            placeholder="Webseite"
            v-model="guideData.contact.website"
          />
        </div>
        <div class="col">
          <span>Handynummer</span>
          <input
            type="text"
            placeholder="Handynummer"
            v-model="guideData.contact.mobile"
          />
        </div>
      </div>
    </div>
    <div class="content-row">
      <h3>Guide Bild</h3>
      <hr class="divider" />
      <div class="image" v-if="imagePreview">
        <img :src="imagePreview" />
      </div>
      <a v-if="imagePreview" @click="removeImage" class="removeImage"
        >Bild entfernen</a
      >
      <div class="row">
        <div class="col">
          <input type="file" @change="uploadImage" />
        </div>
      </div>
    </div>
    <div class="content-row">
      <button
        class="button-primary"
        @click="updateGuide()"
      >
        {{ buttonText }}
      </button>
      <div class="errorMessages">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </div>
    </div>

    <h2 style="margin-top: 50px">Passwort ändern</h2>
    <hr class="divider" />
    <div class="content-row">
      <div class="row">
        <div class="col">
          <span>Neues Passwort</span>
          <input type="password" placeholder="Neues Passwort" v-model="passwordData.newPassword" />
        </div>
        <div class="col">
          <span>Neues Passwort wiederholen</span>
          <input type="password" placeholder="Neues Passwort wiederholen" v-model="passwordData.newPasswordRepeat" />
        </div>
      </div>
      <button
        class="button-primary"
        style="margin-top: 20px"
        @click="changePassword()"
      >
        Passwort ändern
      </button>
    </div>
  </div>
</template>

<style>
.removeImage {
  color: red;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
  border-bottom: 1px solid red;
  display: inline-block;
}

.profile-container {
  padding: 20px;
}
</style>
