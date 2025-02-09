import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class PayReceiveService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      timeoutErrorMessage: "Time out!",
    });
  }
  savePayRec = async (baseUrl, data) => {
    return this.instance
      .post(`/${baseUrl}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getPayRec = async (baseUrl) => {
    return this.instance
      .get(`/${baseUrl}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  deletePayRec = async (baseUrl) => {
    return this.instance
      .delete(baseUrl, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };

}
