<template>
  <div v-if="candidattrouve">
    <h2>Information sur la copie de l'examen</h2> 
    <h4>{{ information.titre}}  à {{ information.universite }} </h4>
    <div v-if="information.matiere !== 'undefined'">
      <label><strong>Matière: </strong></label>
      {{ information.matiere }}
    </div>
    <div v-if="information.dateDebut !== 'undefined'">
      <label><strong>Date de l'épreuve: </strong></label>
      {{ information.dateDebut }}
    </div>
    <div>
      <label><strong>Candidat:</strong></label> {{ information.prenom }}  {{ information.nom }}  
    </div>
    <div>
      <label><strong>Numéro d'étudiant:</strong></label> {{ information.numero }}  
    </div>

    <div class="p-3" v-if="information.note !== undefined">
      <label><strong>Note: </strong></label>
      {{ information.note }}
    </div>
    <div v-else>
      <h4>La note du copie n'a pas encore été attributée pour le moment! Celle-ci s'affichera sur cette page à la fin de la correction de l'examen.</h4>
    </div>
</div>
  <div class="col p-5" v-else>
    <h3>Examen ou candidat non trouvé!</h3>
  </div>
</template>

<script>
import ExamenDataService from "../services/examenDataService.js";

export default {
  name: "Examen",
  data() {
    return {
      information: null,
      candidattrouve: false,
      message: "",
    };
  },
  methods: {
    getInfomation(id) {
      ExamenDataService.findCandidatByURL(id).then((response) => {
        if (response.data) {
          this.information = response.data;
          this.candidattrouve = true;
        }
        
      });
    },
  },

  mounted() {
    this.getInfomation(this.$route.params.url);
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>