<template>
  <div class="AjouterClass">
    <Header />
    <div class="container mrgnbtm">
          <div class="row">
            <div class="col-md-8">
                <AjouterEtudiant @ajouterEtudiant="ajouterEtudiant($event)" />
            </div>
            <div class="col-md-4">
                <DisplayBoard :nombreEtudiants="nombreEtudiants" @getAllEtudiants="getAllEtudiants()" />
            </div>
          </div>
    </div>
    <div class="row mrgnbtm">
        <Etudiants v-if="etudiants.length > 0" :etudiants="etudiants" />
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import AjouterEtudiant from './AjouterEtudiant.vue'
import DisplayBoard from './DisplayBoard.vue'
import Etudiants from './Etudiants.vue'
import { getAllEtudiants, ajouterEtudiant } from './EtudiantService'
export default {
  name: 'Dashboard',
  components: {
    Header,
    AjouterEtudiant,
    DisplayBoard,
    Etudiants
  },
  data() {
      return {
          etudiants: [],
          nombreEtudiants: 0
      }
  },
  methods: {
    getAllEtudiants() {
      getAllEtudiants().then(response => {
        console.log(response)
        this.etudiants = response
        this.nombreEtudiants = this.etudiants.length
      })
    },
    ajouterEtudiant(data) {
      console.log('data:::', data)
      ajouterEtudiant(data).then(response => {
        console.log(response);
        this. getAllEtudiants();
      });
    }
  },
  mounted () {
    this. getAllEtudiants();
  }
}
</script>