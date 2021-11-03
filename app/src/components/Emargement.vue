<template>
  <div>
    <div class="row">
      <h1>Emargement</h1>
      <div class="col p-2">
        <h3>Scanner le code QR:</h3>
        <video
          width="320"
          height="240"
          ref="video"
          disablepictureinpicture=""
          playsinline=""
          style="transform: scaleX(-1)"
        ></video>
        <div>
          <button
            :disabled="this.examenSelectionne.mode !== 'Emargement'"
            @click="cameraButton()"
          >
            {{ cameraText }}
          </button>
        </div>
        <div class="p-2">
          <label>{{ message }}</label>
        </div>
      </div>
      <div class="col p-2">
        <div>
          <div>
            <h4>{{ examenSelectionne.titre }}</h4>
          </div>
          <div>
            <label><strong>Université:</strong></label>
            {{ examenSelectionne.universite }}
          </div>
          <div v-if="examenSelectionne.matiere != ''">
            <label><strong>Matière:</strong></label>
            {{ examenSelectionne.matiere }}
          </div>
          <div v-if="examenSelectionne.dateDebut != ''">
            <label><strong>Date du debut de l'epreuve:</strong></label>
            {{ examenSelectionne.date }}
          </div>
          <div v-if="examenSelectionne.heure != ''">
            <label><strong>Heure de l'epreuve:</strong></label>
            {{ examenSelectionne.heure }}
          </div>
          <div>
            <label><strong>Nombre de candidats:</strong></label>
            {{ nbEtudiants }}
          </div>
          <div>
            <label><strong>Nombre de présence:</strong></label>
            {{ nbPresence }}
          </div>
          <div>
            <label><strong>Nombre de remise:</strong></label>
            {{ nbRemise }}
          </div>
        </div>
        <button
          class="m-3 btn btn-sm btn-success"
          :disabled="
            examenSelectionne.mode !== 'Emargement' ||
            (nbPresence === 0 && nbRemise === 0)
          "
          @click="envoyerEmargement()"
        >
          Envoyer la liste
        </button>
        <button @click="generateCSV()" class="m-3 btn btn-sm btn-info">
          Générer un fichier .csv
        </button>
      </div>
    </div>
    <div v-if="urlExiste" class="p-4">
      <div>
        <label><strong>Nom: </strong></label>
        {{ etudiantSelectionne.nom }}
      </div>
      <div>
        <label><strong>Prénom: </strong></label>
        {{ etudiantSelectionne.prenom }}
      </div>
      <div>
        <label><strong>Numéro d'étudiant:</strong></label>
        {{ etudiantSelectionne.numero }}
      </div>
      <div>
        <button
          :disabled="etudiantSelectionne.presence === true"
          @click="actionValider('presence')"
          class="btn btn-success"
        >
          Présence
        </button>
        &nbsp;&nbsp;
        <button
          :disabled="etudiantSelectionne.remis === true"
          @click="actionValider('remise')"
          class="btn btn-success"
        >
          Remise
        </button>
        &nbsp;&nbsp;
        <button @click="resetPage()" class="btn btn-danger">Annuler</button>
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import QrScanner from "qr-scanner";
import ExamenDataService from "../services/examenDataService.js";

