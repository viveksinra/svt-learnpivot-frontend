import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class RegistrationService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      // timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  publicGetAll = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/mockTest/getMockTest/forPublicPage`, data, {
        
      })
      .then((res) => res.data);
  };

  publicGetOne = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/getMockTest/publicGetOne/${id}`, {
      })
      .then((res) => res.data);
  };

  getMockWithFilter = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/otherApi/getRegistration/withFilter`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getBuyCourseWithFilter = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/otherApi/getCourse/withFilter`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getMockTestNumbersApi = async ( ) => {
    return this.instance
      .get(`/api/v1/publicMaster/report/admin/getMockTestNumbers`,  {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getCourseTestNumbersApi = async ( ) => {
    return this.instance
      .get(`/api/v1/publicMaster/report/admin/getCourseTestNumbers`,  {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getCourseParentNumbersApi = async ( ) => {
    return this.instance
      .get(`/api/v1/publicMaster/report/admin/getCourseParentNumbers`,  {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getCourseDropDown = async ( ) => {
    return this.instance
      .get(`/api/v1/publicMaster/course/getCourse/forDropDown`,  {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };


  getAllUser = async ( ) => {
    return this.instance
      .get(`/api/v1/publicMaster/report/user/getAllUser`,  {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getAllChild = async ( ) => {
    return this.instance
      .get(`/api/v1/publicMaster/report/user/getAllChild`,  {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getAllChildForDropDown = async ( ) => {
    return this.instance
      .get(`/api/v1/publicMaster/otherApi/admin/getAllChildForDropDown`,  {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  
  getOneUserOrChildReport = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/otherApi/admin/getOneUserOrChildReport`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  

}
