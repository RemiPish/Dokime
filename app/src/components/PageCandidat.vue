<template>
  <div v-if="candidattrouve">
        <h4>Information sur la copie de l'épreuve</h4>
        <div>
          <label><strong>Titre:</strong></label> {{ examenSelectionne.titre }}
        </div>
        <div>
          <label><strong>Université:</strong></label>
          {{ examenSelectionne.universite }}
        </div>
        <div>
          <label><strong>Matière:</strong></label>
          {{ examenSelectionne.matiere }}
        </div>
        <div>
          <label><strong>Heure de l'epreuve:</strong></label>
          {{ examenSelectionne.heure }}
        </div>
        <div>
          <label><strong>Date du debut de l'epreuve:</strong></label>
          {{ examenSelectionne.dateDebut }}
        </div>
  </div>
  <div v-else>
      <h3>Examen ou candidat non trouvé!</h3>
    </div>

</template>

<script>
//import ExamenDataService from "../services/examenDataService.js";

export default {
  name: "Examen",
  data() {
    return {
      information: {
        titre:"",
        universite:"",
        epreuvre: "",
        dataDebut:"",
        heureDebut:"",
        Etat: "",
        nom: "",
        prenom: "",
        numero: "",
        note:"",
      },

      candidattrouve: false,
      examenSelectionne: null,
      etudiantSelectionne: null,
      message: "",
    };
  },
  methods: {
    getInfomation(id) {
      const examenID = id.substr(0,5)
      const candidatID = id.substr(5,7)
      console.log("examen:" + examenID + " candidat:" + candidatID)
    },
  },

  mounted() {
      this.getInfomation(this.$route.params.url)
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>