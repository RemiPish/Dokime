import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/examens"
  },
  {
    path: "/examens",
    name: "examens",
    component: () => import("./components/ListeExamen")
  },
  {
    path: "/examens/:id",
    name: "examen-detail",
    component: () => import("./components/Examen")
  },
  {
    path: "/creerExamen",
    name: "creer-examen",
    component: () => import("./components/CreerExamen")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;