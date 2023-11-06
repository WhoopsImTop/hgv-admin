<script setup>
import { useRoute } from "vue-router";
import MobilitaetForm from "../../components/creationForms/MobilitaetForm.vue";

const router = useRoute();
const id = router.params.id;
</script>

<template>
  <main>
    <MobilitaetForm  :edit-mode="true" :id="id"/>
  </main>
</template>

<style>
</style>