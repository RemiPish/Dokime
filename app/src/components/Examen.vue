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
        <div class="p-1">
          <button @click="changeBoolean('examen')" class="btn btn-success">
            Modifier l'examen
          </button>
        </div>
        <div class="p-1">
          <button @click="changeBoolean('etudiant')" class="btn btn-success">
            Ajouter un étudiant
          </button>
        </div>
        <div class="p-1">
          <button @click="updateExam" class="btn btn-primary">
            Afficher la feuille d'émargement
          </button>
        </div>
        <div class="p-1">
          <button @click="updateExam" class="btn btn-danger">
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
          <label><strong>Etat:</strong></label>
          <select
            class="form-control"
            id="etat"
            v-model="examenSelectionne.etat"
            name="etat"
          >
            <option value="En cours">En cours</option>
            <option value="Clos">Clos</option>
          </select>
        </div>
        <div class="p-3">
          <button @click="updateExam" class="btn btn-success">Modifier</button>
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
              <button @click="updateExam" class="btn btn-success">
                Modifier
              </button>
              &nbsp;&nbsp;
              <button
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
      @click="updateExam"
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
      etudiant: {
        nom: "",
        prenom: "",
        numero: "",
      },

      examenSelectionne: null,
      message: "",
      modifExam: false,
      ajoutEtudiant: false,
    };
  },
  methods: {
    getExamen(id) {
      ExamenDataService.get(id)
        .then((response) => {
          this.examenSelectionne = response.data;
        })
        .catch((e) => {
          console.log(e);
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
        })
        .catch((e) => {
          console.log(e);
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
          this.refreshPage();
        })
        .catch((e) => {
          this.message = e;
        });
    },
    changeBoolean(x) {
      switch (x) {
        case "examen":
          this.modifExam = true;
          this.ajoutEtudiant = false;
          break;
        case "etudiant":
          this.modifExam = false;
          this.ajoutEtudiant = true;
          break;
        default:
          this.modifExam = false;
          this.ajoutEtudiant = false;
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