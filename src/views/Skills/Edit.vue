<script setup>
import { useRoute } from "vue-router";
import SkillForm from "../../components/creationForms/SkillForm.vue";

const router = useRoute();
const id = router.params.id;
</script>

<template>
  <main>
    <SkillForm :edit-mode="true" :id="id" />
  </main>
</template>

<style>
</style>