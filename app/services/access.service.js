import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class AccessService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      timeoutErrorMessage: "Time out!",
    });
  }
  saveAccess = async (accessId, data) => {
    return this.instance
      .post(`/api/v1/account/access/addAccess/${accessId}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => {
        console.log(res);
        return res.data;
      })
      .catch((err) => err);
  };
  deleteAccess = async (id) => {
    return this.instance
      .delete(`/api/v1/account/access/addAccess/deleteOne/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
}
