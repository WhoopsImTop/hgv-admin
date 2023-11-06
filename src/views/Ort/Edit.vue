<script setup>
import { useRoute } from "vue-router";
import OrtForm from "../../components/creationForms/OrtFrom.vue"

const router = useRoute();
const id = router.params.id;
</script>

<template>
  <main>
    <OrtForm  :edit-mode="true" :id="id"/>
  </main>
</template>

<style>
</style>