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

const emit = defineEmits(["closePopup", "newSkill"]);

const skillData = ref({
  "name:de": "",
  "name:en": "",
  "description:de": "",
  "description:en": "",
});

const errors = ref([]);

const buttonText = ref(
  props.editMode ? "Skill aktualisieren" : "Skill erstellen"
);
const imagePreview = ref(null);

const router = useRouter();

const validateSkillData = () => {
  errors.value = [];
  if (skillData.value["name:de"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (DE) ein");
  }
  if (skillData.value["name:en"] === "") {
    errors.value.push("Bitte geben Sie einen Namen (EN) ein");
  }
  return errors.value.length === 0;
};

const createSkill = () => {
  if (!validateSkillData()) {
    return;
  }

  buttonText.value = props.editMode
    ? "Skill aktualisieren..."
    : "Skill erstellen...";

  axios
    .post("/skills", skillData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode
        ? "Skill aktualisieren"
        : "Skill erstellen";
      if (props.insidePopup) {
        emit("newSkill", res.data.skill);
      } else {
        router.push("/skills");
      }
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Skill aktualisieren"
        : "Skill erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Erstellen der Skill");
      }
    });
};

const updateSkill = () => {
  if (!validateSkillData()) {
    return;
  }
  buttonText.value = props.editMode
    ? "Skill aktualisieren..."
    : "Skill erstellen...";

  if (skillData.value.image !== null) {
    skillData.value.image = skillData.value.image.id;
  }

  if (skillData.value.guides !== null) {
    skillData.value.guides = skillData.value.guides.map((guide) => {
      return guide.id;
    });
  }

  axios
    .patch(`/skills/${props.id}`, skillData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      buttonText.value = props.editMode
        ? "Skill aktualisieren"
        : "Skill erstellen";
      //push to guide overview
      router.push("/skills");
    })
    .catch((err) => {
      console.log(err);
      buttonText.value = props.editMode
        ? "Skill aktualisieren"
        : "Skill erstellen";
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        window.alert("Fehler beim Aktualisieren der Skill");
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
          skillData.value.image = res.data.media.id;
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
    loadskillData();
  }
});

const loadskillData = () => {
  axios
    .get(`/skills/${props.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      skillData.value = res.data.skill;
      //map data to skillData
      skillData.value["name:de"] = res.data.skill.translations[0].name;
      skillData.value["name:en"] = res.data.skill.translations[1].name;
      skillData.value.image = res.data.skill.image;
      //set image preview
      if (res.data.skill.image !== null) {
        imagePreview.value = res.data.skill.image.url;
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
    <h1>{{ props.editMode ? "Skill Aktualisieren" : "Skill Erstellen" }}</h1>
    <router-Link v-if="!props.insidePopup" to="/skills" class="button-primary"
      >Abbrechen</router-Link
    >
    <button v-else class="button-primary" @click="emit('closePopup')">
      Abbrechen
    </button>
  </div>
  <hr class="divider" />
  <div class="row content-row">
    <LanguageContainer lang="de" title="Skill (DE)">
      <template #content>
        <input type="text" v-model="skillData['name:de']" placeholder="Name" />
      </template>
    </LanguageContainer>
    <LanguageContainer lang="en" title="Skill (EN)">
      <template #content>
        <input type="text" v-model="skillData['name:en']" placeholder="Name" />
      </template>
    </LanguageContainer>
  </div>
  <div class="content-row">
    <button
      class="button-primary"
      @click="props.editMode ? updateSkill() : createSkill()"
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