export default {
  name: "scanner",
  data() {
    return {
      urlExiste: false,
      scanner: null,
      message: "",
      etudiantSelectionne: {
        nom: "",
        prenom: "",
        numero: "",
        presence: false,
        remis: false,
      },
      examenSelectionne: {
        eid: "",
        titre: "",
        universite: "",
        matiere: "",
        heure: "",
        date: "",
        mode: "Emargement",
        listeEtudiants: [],
      },

      emargement: {
        examen_eid: "",
        presence: [],
        remis: [],
      },

      nbEtudiants: 0,
      nbPresence: 0,
      nbRemise: 0,

      etudiantCode: "",
      cameraText: "Démarrer la caméra",
      cameraMode: "Off",
    };
  },
  methods: {
    evaluationInit(id) {
      this.qrInit();
      if (!localStorage.getItem(this.$route.params.id)) {
        this.mettreAJour(id);
      } else {
        this.examenSelectionne.eid = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).eid;
        this.examenSelectionne.titre = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).titre;
        this.examenSelectionne.universite = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).universite;
        this.examenSelectionne.matiere = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).matiere;
        this.examenSelectionne.heure = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).heure;
        this.examenSelectionne.date = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).date;
        this.examenSelectionne.mode = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).mode;

        this.examenSelectionne.listeEtudiants = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).listeEtudiants;
      }
      this.nbEtudiants = this.examenSelectionne.listeEtudiants.length;
      if (!localStorage.getItem("Emargement_" + this.$route.params.id)) {
        this.emargement.examen_eid = this.examenSelectionne.eid;
        localStorage.setItem(
          "Emargement_" + this.$route.params.id,
          JSON.stringify(this.emargement)
        );
      } else {
        this.emargement.examen_eid = JSON.parse(
          localStorage.getItem("Emargement_" + this.$route.params.id)
        ).examen_eid;
        this.emargement.presence = JSON.parse(
          localStorage.getItem("Emargement_" + this.$route.params.id)
        ).presence;
        this.emargement.remis = JSON.parse(
          localStorage.getItem("Emargement_" + this.$route.params.id)
        ).remis;
      }
    },

    qrInit() {
      const video = this.$refs.video;
      QrScanner.WORKER_PATH = "../qrscanner/qr-scanner-worker.min.js";
      this.scanner = new QrScanner(
        video,
        (result) => this.qrResult(result),
        (error) => {
          console.log(error);
        }
      );
    },

    cameraButton() {
      if (this.cameraMode === "Off") {
        this.qrStart();
      } else if (this.cameraMode === "On") {
        this.qrStop();
      }
    },

    qrStart() {
      this.scanner.start();
      this.urlExiste = false;
      this.message = "";
      this.cameraText = "Arrêter la caméra";
      this.cameraMode = "On";
    },
    qrStop() {
      this.scanner.stop();
      this.cameraMode = "Off";
      this.cameraText = "Démarrer la caméra";
    },

    qrResult(result) {
      if (result.length == 31) {
        const baseURL = window.location.origin + "/";
        var url = result.slice(0, result.length - 8);
        var id = result.substr(result.length - 8);
        const examenID = id.slice(0, 5);
        const etudiantID = id.substr(id.length - 3);
        if (
          url === baseURL &&
          examenID === this.examenSelectionne.eid &&
          this.examenSelectionne.listeEtudiants.filter(
            (e) => e.code === etudiantID
          ).length > 0
        ) {
          this.urlExiste = true;
          this.etudiantCode = etudiantID;
          this.etudiantSelectionne.nom =
            this.examenSelectionne.listeEtudiants.filter(
              (e) => e.code === etudiantID
            )[0].nom;
          this.etudiantSelectionne.prenom =
            this.examenSelectionne.listeEtudiants.filter(
              (e) => e.code === etudiantID
            )[0].prenom;
          this.etudiantSelectionne.numero =
            this.examenSelectionne.listeEtudiants.filter(
              (e) => e.code === etudiantID
            )[0].numero;
          this.etudiantSelectionne.presence =
            this.examenSelectionne.listeEtudiants.filter(
              (e) => e.code === etudiantID
            )[0].presence;
          this.etudiantSelectionne.remis =
            this.examenSelectionne.listeEtudiants.filter(
              (e) => e.code === etudiantID
            )[0].remis;

          this.examenSelectionne.listeEtudiants.map((e) => {
            if (e.code === etudiantID) {
              if (e.presence === true && e.remis === true) {
                this.urlExiste = false;
                this.message = "La copie est déjà remise!";
              }
            }
          });
        } else this.message = "Le code QR n'est pas valide!";
      } else this.message = "Le code QR n'est pas valide!";
      this.qrStop();
    },
    actionValider(action) {
      if (action === "presence") {
        this.examenSelectionne.listeEtudiants.map((e) => {
          if (e.code === this.etudiantCode) {
            e.presence = true;
            if (this.emargement.presence === []) {
              this.emargement.presence = [this.etudiantCode];
            } else this.emargement.presence.push(this.etudiantCode);
          }
        });
      } else if (action === "remise") {
        this.examenSelectionne.listeEtudiants.map((e) => {
          if (e.code === this.etudiantCode) {
            e.remis = true;
            if (this.emargement.remis === []) {
              this.emargement.remis = [this.etudiantCode];
            } else this.emargement.remis.push(this.etudiantCode);
          }
        });
        console.log(this.emargement);
      }
      localStorage.setItem(
        "Emargement_" + this.$route.params.id,
        JSON.stringify(this.emargement)
      );
      localStorage.setItem(
        this.$route.params.id,
        JSON.stringify(this.examenSelectionne)
      );
      console.log(
        JSON.parse(localStorage.getItem("Emargement_" + this.$route.params.id))
      );
      this.resetPage();
    },
    resetPage() {
      this.urlExiste = false;
      this.etudiantCode = "";

      this.nbPresence = this.examenSelectionne.listeEtudiants.filter(
        (e) => e.presence === true
      ).length;
      this.nbRemise = this.examenSelectionne.listeEtudiants.filter(
        (e) => e.remis === true
      ).length;
    },

    mettreAJour(id) {
      ExamenDataService.get(id)
        .then((response) => {
          if (response.data != null) {
            this.examenSelectionne.eid = response.data.eId;
            this.examenSelectionne.titre = response.data.titre;
            this.examenSelectionne.universite = response.data.universite;
            this.examenSelectionne.matiere = response.data.matiere;
            this.examenSelectionne.heure = response.data.heure;
            this.examenSelectionne.date = response.data.dateDebut;
            this.examenSelectionne.mode = response.data.mode;
            this.examenSelectionne.listeEtudiants =
              response.data.listeEtudiants;
            localStorage.setItem(
              this.$route.params.id,
              JSON.stringify(this.examenSelectionne)
            );
          }
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },

    envoyerEmargement() {
      ExamenDataService.updateEmargement(this.$route.params.id, this.emargement)
        .then((response) => {
          this.message = response.data.message;
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },
    generateCSV() {
      const titre = this.examenSelectionne.eid + "_Emargement.csv"
     
      var rows = [["eId", "code", "presence", "remis"]]
      this.examenSelectionne.listeEtudiants.forEach((elt) => rows.push([this.examenSelectionne.eid, elt.code, elt.presence, elt.remis]))
      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", titre);
      document.body.appendChild(link); 

      link.click(); 
    },
  },

  mounted() {
    this.evaluationInit(this.$route.params.id);
    this.resetPage();
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>