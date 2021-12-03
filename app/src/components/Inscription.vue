<style scoped>
.messageErreur {
  color: red;
}
</style>

<template>
  <div class="submit-form col-md-8">
    <div class="header">
      <h1>S'INSCRIRE</h1>
    </div>

    <div v-if="!valide">
      <form @submit="handleLogin" :validation-schema="schema">
        <div class="p-3 form-group row">
          <label for="identifiant" class="col-md-4 col-form-label text-md-right"
            >Identifiant</label
          >

          <div class="col-md-6">
            <input
              v-model="utilisateur.identifiant"
              id="identifiant"
              type="text"
              class="form-control"
              name="identifiant"
              required
              autofocus
            />
          </div>
        </div>

         <div class="p-3 form-group row">
          <label for="email" class="col-md-4 col-form-label text-md-right"
            >Addresse mail</label
          >

          <div class="col-md-6">
            <input
              v-model="utilisateur.email"
              id="email"
              type="email"
              class="form-control"
              name="email"
              required
              autofocus
            />
          </div>
        </div>

        <div class="p-3 form-group row">
          <label for="motDePasse" class="col-md-4 col-form-label text-md-right"
            >Mot de passe</label
          >

          <div class="col-md-6">
            <input
              v-model="utilisateur.motDePasse"
              id="motDePasse"
              type="password"
              class="form-control"
              name="motDePasse"
              required
            />
          </div>
        </div>

        <div class="p-3 form-group row">
          <div class="col-md-6 offset-md-2">
            <div class="checkbox">
              <label>
                <input type="checkbox" name="seSouvenir" /> Se souvenir de moi
              </label>
            </div>
          </div>
        </div>

        <div class="p-3 form-group row">
          <div class="col-md-6 offset-md-2">
            <button
              type="submit btn btn-success "
              class="btn btn-primary btn-lg"
            >
              Se connecter
            </button>
          </div>
        </div>
      </form>
      <div v-if="erreur">
        <label>{{ erreurMessage }}</label>
      </div>
    </div>

    <div v-else>
      <h3>Examen créé!</h3>
      <button class="btn btn-success" @click="newExam">
        Créer un nouveau examen
      </button>
    </div>
  </div>
</template>

<script>
import Utilisateur from '../../models/utilisateur.js';

export default {
  name: "inscription",
  data() {
    return {
      utilisateur: new Utilisateur('','',''),
      erreurMessage: "",
      erreur: false,
      valide: false,
    };
  },

  validations() {
    return {};
  },
  methods: {},
};
</script>
