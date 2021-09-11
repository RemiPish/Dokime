import http from "../http-common";

class ExamenDataService {
  getAll(params){
    return http.get("/examens", { params });
  }

  get(id) {
    return http.get(`/examens/${id}`);
  }

  create(data) {
    return http.post("/examens", data);
  }

  update(id, data) {
    return http.put(`/examens/${id}`, data);
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
}

export default new ExamenDataService();