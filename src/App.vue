<script setup>
import { watch, ref, onBeforeMount, computed } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import Login from "./views/Auth/Login.vue";

const authState = ref(false);
const isGuide = ref(false);
const role = sessionStorage.getItem("role");
const guideId = sessionStorage.getItem("guideId") || null;

const router = useRouter();

const checkAuthState = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    authState.value = false;
  } else {
    authState.value = true;
  }
};

const showProfile = computed(() => {
  return parseInt(guideId) > 0;
});

const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  window.onbeforeunload = null;
  router.push("/");
  authState.value = false;
};

setInterval(() => {
  checkAuthState();
}, 60 * 1000);

onBeforeMount(() => {
  checkAuthState();
});
</script>

<template>
  <Login v-if="!authState" />
  <header v-if="authState">
    <div class="header-content">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="60" />

      <button v-if="authState" class="button-primary" @click="logout">
        Abmelden
      </button>
    </div>
  </header>

  <div class="content-container" v-if="authState">
    <div class="sidebar" v-if="role != 'guide'">
      <div class="wrapper" v-if="role === 'admin'">
        <RouterLink to="/touren" class="navigation-link">
          <img src="@/assets/icons/tour.svg" width="25" height="25" />
          Touren
        </RouterLink>
        <RouterLink to="/guides" class="navigation-link">
          <img src="@/assets/icons/guide.svg" width="25" height="25" />
          Guides
        </RouterLink>
        <RouterLink to="/sprachen" class="navigation-link">
          <img src="@/assets/icons/language.svg" width="25" height="25" />
          Sprachen
        </RouterLink>
        <RouterLink to="/mobilitaet" class="navigation-link">
          <img src="@/assets/icons/mobility.svg" width="25" height="25" />
          Mobilität
        </RouterLink>
        <RouterLink to="/orte" class="navigation-link">
          <img src="@/assets/icons/place.svg" width="25" height="25" />
          Orte
        </RouterLink>
        <RouterLink to="/kategorien" class="navigation-link">
          <img src="@/assets/icons/category.svg" width="25" height="25" />
          Kategorie
        </RouterLink>
        <RouterLink to="/zertifikate" class="navigation-link">
          <img src="@/assets/icons/verify.svg" width="25" height="25" />
          Zertifikate
        </RouterLink>
        <RouterLink to="/skills" class="navigation-link">
          <img src="@/assets/icons/skill.svg" width="25" height="25" />
          Themen
        </RouterLink>
        <RouterLink to="/pages" class="navigation-link">
          <img src="@/assets/icons/page.svg" width="25" height="25" />
          Seiten
        </RouterLink>
        <RouterLink to="/blog" class="navigation-link">
          <img src="@/assets/icons/page.svg" width="25" height="25" />
          Aktuelles
        </RouterLink>
        <RouterLink to="/startseite" class="navigation-link">
          <img src="@/assets/icons/page.svg" width="25" height="25" />
          Startseite
        </RouterLink>
        <RouterLink to="/verwaltung" class="navigation-link align-bottom">
          <img src="@/assets/icons/usermanagement.svg" width="25" height="25" />
          Benutzerverwaltung
        </RouterLink>
      </div>
      <div class="wrapper" v-if="role === 'moderator'">
        <RouterLink to="/touren" class="navigation-link">
          <img src="@/assets/icons/tour.svg" width="25" height="25" />
          Touren
        </RouterLink>
        <div v-if="showProfile">
          <RouterLink :to="'/profile/' + guideId" class="navigation-link">
            <img
              src="@/assets/icons/usermanagement.svg"
              width="25"
              height="25"
            />
            Dein Profil
          </RouterLink>
        </div>
      </div>
    </div>
    <RouterView :class="isGuide ? 'guideContent' : 'view'" v-if="authState" />
  </div>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 0;
  background-color: var(--secondary-color);
  z-index: 999;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0px 50px;
}

.sidebar {
  position: fixed;
  top: 80px;
  left: 0;
  bottom: 0;
  min-width: 300px;
  background-color: var(--secondary-color);
  z-index: 999;
}

.sidebar .wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.sidebar .wrapper .navigation-link {
  padding: 10px 15px;
  margin: 2.5px 0;
  width: 100%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--primary-color);
  letter-spacing: 1px;
  transition: 0.3s ease-in-out;
}

.align-bottom {
  margin-top: auto;
  position: absolute;
  width: unset !important;
  bottom: 30px;
  left: 20px;
  right: 20px;
}

.router-link-active {
  background-color: var(--primary-color-light);
}

.sidebar .wrapper .navigation-link:hover {
  background-color: var(--primary-color-light);
  cursor: pointer;
}

.sidebar .wrapper .navigation-link img {
  margin-right: 15px;
}

.view {
  margin-left: 300px;
  margin-top: 80px;
  padding: 20px;
}

.guideContent {
  margin: 80px auto 0;
  max-width: 1440px;
  padding: 20px;
}
</style>
