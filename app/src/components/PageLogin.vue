<style scoped>
.messageErreur {
  color: red;
}
</style>

<template>
  <div class="submit-form col-md-8">
    <div class="header">
      <h1>IDENTIFIEZ-VOUS</h1>
    </div>

    <div v-if="!valide">
      <form @submit="handleLogin" :validation-schema="schema">
        <div class="p-3 form-group row">
          <label for="identifiant" class="col-md-4 col-form-label text-md-right"
            >Identifiant</label
          >

          <div class="col-md-6">
            <input
              id="identifiant"
              type="text"
              class="form-control"
              name="identifiant"
              value=""
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
import useVuelidate from "@vuelidate/core";
//import { required } from "@vuelidate/validators";

export default {
  name: "creer-examen",
  data() {
    return {
      v$: useVuelidate(),
      erreurMessage: "",
      erreur: false,
      valide: false,
    };
  },
  //mise en place des validations du formulaire avant la soumission
  validations() {
    return {

    };
  },
  methods: {

  },
};
</script>
