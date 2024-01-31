import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
// import "popper.js";
import "bootstrap/dist/js/bootstrap";
import "./assets/scss/style.scss";
import App from "./App.vue";
import AppHeader from "./components/AppHeader.vue";
import HouseCard from "./components/generals/HouseCard.vue";
import AppLoader from "./components/AppLoader.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import AppAlert from "./components/AppAlert.vue";
import { router } from "./router";

const app = createApp(App);
app.component("AppHeader", AppHeader);
app.component("HouseCard", HouseCard);
app.component("AppLoader", AppLoader);
app.component("NotFoundPage", NotFoundPage);
app.component("AppAlert", AppAlert);
// app.component("AppAlert", AppAlert);
//utilizzo il router
app.use(router);
app.mount("#app");
