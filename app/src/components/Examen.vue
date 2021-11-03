<template>
  <div v-if="examenSelectionne">
    <div class="row">
      <div class="col p-2">
        <h4>Examen</h4>
        <div>
          <label><strong>Titre:</strong></label> {{ examenSelectionne.titre }}
        </div>
        <div>
          <label><strong>Université:</strong></label>
          {{ examenSelectionne.universite }}
        </div>
        <div v-if="examenSelectionne.matiere != ''">
          <label><strong>Matière:</strong></label>
          {{ examenSelectionne.matiere }}
        </div>
        <div v-if="examenSelectionne.heure != ''">
          <label><strong>Heure de l'epreuve:</strong></label>
          {{ examenSelectionne.heure }}
        </div>
        <div v-if="examenSelectionne.dateDebut != ''">
          <label><strong>Date du debut de l'epreuve:</strong></label>
          {{ examenSelectionne.dateDebut }}
        </div>
        <div >
          <label><strong>Code Correcteur:</strong></label>
          {{ examenSelectionne.codeCorrecteur}}
        </div>
        <div>
          <label><strong>Mode:</strong></label>
          {{ examenSelectionne.mode }}
        </div>
        <div class="p-1">
          <button
            :disabled="this.examenSelectionne.mode == 'Clos'"
            @click="changeBoolean('examen')"
            class="btn btn-success"
          >
            Modifier l'examen
          </button>
        </div>
        <div class="p-1">
          <button
            @click="changeBoolean('pdfEmargement')"
            class="btn btn-primary"
          >
            Télécharger
          </button>
        </div>
        <div class="p-1">
          <button @click="deleteExam" class="btn btn-danger">
            Supprimer l'examen
          </button>
        </div>
      </div>
      <div class="col submit-form p-2" v-if="modifExam">
        <h2>Modifier l'examen</h2>
        <div class="p-1 form-group">
          <label for="titre"><strong>Titre:</strong></label>
          <input
            type="text"
            class="form-control"
            id="titre"
            required
            v-model="examenSelectionne.titre"
            name="titre"
          />
        </div>
        <div class="p-1 form-group">
          <label for="universite"><strong>Université:</strong></label>
          <input
            type="text"
            class="form-control"
            id="universite"
            required
            v-model="examenSelectionne.universite"
            name="universite"
          />
        </div>
        <div class="p-1 form-group">
          <label for="matiere"><strong>Matière:</strong></label>
          <input
            type="text"
            class="form-control"
            id="matiere"
            required
            v-model="examenSelectionne.matiere"
            name="matiere"
          />
        </div>
        <div class="p-1 form-group">
          <label for="dateDebut">Date du debut de l'epreuve:</label>
          <input
            type="date"
            class="form-control"
            id="dateDebut"
            v-model="examenSelectionne.dateDebut"
            name="dateDebut"
          />
        </div>

        <div class="p-1 form-group">
          <label><strong>Heure de l'epreuve:</strong></label>
          <input
            class="form-control"
            id="heure"
            v-model="examenSelectionne.heure"
            name="heure"
          />
        </div>
          <div class="p-1 form-group">
          <label for="nom"><strong>Présence:</strong></label>
          <select
            class="form-control"
            id="mode"
            v-model="examenSelectionne.mode"
            name="mode"
            selected="examenSelectionne.mode"
          >
            <option value="Emargement">Emargement</option>
            <option value="Correction">Correction</option>
            <option value="Clos">Clos</option>
          </select>
        </div>
        
        <div class="p-3">
          <button @click="updateExam" class="btn btn-success">Modifier</button>
        </div>
      </div>

      <div class="col submit-form p-2" v-if="pdfEmargement">
        <h2>Choisissez le document à télécharger </h2>
        <div class="p-3">
          <button @click="feuilleEmargement" class="btn btn-success">
            Feuille d'émargement
          </button>
        </div>
        <div class="p-3">
          <button @click="feuilleEmargement" class="btn btn-success">
            Résultat de l'examen
          </button>
        </div>
      </div>

      <div class="col submit-form p-2" v-if="ajoutEtudiant">
        <h2>Ajouter un étudiant</h2>
        <div class="p-1 form-group">
          <label for="nom"><strong>Nom:</strong></label>
          <input
            type="text"
            class="form-control"
            id="nom"
            required
            v-model="etudiant.nom"
            name="nom"
          />
        </div>
        <div class="p-1 form-group">
          <label for="prenom"><strong>Prénom:</strong></label>
          <input
            type="text"
            class="form-control"
            id="prenom"
            required
            v-model="etudiant.prenom"
            name="prenom"
          />
        </div>
        <div class="p-1 form-group">
          <label for="numero"><strong>Numéro d'étudiant:</strong></label>
          <input
            type="text"
            class="form-control"
            id="numero"
            required
            v-model="etudiant.numero"
            name="numero"
          />
        </div>
        <div class="p-3">
          <button @click="addAStudent" class="btn btn-success">Ajouter</button>
        </div>
      </div>

      <div class="col submit-form p-2" v-if="modifEtudiant">
        <h2>Etudiant numéro {{ this.etudiantSelectionne.numero }}</h2>
        <div class="p-1 form-group">
          <label for="nom"><strong>Présence:</strong></label>
          <select
            class="form-control"
            id="presence"
            v-model="etudiantSelectionne.presence"
            name="presence"
            selected="etudiantSelectionne.presence"
          >
            <option value="true">Vrai</option>
            <option value="false">Faux</option>
          </select>
        </div>
        <div class="p-1 form-group">
          <label for="prenom"><strong>Remise:</strong></label>
          <select
            class="form-control"
            id="remise"
            v-model="etudiantSelectionne.remis"
            name="remise"
            selected="etudiantSelectionne.remis"
          >
            <option value="true">Vrai</option>
            <option value="false">Faux</option>
          </select>
        </div>
        <div class="p-1 form-group">
          <label for="note"><strong>Note (0-20):</strong></label>
          <input
            type="number"
            class="form-control"
            id="note"
            required
            v-model="etudiantSelectionne.note"
            name="note"
            min="0"
            max="20"
          />
        </div>
        <div class="p-3">
          <button @click="updateStudent" class="btn btn-success">
            Modifier
          </button>
        </div>
      </div>

      <div class="p-2">
        <label>{{ message }}</label>
      </div>
      <div>
        <h3 class="p-2 text-center">Liste de candidats</h3>
        <div>
          <label class="p-1 text-center"
            ><strong>Nombre de candidats:</strong></label
          >
          {{ examenSelectionne.listeEtudiants.length }}
        </div>
        <div class="p-1">
          <button
            :disabled="this.examenSelectionne.mode == 'Clos'"
            @click="changeBoolean('ajoutEtudiant')"
            class="btn btn-success"
          >
            Ajouter un étudiant
          </button>
        </div>
      </div>
    </div>
    <div>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Numéro d'étudiants</th>
            <th>Présence</th>
            <th>Remise de copie</th>
            <th>Note</th>
            <th>Gestion</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="etudiant in examenSelectionne.listeEtudiants"
            :key="etudiant._id"
          >
            <td>{{ etudiant.nom }}</td>
            <td>{{ etudiant.prenom }}</td>
            <td>{{ etudiant.numero }}</td>
            <td>{{ etudiant.presence }}</td>
            <td>{{ etudiant.remis }}</td>
            <td>{{ etudiant.note }}</td>
            <td>
              <button
                :disabled="this.examenSelectionne.mode == 'Clos'"
                @click="getStudent(etudiant.numero)"
                class="btn btn-success"
              >
                Modifier
              </button>
              &nbsp;&nbsp;
              <button
                :disabled="this.examenSelectionne.mode == 'Clos'"
                @click="deleteAStudent(etudiant.numero)"
                class="btn btn-danger"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ExamenDataService from "../services/examenDataService.js";

