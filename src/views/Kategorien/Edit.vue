<script setup>
import { useRoute } from "vue-router";
import KategorieForm from "../../components/creationForms/KategorieForm.vue";

const router = useRoute();
const id = router.params.id;
</script>

<template>
  <main>
    <KategorieForm :edit-mode="true" :id="id" />
  </main>
</template>

<style>
</style>