<template>
  <div v-if="examenSelectionne">
        <h4>Examen</h4>
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
        <div>
          <label><strong>Etat:</strong></label>
          {{ examenSelectionne.etat }}
        </div>
        <div>
          <label><strong>Nombre de candidats:</strong></label>
          {{ examenSelectionne.listeEtudiants.length }}
        </div>
     </div>
    <div v-else>
        <br />
        <p>Examen Inconnu</p>
        <p>{{ message }}</p>
    </div>
    

    <!--button class="badge badge-primary mr-2"
      v-if="examenSelectionne.published"
      @click="updatePublished(false)"
    >
      UnPublish
    </button>
    <button v-else class="badge badge-primary mr-2"
      @click="updatePublished(true)"
    >
      Publish
    </button>

    <button class="badge badge-danger mr-2"
      @click="deleteExamen"
    >
      Delete
    </button>

    <button type="submit" class="badge badge-success"
      @click="updateExamen"
    >
      Update
        
    </button-->
  

  
</template>

<script>
import ExamenDataService from "../services/examenDataService.js";

export default {
  name: "Examen",
  data() {
    return {
      examenSelectionne: null,
      message: ''
    };
  },
  methods: {
    getExamen(id) {
        console.log(id);
      ExamenDataService.get(id)
        .then(response => {
          this.examenSelectionne = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateExamen() {
      ExamenDataService.update(this.examenSelectionne.id, this.examenSelectionne)
        .then(response => {
          console.log(response.data);
          this.message = 'The Examen was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteExamen() {
      ExamenDataService.delete(this.examenSelectionne.id)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "Examens" });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.message = '';
    this.getExamen(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>