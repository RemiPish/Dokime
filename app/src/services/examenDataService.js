import {examenInstance} from "../http-common";

class ExamenDataService {
  
  findAll(params) {
    return examenInstance.get("/examens", { params });
  }

  get(id) {
    return examenInstance.get(`/examens/${id}`);
  }

  create(data) {
    return examenInstance.post("/examens", data);
  }

  updateExam(id, data) {
    return examenInstance.put(`/examens/${id}`, data);
  }

  stopExam(id, data) {
    return examenInstance.put(`/examens/evaluation/${id}`, data);
  }

  updateStudent(id, data) {
    return examenInstance.put(`/examens/etudiant/${id}`, data);
  }

  closeExam(id)
  {
    return examenInstance.put(`/examens/cloturerExamen/${id}`);
  }

  addAStudent(id, data) {
    return examenInstance.put(`/examens/ajouterEtudiant/${id}`, data);
  }

  deleteAStudent(id, data) {
    return examenInstance.put(`/examens/supprimerEtudiant/${id}`, data);
  }

  delete(id) {
    return examenInstance.delete(`/examens/${id}`);
  }

  deleteAll() {
    return examenInstance.delete(`/examens`);
  }

  getBaseURL()
  {
    return examenInstance.defaults.baseURL;
  }

  findAStudent(id, numero)
  {
    return examenInstance.get(`/examens/etudiant/${id}/${numero}`);
  }

  findByTitle(titre) {
    return examenInstance.get(`/examens?titre=${titre}`);
  }
  createWithCsv(file) {
    return examenInstance.post("/examens/upload/", file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  
  findCandidatByURL(id)
  {
    return examenInstance.get(`/examens/candidat/${id}`)
  }
}

export default new ExamenDataService();