import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class MedicationService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      timeoutErrorMessage: "Time out!",
    });
  }
  saveMedication = async (baseUrl, residentId, data) => {
    return this.instance
      .post(`/${baseUrl}/${residentId}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getMedication = async (baseUrl, residentId) => {
    return this.instance
      .get(`/${baseUrl}/${residentId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  deleteDocument = async (id) => {
    return this.instance
      .delete(`/api/v1/employee/document/addDocument/deleteOne/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };

}
