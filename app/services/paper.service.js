import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class PaperService {
  instance;
  constructor(url) {
    this.instance = axios.create({ baseURL: url, timeoutErrorMessage: "Time out!" });
  }

  // Public
  publicGetAll = async (data) => {
    return this.instance
      .post(`/api/v1/publicMaster/paper/getPaper/forPublicPage`, data, {})
      .then((res) => res.data);
  };
  publicGetOne = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/paper/getPaper/forPublicPage/${id}`, {})
      .then((res) => res.data);
  };
  alreadyBought = async ({ childId, id }) => {
    return this.instance
      .get(`/api/v1/publicMaster/paper/getPaper/alreadyBoughtPaper/${childId}/${id}`, {})
      .then((res) => res.data);
  };

  // Buy Paper
  buyPaperStepOne = async (data) => {
    return this.instance
      .post(`/api/v1/publicMaster/buyPaper/addBuyPaper`, data, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
  buyPaperWithBalanceOnly = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/buyPaper/addBuyPaper/buyPaperWithBalanceOnly/${id}`, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
  publicVerifyOnePaperPayment = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/buyPaper/addBuyPaper/verifyPayment/${id}`, {})
      .then((res) => res.data);
  };

  // Admin
  add = async (id, data) => {
    return this.instance
      .post(`/api/v1/publicMaster/paper/addPaper/${id}`, data, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
  getAll = async (searchUrl) => {
    return this.instance
      .get(`/api/v1/publicMaster/paper/getPaper/getDataWithPage/${searchUrl}`, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
  getOne = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/paper/getPaper/getOne/${id}`, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
  delete = async (baseUrl) => {
    return this.instance
      .delete(`/${baseUrl}`, { headers: getAuthorizationHeader() })
      .then((res) => res.data)
      .catch((err) => err);
  };

  // Admin reporting
  adminListPurchases = async (body) => {
    return this.instance
      .post(`/api/v1/publicMaster/buyPaper/getBuyPaper/admin/list`, body, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
  getMine = async () => {
    return this.instance
      .get(`/api/v1/publicMaster/buyPaper/getBuyPaper/getMine`, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
  adminUpdateProcess = async (id, body) => {
    return this.instance
      .patch(`/api/v1/publicMaster/buyPaper/getBuyPaper/admin/process/${id}`, body, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
  adminNotifyParent = async (id) => {
    return this.instance
      .post(`/api/v1/publicMaster/buyPaper/getBuyPaper/admin/notify/${id}`, {}, { headers: getAuthorizationHeader() })
      .then((res) => res.data);
  };
}


