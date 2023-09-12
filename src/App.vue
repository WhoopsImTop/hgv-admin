<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="header-content">
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/logo.svg"
        width="40"
        height="40"
      />
    </div>
  </header>

  <div class="content-container">
    <div class="sidebar">
      <div class="wrapper">
        <RouterLink to="/" class="navigation-link">
          <img src="assets/tour.svg" width="25" height="25" />
          Touren
        </RouterLink>
        <RouterLink to="/guides" class="navigation-link">
          <img src="assets/guide.svg" width="25" height="25" />
          Guides
        </RouterLink>
        <RouterLink to="/sprachen" class="navigation-link">
          <img src="assets/language.svg" width="25" height="25" />
          Sprachen
        </RouterLink>
        <RouterLink to="/mobilitaet" class="navigation-link">
          <img src="assets/mobility.svg" width="25" height="25" />
          Mobilität
        </RouterLink>
        <RouterLink to="/orte" class="navigation-link">
          <img src="assets/place.svg" width="25" height="25" />
          Orte
        </RouterLink>
        <RouterLink to="/kategorien" class="navigation-link">
          <img src="assets/category.svg" width="25" height="25" />
          Kategorie
        </RouterLink>
      </div>
    </div>
    <RouterView class="view"/>
  </div>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 0;
  background-color: #f1f3f5;
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
  background-color: #f1f3f5;
}

.sidebar .wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar .wrapper .navigation-link {
  padding: 10px 15px;
  margin: 2.5px 0;
  width: 100%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #000;
  letter-spacing: 1px;
  transition: .3s ease-in-out;
}

.sidebar .wrapper .navigation-link:hover {
  background-color: var(--vt-c-indigo);
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
</style>
