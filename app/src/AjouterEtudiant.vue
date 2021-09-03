<template>
  <div class="container">
    <div class="row">
        <div class="col-md-7 mrgnbtm">
        <h2>Ajouter Etudiant</h2>
            <form>
                <div class="row">
                    <div class="form-group col-md-6">
                        <label htmlFor="nom">Nom</label>
                        <input type="text" class="form-control" v-model="nom" name="nom" id="nom" aria-describedby="infoEtudiant" placeholder="Nom" />
                    </div>
                    <div class="form-group col-md-6">
                        <label htmlFor="prenom">Prénom</label>
                        <input type="text" class="form-control" v-model="prenom" name="prenom" id="prenom" aria-describedby="infoEtudiant" placeholder="Prénom" />
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-12">
                        <label htmlFor="numeroEtudiant">Numéro d'étudiant</label>
                        <input type="text" class="form-control" v-model="numero" name="numero" id="numero" aria-describedby="infoEtudiant" placeholder="Numéro Etudiant" />
                    </div>
                </div>
                <button type="button" @click='ajouterEtudiant()' class="btn btn-danger">Ajouter</button>
            </form>
        </div>
    </div>
    </div>
</template>

<script>
export default {
  name: 'AjouterEtudiant',
  data() {
    return {
      nom: '',
      prenom: '',
      numero: ''
    }
  },
  methods: {
      ajouterEtudiant() {
          console.log(this.nom)
          const payload = {
              nom: this.nom,
              prenom: this.prenom,
              numero: this.numero
          }
          this.$emit('ajouterEtudiant', payload)
          this.clearForm();
      },
      clearForm() {
          this.nom = "";
          this.prenom= "";
          this.numero = "";
      }
  }
}
</script>