import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class ChildService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      // timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  add = async (id, data) => {
    return this.instance
      .post(`/api/v1/publicMaster/child/${id}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getAll = async (searchText) => {
    return this.instance
      .get(`/api/v1/publicMaster/child/getAll/newToOld/100/1/${searchText?searchText:""}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getOne = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/child/getOne/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  delete = async (baseUrl) => {
    return this.instance
      .delete(`/${baseUrl}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };





  imgUpload = async (imgData)=>{
    return this.instance
    .post(`/api/v1/other/fileupload/upload`, imgData, {
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data; boundary=${imgData._boundary}`,
      },
    })
    .then((res) => res.data.result.secure_url)
    .catch((err) => {console.log(err) });
  };
  

}
