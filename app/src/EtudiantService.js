'use strict'
export async function getAllEtudiants() {

    const response = await fetch('/api/etudiants');
    return await response.json();
}

export async function ajouterEtudiant(data) {
    const response = await fetch(`/api/etudiant`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({etudiant: data})
      })
    return await response.json();
}