export default {
  name: "examen-detail",
  data() {
    return {
      etudiant: {
        nom: "",
        prenom: "",
        numero: "",
      },

      etudiantSelectionne: null,
      examenSelectionne: null,
      message: "",
      modifExam: false,
      ajoutEtudiant: false,
      modifEtudiant: false,
      pdfEmargement: false,
    };
  },
  methods: {
    getExamen(id) {
      ExamenDataService.get(id)
        .then((response) => {
          this.examenSelectionne = response.data;
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },

    closeExam() {
      ExamenDataService.closeExam(this.examenSelectionne._id)
        .then((response) => {
          console.log(response.data);
          this.message = "L'examen est clos";
          this.refreshPage();
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },

    updateExam() {
      ExamenDataService.updateExam(
        this.examenSelectionne._id,
        this.examenSelectionne
      )
        .then((response) => {
          console.log(response.data);
          this.message = "L'examen a été modifié";
          this.modifExam = false;
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },

    updateStudent() {
      ExamenDataService.updateStudent(
        this.examenSelectionne._id,
        this.etudiantSelectionne
      )
        .then((response) => {
          console.log(response.data);
          this.message = "L'etudiant a été modifié";
          this.refreshPage();
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },

    getStudent(num) {
      ExamenDataService.findAStudent(this.examenSelectionne._id, num)
        .then((response) => {
          console.log(response.data);
          this.changeBoolean("modifEtudiant");
          this.etudiantSelectionne = response.data;
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },

    addAStudent() {
      var data = {
        nom: this.etudiant.nom,
        prenom: this.etudiant.prenom,
        numero: this.etudiant.numero,
      };
      ExamenDataService.addAStudent(this.examenSelectionne._id, data)
        .then((response) => {
          console.log(response.data);
          this.message = "L'étudiant a été ajouté de la liste de candidats!";
          this.refreshPage();
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },

    deleteAStudent(numero) {
      var data = {
        numero: numero,
      };
      ExamenDataService.deleteAStudent(this.examenSelectionne._id, data)
        .then((response) => {
          console.log(response.data);
          this.message = "L'étudiant a été supprimé de la liste de candidats!";
          this.changeBoolean("all");
          this.refreshPage();
        })
        .catch((e) => {
          this.message = e;
        });
    },

    feuilleEmargement() {
      const baseURL = ExamenDataService.getBaseURL();
      window.open(baseURL + "/examens/" + this.examenSelectionne._id + "/pdf");
    },
    deleteExam() {
      ExamenDataService.delete(this.examenSelectionne._id)
        .then((response) => {
          console.log(response.data);
          this.examenSelectionne = null;
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
      (location.href = "/examens"), true;
    },

    changeBoolean(x) {
      switch (x) {
        case "all":
          this.modifExam = false;
          this.ajoutEtudiant = false;
          this.modifEtudiant = false;
          this.pdfEmargement = false;

          break;
        case "examen":
          this.modifExam = true;
          this.ajoutEtudiant = false;
          this.modifEtudiant = false;
          this.pdfEmargement = false;

          break;
        case "ajoutEtudiant":
          this.modifExam = false;
          this.ajoutEtudiant = true;
          this.modifEtudiant = false;
          this.pdfEmargement = false;

          break;
        case "modifEtudiant":
          this.modifExam = false;
          this.ajoutEtudiant = false;
          this.modifEtudiant = true;
          this.pdfEmargement = false;
          break;
        case "pdfEmargement":
          this.modifExam = false;
          this.ajoutEtudiant = false;
          this.modifEtudiant = false;
          this.pdfEmargement = true;
          break;
        case "importCsv":
          this.modifExam = false;
          this.ajoutEtudiant = false;
          this.modifEtudiant = false;
          this.pdfEmargement = false;
           break;
        default:
          this.modifExam = false;
          this.ajoutEtudiant = false;
          this.modifEtudiant = false;
          this.pdfEmargement = false;
      }
    },

    refreshPage() {
      this.etudiant = {};
      this.getExamen(this.$route.params.id);
    },
  },

  mounted() {
    this.message = "";
    this.refreshPage();
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>