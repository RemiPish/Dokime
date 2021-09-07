<template>
  <div class="submit-form">
    <div class="header">
      <h1>Créer un examen</h1>
      </div>
    <div v-if="!submitted">
      <div class="form-group">
        <label for="titre">Titre</label>
        <input
          type="text"
          class="form-control"
          id="titre"
          required
          v-model="examen.titre"
          name="titre"
        />
      </div>

      <div class="form-group">
        <label for="universite">Université</label>
        <input
          class="form-control"
          id="universite"
          required
          v-model="examen.universite"
          name="universite"
        />
      </div>

      <div class="form-group">
        <label for="matiere">Matière</label>
        <input
          class="form-control"
          id="matiere"
          v-model="examen.matiere"
          name="matiere"
        />
      </div>

      <div class="form-group">
        <label for="dateDebut">Date de l'épreuve</label>
        <input
          type="date"
          class="form-control"
          id="matiere"
          v-model="examen.dateDebut"
          name="matiere"
        />
      </div>
      <div class="form-group">
        <label for="heure">Heure de l'épreuve</label>
        <input
          class="form-control"
          id="heure"
          v-model="examen.heure"
          name="heure"
        />
      </div>

      <button @click="creerExamen" class="btn btn-success">Créer l'examen</button>
      <div v-if="erreur">
        <label>{{ erreurMessage }}</label>
        </div>
    </div>

    <div v-else>
      <h3>Examen créé!</h3>
      <button class="btn btn-success" @click="nouveauExamen">Créer un nouveau examen</button>
    </div>
  </div>
</template>

<script>
import ExamenDataService from "../services/examenDataService.js";

export default {
  name: "creer-examen",
  data() {
    return {
      examen: {
        id: null,
        titre: "",
        universite: "",
        matiere: "",
        dateDebut: "",
        heure: "",
      },
      erreurMessage : "",
      submitted: false,
      erreur: false
    };
  },
  methods: {
    creerExamen() {
      var data = {
        titre: this.examen.titre,
        universite: this.examen.universite,
        matiere: this.examen.matiere,
        dateDebut: this.examen.dateDebut,
        heure: this.examen.heure,
      };

      ExamenDataService.create(data)
        .then((response) => {
          this.examen.id = response.data.id;
          console.log(response.data);
            this.submitted = true;
            this.erreur = false;
        })
        .catch((e) => {
          this.erreurMessage = e.response.data.message;
          this.erreur = true;
         
        });
    },

    nouveauExamen() {
      this.submitted = false;
      this.examen = {};
    },
  },
};
</script>
