<template>
  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Rechercher un examen"
          v-model="titre"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="rechercheTitre"
          >
            Trouver
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <h4>Liste d'examens</h4>
      <ul class="list-group">
        <li
          class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(examen, index) in examens"
          :key="index"
          @click="setActiveExamen(examen, index)"
        >
          {{ examen.titre }}
        </li>
      </ul>

      <button class="m-3 btn btn-sm btn-danger" @click="supprimeTousExamens">
        Supprimer tous les examens
      </button>
    </div>
    <div class="col-md-6">
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
        
        <a
          class="badge badge-warning"
          :href="'/examens/' + examenSelectionne.id"
        >
          Modifier
        </a>
      </div>
      <div>
        <br />
        <p>{{message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ExamenDataService from "../services/examenDataService.js";

export default {
  name: "liste-examens",
  data() {
    return {
      examens: [],
      examenSelectionne: null,
      currentIndex: -1,
      titre: "",
      message: "Veuillez selectionner un examen"
    };
  },
  methods: {
    recupereTousExamens() {
      ExamenDataService.getAll()
        .then((response) => {
          this.examens = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
          this.message = e.response.data.message;
        });
    },

    refreshList() {
      this.recupereTousExamens();
      this.currentTutorial = null;
      this.currentIndex = -1;
    },

    setActiveExamen(examen, index) {
      this.examenSelectionne = examen;
      this.currentIndex = index;
      this.message = "";
    },

    supprimeTousExamens() {
      ExamenDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.examenSelectionne = null;
          this.refreshList();
          this.message = response.data.message;
        })
        .catch((e) => {
          console.log(e);
          this.message = e.response.data.message;
        });
    },

    rechercheTitre() {
      ExamenDataService.findByTitle(this.titre)
        .then((response) => {
          this.examens = response.data;
          console.log(response.data);
          this.message = response.data.message;
        })
        .catch((e) => {
          console.log(e);
          this.message = e.response.data.message;
        });
    },
  },
  mounted() {
    this.recupereTousExamens();
  },
};
</script>
