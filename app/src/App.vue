<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-black">
      <router-link to="/" class="navbar-brand">Dokime</router-link>
      <div class="navbar-nav ">
        <li class="nav-item">
          <router-link to="/examens" class="nav-link">Examens</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/creerExamen" class="nav-link"
            >Créer un examen</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/correction" class="nav-link"
            >Corriger une copie</router-link
          >
        </li>
      </div>
      <div class="navbar-nav ms-auto">
        <li class="nav-item ">
          <router-link to="/connexion" class="nav-link">Se Connecter</router-link>
        </li>
        <li class="nav-item ">
          <router-link to="/inscription" class="nav-link">S'inscrire</router-link>
        </li>
      </div>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>