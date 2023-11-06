<template>
  <main>
    <div class="row">
      <h1>Benutzer erstellen</h1>
      <router-Link to="/verwaltung" class="button-primary"
        >Abbrechen</router-Link
      >
    </div>
    <hr class="divider" />
    <div class="row content-row">
      <div class="col" style="width: 48%; min-width: 200px">
        <input
          type="name"
          placeholder="Benutzername"
          for="username"
          name="username"
          v-model="userData.name"
        />
      </div>
      <div class="col" style="width: 48%; min-width: 200px">
        <input
          type="email"
          placeholder="Email"
          for="email"
          name="email"
          v-model="userData.email"
        />
      </div>
    </div>
    <div class="row content-row">
      <div class="col" style="width: 48%; min-width: 200px">
        <input
          type="password"
          placeholder="Passwort"
          for="password"
          name="password"
          v-model="userData.password"
        />
      </div>
      <div class="col" style="width: 48%; min-width: 200px">
        <input
          type="password"
          placeholder="Passwort (Wiederholen)"
          for="password"
          name="password"
          v-model="userData.password_confirmation"
        />
      </div>
    </div>
    <div class="row content-row">
      <button class="button-primary" @click="createUser">
        Benutzer erstellen
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { RouterLink, useRouter } from "vue-router";

const userData = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const router = useRouter();

const validatePassword = () => {
  if (userData.value.password !== userData.value.password_confirmation) {
    alert("Passwörter stimmen nicht überein");
    return false;
  }
  return true;
};

const createUser = () => {
  if (!validatePassword()) {
    return;
  }
  axios
    .post("/auth/register", userData.value)
    .then(() => {
      router.push("/verwaltung");
    })
    .catch((err) => {
        window.alert("Benutzer konnte nicht erstellt werden");
    });
};
</script>

<style>
</style>