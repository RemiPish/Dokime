<template>
    <div class="container">
        <h2>Etudiants</h2>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Numéro d'étudiants</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="item in etudiants" :key="item.id">
                  <td>{{ item.nom }}</td>
                  <td>{{ item.prenom}}</td>
                  <td>{{ item.numero}}</td>
              </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'Etudiants',
        props: ['etudiants']
     }
</script>