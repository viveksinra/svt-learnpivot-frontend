import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class ReportService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      // timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  getMyAllPayment = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/getUserPayment/withFilter`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getUpcomingEvent = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/getUpComming/withFilter`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getUpcomingPayment = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/parent/getNextCoursePayment`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };



  getAdminAllPayment = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/getAllUserPayment/withFilter`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getOnePaymentReceiptData = async ( id) => {
    return this.instance
      .post(`/api/v1/publicMaster/report/getOnePaymentReceiptData/${id}`, {}, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
 

}
