<template>
  <div class="languageContainer">
    <div class="languageIcon">
      <img :src="languageIcons[lang]" :alt="lang" />
    </div>
    <div class="languageContainerColumns">
      <h4 class="languageTitle">{{ title }}</h4>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import de from "@/assets/de.svg";
import en from "@/assets/en.svg";
const props = defineProps({
  lang: {
    type: String,
    default: "de",
  },
  title: {
    type: String,
    required: true,
    default: "Keinen Titel angegeben",
  },
});

const languageIcons = {
  de,
  en,
};
const lang = props.lang;
</script>

<style>
.languageContainer {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  margin-bottom: 30px;
}

.languageIcon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  overflow: hidden;
}

.languageIcon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.languageContainerColumns {
  display: flex;
  flex-direction: column;
  width: 80%;
  min-width: 250px;
}

.languageTitle {
  margin-bottom: 10px;
}
</style>