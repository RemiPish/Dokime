<template>
  <div class="list row">
    <div class="col-md-6">
      <h4>Liste d'examens</h4>
      <div class="p-3">
        <select @change="getAllExams(this.mode)" id="liste"  v-model="mode">
          <option value="" >Tous les examens</option>
          <option value="Emargement">Examens en cours d'émargement</option>
          <option value="Correction">Examens en cours de correction</option>
           <option value="Clos">Examens clos</option>
        </select>
      </div>
      <div>
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
      </div>
      <div class="card-footer pb-0 pt-3">
        <v-pagination
          v-model="page"
          :pages="count"
          active-color="#DCEDFF"
          @update:modelValue="onChangePage"
        />
      </div>
      <button class="m-3 btn btn-sm btn-danger" @click="deleteAllExams">
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
        <div v-if ="examenSelectionne.matiere != ''">
          <label><strong>Matière:</strong></label>
          {{ examenSelectionne.matiere }}
        </div>
        <div  v-if ="examenSelectionne.heure != ''">
          <label><strong>Heure de l'epreuve:</strong></label>
          {{ examenSelectionne.heure }}
        </div>
        <div  v-if ="examenSelectionne.dateDebut != ''">
          <label><strong>Date du debut de l'epreuve:</strong></label>
          {{ examenSelectionne.dateDebut }}
        </div>
        <div>
          <label><strong>Mode:</strong></label>
          {{ examenSelectionne.mode }}
        </div>
        <div>
          <label><strong>Nombre de candidats:</strong></label>
          {{ examenSelectionne.listeEtudiants.length }}
        </div>
        <a
          class="m-3 btn btn-sm btn-success"
          :href="'/examens/' + examenSelectionne._id"
        >
          Gérer
        </a>
        <a
          class="m-3 btn btn-sm btn-primary"
           v-if="examenSelectionne.mode == 'Emargement'"
          :href="'/evaluation/' + examenSelectionne._id"
        >
          Evaluation
        </a>

        <button class="m-3 btn btn-sm btn-danger" @click="deleteAnExam">
          Supprimer
        </button>
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
      currentIndex: -1,
      mode:"",

      page: 1,
      count: 0,
      pageSize: 10,
    };
  },
  methods: {
    getRequestParams(mode, page, pageSize) {
      let params = {};

      if (mode) {
        params["mode"] = mode;
      }

      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      return params;
    },

    getAllExams(m) {
      const params = this.getRequestParams(
        m,
        this.page,
        this.pageSize
      );
      ExamenDataService.findAll(params)
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
      this.getAllExams();
    },

    refreshList() {
      this.getAllExams();
      this.currentTutorial = null;
      this.currentIndex = -1;
    },

    setActiveExamen(examen, index) {
      this.examenSelectionne = examen;
      this.currentIndex = index;
    },

    deleteAllExams() {
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

    deleteAnExam() {
      ExamenDataService.delete(this.examenSelectionne._id)
        .then((response) => {
          console.log(response.data);
          this.examenSelectionne = null;
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getAllExams();
    console.log(localStorage)
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
