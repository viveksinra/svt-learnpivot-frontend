import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class MyCourseService {
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
      .post(`/api/v1/publicMaster/course/getCourse/forPublicPage`, data, {
        
      })
      .then((res) => res.data);
  };
  publicGetOne = async (id ) => {
    return this.instance
      .get(`/api/v1/publicMaster/course/getCourse/forPublicPage/${id}`, {        
      })
      .then((res) => res.data);
  };


  buyStepOne = async (data) => {
    return this.instance     
      .post(`/api/v1/publicMaster/buyCourse/addBuyCourse`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  
  publicVerifyOnePayment = async (id ) => {
    return this.instance
      .get(`/api/v1/publicMaster/buyCourse/addBuyCourse/verifyPayment/${id}`, {        
      })
      .then((res) => res.data);
  };

  add = async (id, data) => {
    return this.instance
      .post(`/api/v1/publicMaster/course/addCourse/${id}`,data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getAll = async (searchUrl) => {
    return this.instance
      .get(`/api/v1/publicMaster/course/getCourse/getDataWithPage/${searchUrl}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getPaymentIntentApi = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/stripePayment/stripePay`, data, {
        headers: getAuthorizationHeader(),
        
      })
      .then((res) => res.data);
  };

  getOne = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/course/getCourse/getOne/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  deleteClass = async (baseUrl) => {
    return this.instance
      .delete(`/${baseUrl}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };

  checkIfSeatAvailable = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/course/getCourse/checkIfSeatAvailable/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  checkIfSeatAvailableForChild = async ({id,childId}) => {  
    return this.instance
      .get(`/api/v1/publicMaster/course/getCourse/checkIfSeatAvailableForChild/${id}/${childId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  alreadyBoughtDate = async ({childId,id}) => {
    return this.instance
      .get(`/api/v1/publicMaster/course/getCourse/alreadyBoughtCourseDate/${childId}/${id}`, {
      })
      .then((res) => res.data);
  };

  buyCourseWithBalanceOnly = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/buyCourse/addBuyCourse/buyCourseWithBalanceOnly/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };


  addParentToCourseAccessApi = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/admin/addParentToCourseAccess`, data, {
        headers: getAuthorizationHeader(),        
      })
      .then((res) => res.data);
  };
  DoesParentHaveCourseAccessApi = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/admin/doesParentHaveCourseAccess`, data, {
        headers: getAuthorizationHeader(),        
      })
      .then((res) => res.data);
  };


  SaveOrUpdateOneCourseAccessApi = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/admin/courseAccess/SaveOrUpdateOneCourseAccess`, data, {
        headers: getAuthorizationHeader(),        
      })
      .then((res) => res.data);
  };

  GetOneUserOneCourseAccessApi = async ({courseId,userId}) => {
    return this.instance
      .get(`/api/v1/publicMaster/report/admin/courseAccess/getOneUserOneCourse/${courseId}/${userId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  DeleteOneUserOneCourseAccessApi = async ({courseId,userId}) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/admin/courseAccess/deleteOneUserOneCourse/${courseId}/${userId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
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
