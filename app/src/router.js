import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/connexion"
  },
  {
    path: "/connexion",
    name: "connexion",
    component: () => import("./components/ConnexionCompte")
  },
  {
    path: "/inscription",
    name: "inscription",
    component: () => import("./components/Inscription")
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
  },
  {
    path: "/:url",
    name: "page-candidat",
    component: () => import("./components/PageCandidat")
  },
  {
    path: "/emargement/:id",
    name: "emargement",
    component: () => import("./components/Emargement")
  },
  {
    path: "/correction",
    name: "correcion",
    component: () => import("./components/Correction")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;