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
      <div class="form-group">
        <label for="fichierCSV"
          >Fichier .csv contenant la liste de candidats:</label
        >
        <input
          class="form-control"
          id="file"
          type="file"
          ref="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="onChangeFileUpload"
        />
      </div>
      <br /><br />
      <button @click="creerExamen" class="btn btn-success">
        Créer l'examen
      </button>
      <div v-if="erreur">
        <label>{{ erreurMessage }}</label>
      </div>
    </div>

    <div v-else>
      <h3>Examen créé!</h3>
      <button class="btn btn-success" @click="nouveauExamen">
        Créer un nouveau examen
      </button>
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
      file: undefined,
      erreurMessage: "",
      submitted: false,
      erreur: false,
    };
  },
  methods: {
    creerExamen() {
      if (!this.file) {
        var data = {
          titre: this.examen.titre,
          universite: this.examen.universite,
          matiere: this.examen.matiere,
          dateDebut: this.examen.dateDebut,
          heure: this.examen.heure,
        };
        ExamenDataService.create(data)
          .then((response) => {
            console.log(response.data);
            this.submitted = true;
            this.erreur = false;
          })
          .catch((e) => {
            this.erreurMessage = e.response.data.message;
            this.erreur = true;
          });
      } else {
        let formData = new FormData();
        formData.append("titre", this.examen.titre);
        formData.append("universite", this.examen.universite);
        formData.append("matiere", this.examen.matiere);
        formData.append("dateDebut", this.examen.dateDebut);
        formData.append("heure", this.examen.heure);
        formData.append("file", this.file);
        ExamenDataService.createWithCsv(formData)
        .then((response) => {
            console.log(response.data);
            this.submitted = true;
            this.erreur = false;
          })
          .catch((e) => {
            this.erreurMessage = e.response.data.message;
            this.erreur = true;
          });
      }
    },
    onChangeFileUpload() {
      this.file = this.$refs.file.files[0];
    },

    nouveauExamen() {
      this.submitted = false;
      this.examen = {};
    },
  },
};
</script>
