<template>
  <div class="submit-form">
    <div class="header">
      <h1>Créer un examen</h1>
    </div>

    <div v-if="!valide">
      <div class="p-3 form-group">
        <label for="titre">Titre</label>
        <input
          type="text"
          class="form-control"
          id="titre"
          v-model="examen.titre"
          name="titre"
        />
        <span v-if="v$.examen.titre.$error" class="messageErreur">
          Le titre ne doit pas être vide!
        </span>
      </div>

      <div class="p-3 form-group">
        <label for="universite">Université</label>
        <input
          class="form-control"
          id="universite"
          v-model="examen.universite"
          name="universite"
        />
        <span v-if="v$.examen.universite.$error" class="messageErreur">
          L'universite ne doit pas être vide!
        </span>
      </div>

      <div class="p-3 form-group">
        <label for="matiere">Matière</label>
        <input
          class="form-control"
          id="matiere"
          v-model="examen.matiere"
          name="matiere"
        />
      </div>

      <div class="p-3 form-group">
        <label for="dateDebut">Date de l'épreuve</label>
        <input
          type="date"
          class="form-control"
          id="dateDebut"
          v-model="examen.dateDebut"
          name="dateDebut"
        />
        <span v-if="v$.examen.dateDebut.$error" class="messageErreur">
          La date de debut de l'épreuve ne doit pas être vide!
        </span>
      </div>
      <div class="p-3 form-group">
        <label for="heure">Heure de l'épreuve</label>
        <input
          type="time"
          class="form-control"
          id="heure"
          v-model="examen.heure"
          name="heure"
        />
         <span v-if="v$.examen.heure.$error" class="messageErreur">
          L'heure de l'épreuve ne doit pas être vide!
        </span>
      </div>
      <div class="p-3 form-group">
        <label for="dateCloture">Date de la clôture de l'épreuve</label>
        <input
          type="date"
          class="form-control"
          id="dateCloture"
          v-model="examen.dateDebut"
          name="dateCloture"
        />
      </div>
      <div class="p-3 form-group">
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
      <button @click="createExam" class="p-3 btn btn-success">
        Créer l'examen
      </button>
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
import ExamenDataService from "../services/examenDataService.js";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "creer-examen",
  data() {
    return {
      v$: useVuelidate(),
      examen: {
        titre: "",
        universite: "",
        matiere: "",
        dateDebut: "",
        dateCloture:"",
        heure: "",
      },
      file: undefined,
      erreurMessage: "",
      erreur: false,
      valide: false,
    };
  },
  validations() {
    return {
      examen: {
        titre: { required },
        universite: { required },
        dateDebut: { required },
        heure: { required },
      },
    };
  },
  methods: {
    createExam() {
      this.v$.$validate();
      if (this.v$.$error) {
        this.erreur = true;
        return;
      }
      if (!this.file) {
        var data = {
          titre: this.examen.titre,
          universite: this.examen.universite,
          matiere: this.examen.matiere,
          dateDebut: this.examen.dateDebut,
          dateCloture: this.examen.dateCloture,
          heure: this.examen.heure,
        };
        ExamenDataService.create(data)
          .then((response) => {
            console.log(response.data);
            this.valide = true;
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
        formData.append("dateCloture", this.examen.dateCloture);
        formData.append("file", this.file);
        ExamenDataService.createWithCsv(formData)
          .then((response) => {
            console.log(response.data);
            this.valide = true;
          })
          .catch((e) => {
            this.erreurMessage = e.response.data.message;
          });
      }
    },
    onChangeFileUpload() {
      this.file = this.$refs.file.files[0];
    },

    newExam() {
      window.location.reload();
    },
  },
};
</script>
