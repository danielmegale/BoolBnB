import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import SearchPage from "../pages/SearchPage.vue";
import HouseDetailPage from "../pages/HouseDetailPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
    {
      path: "/search",
      name: "searchpage",
      component: SearchPage,
      beforeRouteUpdate(to, from, next) {
        // Questo hook verrà chiamato quando l'URL cambia
        next();
      },
    },
    {
      path: "/house/:id",
      name: "house-detail",
      component: HouseDetailPage,
    },
    { path: "/not-found", name: "not-found", component: NotFoundPage },
    { path: "/:pathMatch(.*)*", redirect: "/not-found" },
  ],
});
export { router };
