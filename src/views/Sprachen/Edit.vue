<script setup>
import { useRoute } from "vue-router";
import SprachenForm from "../../components/creationForms/SprachenForm.vue";

const router = useRoute();
const id = router.params.id;
</script>

<template>
  <main>
    <SprachenForm :edit-mode="true" :id="id"/>
  </main>
</template>

<style>
</style>