import http from "../http-common";

class ExamenDataService {
  getAll(params) {
    return http.get("/examens", { params });
  }

  get(id) {
    return http.get(`/examens/${id}`);
  }

  create(data) {
    return http.post("/examens", data);
  }

  updateExam(id, data) {
    return http.put(`/examens/${id}`, data);
  }
  closeExam(id)
  {
    return http.put(`/examens/cloturerExamen/${id}`);
  }

  addAStudent(id, data) {
    return http.put(`/examens/ajouterEtudiant/${id}`, data);
  }

  deleteAStudent(id, data) {
    return http.put(`/examens/supprimerEtudiant/${id}`, data);
  }

  delete(id) {
    return http.delete(`/examens/${id}`);
  }

  deleteAll() {
    return http.delete(`/examens`);
  }

  findByTitle(titre) {
    return http.get(`/examens?titre=${titre}`);
  }
  createWithCsv(file) {
    return http.post("/examens/upload/", file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
}

export default new ExamenDataService();