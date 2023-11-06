<script setup>
import { useRoute } from "vue-router";
import ZertifikateForm from "../../components/creationForms/ZertifikateForm.vue";

const router = useRoute();
const id = router.params.id;
</script>

<template>
  <main>
    <ZertifikateForm :edit-mode="true" :id="id" />
  </main>
</template>

<style>
</style>