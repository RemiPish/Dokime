<template>
    <div class="display-board">
        <h4>Etudiant Ajouté</h4>
        <div class="number">
        {{nombreEtudiants}}
        </div>
        <div class="btn">
            <button @click='getAllEtudiants()' type="button" class="btn btn-warning">Afficher tous les étudiants</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DisplayBoard',
        props: ['nombreEtudiants'],
        methods: {
            getAllUsers() {
                this.$emit('getAllEtudiants')
            }
        }
    }
</script>