import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import FormView from "../views/FormView.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/bot-test" },
  { path: "/bot-test", component: FormView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
