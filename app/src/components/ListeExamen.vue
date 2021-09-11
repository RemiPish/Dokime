<template>
  <div class="list row">
    <!--div class="col-md-8">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Rechercher un examen"
          v-model="chercheTitre"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="rechercheTitre()"
          >
            Trouver
          </button>
        </div>
      </div>
    </div-->

    <div class="col-md-6">
      <h4>Liste d'examens</h4>
      <ul class="list-group" id="examens-liste">
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
      <div class="card-footer pb-0 pt-3">
        <v-pagination
          v-model="page"
          :pages="count"
          active-color="#DCEDFF"
          @update:modelValue="onChangePage"
        />
      </div>
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
    </div>
  </div>
</template>

<script>
import ExamenDataService from "../services/examenDataService.js";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
export default {
  name: "liste-examens",
  components: {
    VPagination,
  },
  data() {
    return {
      examens: [],
      examenSelectionne: null,
      chercheTitre: "",
      currentIndex: -1,

      page: 1,
      count: 0,
      pageSize: 10,
    };
  },
  methods: {
    getRequestParams(chercheTitre, page, pageSize) {
      let params = {};

      if (chercheTitre) {
        params["titre"] = chercheTitre;
      }

      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      return params;
    },

    recupereTousExamens() {
      const params = this.getRequestParams(
        this.chercheTitre,
        this.page,
        this.pageSize
      );
      ExamenDataService.getAll(params)
        .then((response) => {
          const { examens, totalItems } = response.data;
          this.examens = examens;
          this.count = totalItems / this.pageSize + 1;

          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    onChangePage(value) {
      this.page = value;
      this.recupereTousExamens();
    },

    refreshList() {
      this.recupereTousExamens();
      this.currentTutorial = null;
      this.currentIndex = -1;
    },

    setActiveExamen(examen, index) {
      this.examenSelectionne = examen;
      this.currentIndex = index;
    },

    supprimeTousExamens() {
      ExamenDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.examenSelectionne = null;
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    /*rechercheTitre() {
      ExamenDataService.findByTitle(this.titre)
        .then((response) => {
          this.examens = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },*/
  },
  mounted() {
    this.recupereTousExamens();
  },
};
</script>
<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>
