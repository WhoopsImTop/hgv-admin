import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

//set axios as global
import axios from "axios";

axios.defaults.baseURL = "https://api.hamburger-gaestefuehrer.de/api";

//add access-control-allow-origin header
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
//content type json
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.defaults.withCredentials = true;

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
