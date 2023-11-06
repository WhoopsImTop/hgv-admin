<script setup>
import { useRoute } from "vue-router";
import GuideForm from "../../components/creationForms/GuideForm.vue";

const router = useRoute();
const id = router.params.id;
</script>

<template>
  <main>
    <GuideForm :edit-mode="true" :id="id"/>
  </main>
</template>

<style>
</style>