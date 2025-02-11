import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class MyProfileService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      // timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  getMyProfile = async () => {
    return this.instance
      .get(`/api/v1/publicMaster/otherApi/user/getMyProfile`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };


  updateMyProfile = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/otherApi/user/updateMyProfile`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };


  getMyAllChild = async () => {
    return this.instance
      .get(`/api/v1/publicMaster/otherApi/user/getMyChild`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };


  updateMyOneChild = async ( childId,data) => {
    return this.instance
      .post(`/api/v1/publicMaster/otherApi/user/updateMyOneChild/${childId}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  deleteMyOneChild = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/otherApi/user/deleteMyOneChild`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  addChild = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/child`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };


}
