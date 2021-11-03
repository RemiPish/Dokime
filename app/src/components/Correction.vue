<template>
  <div>
    <div class="row">
      <h1>Correction des copies</h1>
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
          <button @click="cameraButton()">
            {{ cameraText }}
          </button>
        </div>
        <div class="col p-2">
          <label>{{ message }}</label>
        </div>
      </div>
      <div v-if="envoiTous" class="col p-2">
        <div>
          <div>
            <h3>Envoyer tous les saisies de notes:</h3>
          </div>

          <div class="col p-2">
            <label><strong>Code du correcteur:</strong></label>
            <input
              type="text"
              class="form-control"
              id="codeCorrecteur"
              v-model="codeCorrecteur"
            />
          </div>
        </div>
        <button class="m-3 btn btn-sm btn-success" @click="envoyerTous()">
          Envoyer
        </button>
        &nbsp;&nbsp;
        <button @click="resetPage()" class="btn btn-danger">Annuler</button>
      </div>
      <div v-if="envoi" class="col p-2">
        <div>
          <div>
            <h3>Envoyer votre saisie de note: {{ copieSelectionne.code }}</h3>
          </div>

          <div class="col p-2">
            <label><strong>Code du correcteur:</strong></label>
            <input
              type="text"
              class="form-control"
              id="codeCorrecteur"
              v-model="codeCorrecteur"
            />
          </div>
        </div>
        <button
          class="m-3 btn btn-sm btn-success"
          @click="envoyerNote(this.copieSelectionne)"
        >
          Envoyer
        </button>
        &nbsp;&nbsp;
        <button @click="resetPage()" class="btn btn-danger">Annuler</button>
      </div>
      <div v-if="codeTrouve" class="col p-2">
        <div>
          <div>
            <h3>Copie: {{ copieSelectionne.code }}</h3>
          </div>
          <div class="col p-2">
            <label for="note"><strong>Note (0-20):</strong></label>
            <input
              type="number"
              class="form-control"
              id="note"
              required
              v-model="copieSelectionne.note"
              name="note"
              min="0"
              max="20"
            />
          </div>
          <div class="col p-2">
            <label><strong>Commentaire:</strong></label>
            <textarea
              class="form-control"
              placeholder="Commentaire"
              id="commentaire"
              v-model="copieSelectionne.commentaire"
            >
            </textarea>
          </div>
        </div>
        <button class="m-3 btn btn-sm btn-success" @click="saveGrade()">
          Sauvegarder la note
        </button>
        &nbsp;&nbsp;
        <button @click="resetPage()" class="btn btn-danger">Annuler</button>
      </div>
    </div>
    <div>
      <h2>Liste des copies corrigés</h2>
      <div class="col p-2">
        <button
          :disabled="noteListe === null || noteListe.length === 0"
          @click="envoyerTousMenu()"
          class="btn btn-success"
        >
          Envoyer tous les évaluations
        </button>
        &nbsp;&nbsp;
        <button @click="deleteAllGrades()" class="btn btn-danger">
          Supprimer tous les évaluations
        </button>
        &nbsp;&nbsp;
        <button @click="generateCSV()" class="btn btn-info">
          Générer un fichier .csv
        </button>
      </div>
      <div class="col p-2">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Code de copie</th>
              <th>Note</th>
              <th>Commentaire</th>
              <th>Gestion</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="copie in noteListe" :key="copie.code">
              <td>{{ copie.code }}</td>
              <td>{{ copie.note }}</td>
              <td>{{ copie.commentaire }}</td>
              <td>
                <button @click="envoyerMenu(copie)" class="btn btn-success">
                  Envoyer
                </button>
                &nbsp;&nbsp;
                <button @click="deleteGrade(copie.code)" class="btn btn-danger">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
      scanner: null,
      codeTrouve: false,
      message: "",
      copieSelectionne: {
        code: "",
        note: "",
        commentaire: "",
      },
      listeVide: true,
      noteListe: null,
      codeCorrecteur: "",
      envoi: false,
      envoiTous: false,

      cameraText: "Démarrer la caméra",
      cameraMode: "Off",
    };
  },
  methods: {
    correctionInit() {
      this.qrInit();
      if (localStorage.getItem("correction") != null) {
        this.noteListe = JSON.parse(localStorage.getItem("correction"));
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
        if (url === baseURL) {
          this.codeTrouve = true;
          this.copieSelectionne.code = id;
          if (this.noteListe !== null) {
            if (
              this.noteListe.filter(
                (e) => e.code === this.copieSelectionne.code
              ).length > 0
            ) {
              let code = this.copieSelectionne.code;
              this.copieSelectionne = this.noteListe.find(
                (e) => e.code === code
              );
            }
          }
        } else this.message = "Le code QR n'est pas valide!";
      } else this.message = "Le code QR n'est pas valide!";
      this.qrStop();
    },
    saveGrade() {
      if (this.noteListe === null) {
        this.noteListe = [];
      }
      if (
        this.noteListe.filter((e) => e.code === this.copieSelectionne.code)
          .length === 0
      ) {
        this.noteListe.push(this.copieSelectionne);
      }

      localStorage.setItem("correction", JSON.stringify(this.noteListe));
      this.noteListe = JSON.parse(localStorage.getItem("correction"));
      this.resetPage();
    },
    deleteGrade(copie) {
      var liste = this.noteListe.filter((elt) => elt.code !== copie);
      localStorage.setItem("correction", JSON.stringify(liste));
      this.noteListe = JSON.parse(localStorage.getItem("correction"));
      console.log(JSON.parse(localStorage.getItem("correction")));
      this.resetPage();
    },

    resetPage() {
      this.codeTrouve = false;
      this.envoi = false;
      this.envoiTous = false;
      this.message = "";
      this.etudiantCode = "";
      this.copieSelectionne.code = "";
      this.copieSelectionne.note = "";
      this.copieSelectionne.commentaire = "";
    },
    deleteAllGrades() {
      this.noteListe = [];
      localStorage.setItem("correction", JSON.stringify(this.noteListe));
      console.log(JSON.parse(localStorage.getItem("correction")));
      this.resetPage();
    },

    envoyerMenu(copie) {
      this.copieSelectionne = copie;
      this.envoi = true;
    },
    envoyerTousMenu() {
      this.envoiTous = true;
    },
    envoyerNote(copieSelectionne) {
      ExamenDataService.updateNote(this.codeCorrecteur, copieSelectionne)
        .then((response) => {
          this.message = response.data.message;
        })
        .catch((e) => {
          this.message = e.response.data.message;
        });
    },

    envoyerTous() {
      this.noteListe.forEach((elt) =>
        ExamenDataService.updateNote(this.codeCorrecteur, elt)
      );
      this.message =
        "Tous les notes de copies correspondant au Code Correcteur " +
        this.codeCorrecteur +
        " ont été envoyés!";
    },
    generateCSV() {
      const titre = "Notes.csv";

      var rows = [["code", "note", "commentaire"]];
      this.noteListe.forEach((elt) =>
        rows.push([
          elt.code,
          elt.note,
          elt.commentaire,
        ])
      );
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
    this.correctionInit();
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>