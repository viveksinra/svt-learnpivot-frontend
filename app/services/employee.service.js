import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class EmployeeService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      timeoutErrorMessage: "Time out!",
    });
  }
  saveEmployee = async (baseUrl, employeeId, data) => {
    return this.instance
      .post(`/${baseUrl}/${employeeId}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getEmployee = async (baseUrl, employeeId) => {
    return this.instance
      .get(`/${baseUrl}/${employeeId}`, {
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
