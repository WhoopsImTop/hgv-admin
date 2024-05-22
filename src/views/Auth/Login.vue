<template>
  <main class="full">
    <div class="login-container">
      <div class="login-content">
        <img src="@/assets/logo.svg" width="200" />
        <p>Bitte melden Sie sich an.</p>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Passwort" v-model="password" />
        <button class="button-primary" @click="login">
          <span v-if="dataloading" class="spin-loading"></span>
          <span v-else>Anmelden</span>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");
const dataloading = ref(false);

const login = () => {
  dataloading.value = true;
  axios
    .post("/auth/login", {
      email: email.value,
      password: password.value,
    })
    .then((res) => {
      dataloading.value = false;
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      if (res.data.role && res.data.role === "guide" || res.data.role === "moderator") {
        sessionStorage.setItem("guideId", res.data.guide);
        window.location.href = "/profile/" + res.data.guide;
      } else {
        window.location.href = "/";
      }
    })
    .catch((err) => {
      dataloading.value = false;
      console.log(err);
      window.alert(
        err.response.data.message ||
          "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
      );
    });
};

onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      login();
    }
  });
});
</script>

<style>
.full {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #efefef;
}

.login-container {
  width: 400px;
  height: auto;
  border: 1px solid var(--secondary-color);
  background-color: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.login-content {
  padding: 30px;
}

.login-content img {
  display: block;
  margin: 0 auto 30px auto;
  width: 100px;
}

.login-content h1 {
  text-align: center;
  color: var(--primary-color);
}

.login-content p {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.login-content input {
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.login-content button {
  width: 100%;
  padding: 10px 15px;
  border-radius: 5px;
  background-color: var(--primary-color);
  color: var(--secondary-color);
  border: none;
  cursor: pointer;
}

.spin-loading {
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  border-top: 2px solid var(--light-color);
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  display: inline-block;
  margin-right: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
