import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class TransactionService {
  instance;
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      // timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  
  getOneUserTransactionReport = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/transaction/admin/oneUserTransaction`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  depositCoins = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/transaction/admin/addMoney`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  


  withdrawCoins = async (data) => {
    return this.instance
      .post(`/api/v1/publicMaster/transaction/admin/removeMoney`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  cancelFullCourseAndRefund = async (data) => {
    return this.instance
      .post(`/api/v1/publicMaster/transaction/admin/cancelFullCourseAndRefund`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  cancelCourseDateAndRefund = async (data) => {
    return this.instance
      .post(`/api/v1/publicMaster/transaction/admin/cancelCourseDateAndRefund`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  cancelFullMockTestAndRefund = async (data) => {
    return this.instance
      .post(`/api/v1/publicMaster/transaction/admin/cancelFullMockTestAndRefund`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  cancelMockTestDateAndRefund = async (data) => {
    return this.instance
      .post(`/api/v1/publicMaster/transaction/admin/cancelMockTestDateAndRefund`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  // user Balance
  getSelfCurrentAmount = async () => {
    return this.instance
      .get(`/api/v1/publicMaster/transaction/user/myCurrentBalance`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  getMyTransactionAndBalance = async () => {
    return this.instance
      .get(`/api/v1/publicMaster/transaction/user/myTransactions`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
}
