import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class CustomerService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      // timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  add = async (data) => {
    return this.instance
      .post(`/api/v1/customer/addCustomer`, data, {
       headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getAll = async () => {
    return this.instance
      .get(`/api/v1/customer/getCustomer/getall`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getOne = async (id) => {
    return this.instance
      .get(`/api/v1/customer/getCustomer/getOne/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  delete = async (id) => {
    return this.instance
      .delete(`/api/v1/customer/addCustomer/deleteOne/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
}
