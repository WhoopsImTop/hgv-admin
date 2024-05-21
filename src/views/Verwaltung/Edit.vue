<template>
  <main>
    <div class="row">
      <h1>Benutzer erstellen</h1>
      <router-Link to="/verwaltung" class="button-primary"
        >Abbrechen</router-Link
      >
    </div>
    <hr class="divider" />
    <div class="row content-row" style="display: grid; grid-gap: 16px; grid-template-columns: 1fr 1fr 1fr;">
      <div class="col">
        <input
          type="name"
          placeholder="Benutzername"
          for="username"
          name="username"
          v-model="userData.name"
        />
      </div>
      <div class="col">
        <input
          type="email"
          placeholder="Email"
          for="email"
          name="email"
          v-model="userData.email"
        />
      </div>
      <div class="col">
        <select v-model="userData.role">
          <option value="admin">Admin</option>
          <option value="guide">Guide</option>
          <option value="moderator">Redakteur</option>
        </select>
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
      <button class="button-primary" @click="updateUser">
        Benutzer bearbeiten
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { RouterLink, useRouter } from "vue-router";

const userData = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const router = useRouter();

const id = router.currentRoute.value.params.id;

const validatePassword = () => {
  if (userData.value.password !== userData.value.password_confirmation) {
    alert("Passwörter stimmen nicht überein");
    return false;
  }
  return true;
};

const updateUser = () => {
  if (!validatePassword()) {
    return;
  }
  axios
    .patch("/users/" + id, userData.value, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      router.push("/verwaltung");
    })
    .catch((err) => {
      window.alert("Benutzer konnte nicht erstellt werden");
    });
};

const loadUser = () => {
  axios
    .get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      userData.value = res.data.user;
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  loadUser();
});
</script>

<style></style>
