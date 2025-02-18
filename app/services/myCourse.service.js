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






  saveHealth = async (id, data) => {
    return this.instance
      .post(`/api/v1/enquiry/health/addHealth/${id}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getHealth = async (id) => {
    return this.instance
      .get(`/api/v1/enquiry/health/getHealth/getOne/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  saveCompliance = async (id, data) => {
    return this.instance
      .post(`/api/v1/enquiry/compliance/addCompliance/${id}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getCompliance = async (prospectId, complianceId) => {
    return this.instance
      .get(`/api/v1/enquiry/compliance/getCompliance/getAll/${prospectId}/${complianceId}`, {
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
  saveContact = async (contactId, data) => {
    return this.instance
      .post(`/api/v1/enquiry/contact/addContact/${contactId}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getContact = async (prospectId, contactId) => {
    return this.instance
      .get(`/api/v1/enquiry/contact/getContact/getAll/${prospectId}/${contactId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  saveTask = async (baseUrl,taskId, data) => {
    return this.instance
      .post(`/${baseUrl}/${taskId}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getTask = async (taskApi) => {
    return this.instance
      .get(`/${taskApi}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  saveNote = async (noteId, data) => {
    return this.instance
      .post(`/api/v1/enquiry/note/addNote/${noteId}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getNote = async (prospectId, noteId) => {
    return this.instance
      .get(`/api/v1/enquiry/note/getNote/getAll/${prospectId}/${noteId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  setPassword = async (prospectId, data) => {
    return this.instance
      .post(`/api/v1/enquiry/prospect/addProspect/password/${prospectId}`,data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  moveToResident = async (baseUrl, prospectId, data) => {
    return this.instance
      .post(`/${baseUrl}/${prospectId}`,data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  scheduleLeave = async (baseUrl, data) => {
    return this.instance
      .post(`/${baseUrl}`,data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getScheduleLeave = async (baseUrl) => {
    return this.instance
      .get(`/${baseUrl}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
  };

  deleteLeave = async (baseUrl) => {
    return this.instance
      .delete(`/${baseUrl}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data)
      .catch((err) => err);
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
