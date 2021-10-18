<template>
  <div>
    <div class="row">
      <div class="col p-2">
        <h1>Scanner le code QR:</h1>
        <video
          width="320"
          height="240"
          ref="video"
          disablepictureinpicture=""
          playsinline=""
          style="transform: scaleX(-1)"
        ></video>
        <div>
          <button @click="qrStart()" class="btn btn-success">
            Démarrer la caméra
          </button>
          &nbsp;&nbsp;
          <button @click="qrStop()" class="btn btn-danger">
            Arrêter la caméra
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
        <button class="m-3 btn btn-sm btn-success" @click="deleteAllExams">
        Terminer l'épreuve
      </button>
      </div>
    </div>
    <div v-if="urlExiste" class="p-4">
      <h3>{{ action }}</h3>
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
        <button @click="actionValider()" class="btn btn-success">
          Valider
        </button>
        &nbsp;&nbsp;
        <button @click="resetPage()" class="btn btn-danger">Annuler</button>
      </div>
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
      copie: {},
      message: "",
      etudiantSelectionne: {
        nom: "",
        prenom: "",
        numero: "",
      },
      examenSelectionne: {
        eid: "",
        titre: "",
        universite: "",
        matiere: "",
        heure: "",
        date: "",
        listeEtudiants: [],
      },

      nbEtudiants: 0,
      nbPresence: 0,
      nbRemise: 0,
      action: "",

      presenceL: [],
      remiseL: [],
    };
  },
  methods: {
    evaluationInit(id) {
      this.qrInit();
      if (!localStorage.getItem(this.$route.params.id)) {
        ExamenDataService.get(id)
          .then((response) => {
            if (response.data != null) {
              this.examenSelectionne.eid = response.data.eId;
              this.examenSelectionne.titre = response.data.titre;
              this.examenSelectionne.universite = response.data.universite;
              this.examenSelectionne.matiere = response.data.matiere;
              this.examenSelectionne.heure = response.data.heure;
              this.examenSelectionne.date = response.data.dateDebut;
              this.examenSelectionne.listeEtudiants =
                response.data.listeEtudiants;

              localStorage.setItem(
                this.$route.params.id,
                JSON.stringify(this.examenSelectionne)
              );
              this.nbEtudiants = this.examenSelectionne.listeEtudiants.length;
            }
          })
          .catch((e) => {
            this.message = e.response.data.message;
          });
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

        this.examenSelectionne.listeEtudiants = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        ).listeEtudiants;
        this.nbEtudiants = this.examenSelectionne.listeEtudiants.length;
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
    qrStart() {
      this.scanner.start();
      this.urlExiste = false;
    },
    qrStop() {
      this.scanner.stop();
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

          if (
            localStorage.getItem(this.$route.params.id + "_PresenceList") != []
          ) {
            this.presenceL = JSON.parse(
              localStorage.getItem(this.$route.params.id + "_PresenceList")
            );
          }
          if (
            localStorage.getItem(this.$route.params.id + "_RemiseList") != []
          ) {
            this.remiseL = JSON.parse(
              localStorage.getItem(this.$route.params.id + "_RemiseList")
            );
          }

          if (this.presenceL === null) {
            this.action = "Présence";
            this.presenceL = [];
            this.presenceL[0] = etudiantID;
          } else if (!this.presenceL.includes(etudiantID)) {
            this.action = "Présence";
            this.presenceL.push(etudiantID);
          } else {
            if (this.remiseL === null) {
              this.action = "Remise de copie";
              this.remiseL = [];
              this.remiseL[0] = etudiantID;
            } else if (!this.remiseL.includes(etudiantID)) {
              this.action = "Remise de copie";
              this.remiseL.push(etudiantID);
            } else {
              this.urlExiste = false;
              this.message = "La copie est déjà remise!";
            }
          }
        } else this.message = "Le code QR n'est pas valide!";
      } else this.message = "Le code QR n'est pas valide!";
      this.qrStop();
    },
    actionValider() {
      if (this.action === "Présence") {
        localStorage.setItem(
          this.$route.params.id + "_PresenceList",
          JSON.stringify(this.presenceL)
        );

        console.log(
          "Presence : " +
            localStorage.getItem(this.$route.params.id + "_PresenceList")
        );
      } else if (this.action === "Remise de copie") {
        localStorage.setItem(
          this.$route.params.id + "_RemiseList",
          JSON.stringify(this.remiseL)
        );
        console.log(
          "Remise : " +
            localStorage.getItem(this.$route.params.id + "_RemiseList")
        );
      }
      this.resetPage();
    },
    resetPage() {
      this.urlExiste = false;
      this.action = "";
      if (localStorage.getItem(this.$route.params.id + "_PresenceList") != null)
        this.nbPresence = JSON.parse(
          localStorage.getItem(this.$route.params.id + "_PresenceList")
        ).length;
      if (localStorage.getItem(this.$route.params.id + "_RemiseList") != null)
        this.nbRemise = JSON.parse(
          localStorage.getItem(this.$route.params.id + "_RemiseList")
        ).length;
    },
  },

  mounted() {
    this.resetPage();
    this.evaluationInit(this.$route.params.id);
    console.log(localStorage);
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>