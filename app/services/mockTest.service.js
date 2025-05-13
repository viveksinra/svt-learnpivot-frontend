import axios from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import qs from "qs";

export class MockTestService {
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
  alreadyBoughtMock = async ({childId,id}) => {
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/getMockTest/alreadyBoughtMock/${childId}/${id}`, {
      })
      .then((res) => res.data);
  };
  isFullByBuyMock = async ({id}) => {
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/getMockTest/isFree/${id}`, {
        headers: getAuthorizationHeader(),

      })
      .then((res) => res.data);
  };
  mockBookingCount = async ({id}) => {
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/getMockTest/isBookingFull/${id}`, {
      })
      .then((res) => res.data);
  };

  buyMockStepOne = async (data) => {
    return this.instance
      .post(`/api/v1/publicMaster/buyMockTest/addBuyMock`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  buyMockWithBalanceOnly = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/buyMockTest/addBuyMock/buyMockWithBalanceOnly/${id}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  publicVerifyOneMockPayment = async (id ) => {
    return this.instance
      .get(`/api/v1/publicMaster/buyMockTest/addBuyMock/verifyPayment/${id}`, {        
      })
      .then((res) => res.data);
  };
  getPaymentIntentApi = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/stripePayment/stripePay/forMockTest`, data, {
        headers: getAuthorizationHeader(),
        
      })
      .then((res) => res.data);
  };
  sendMultiEmail = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/otherApi/email/sendMultiEmail`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  // CSSE Mock Test Report Maker methods
  getAllChildOfMockTest = async ({mockTestId, batchId}) => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/admin/getAllChildOfMockTest/${mockTestId}/${batchId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getCsseMockReport = async ({mockTestId, batchId}) => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/admin/getCsseMockReport/${mockTestId}/${batchId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  addCsseMockReport = async (data) => {
    return this.instance
      .post(`/api/v1/privateRoute/mockReportMaker/admin/addCsseMockReport`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getPastCsseMockTest = async () => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/admin/getPastCsseMockTest`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  add = async (id, data) => {
    return this.instance
      .post(`/api/v1/publicMaster/mockTest/addMockTest/${id}`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getAll = async (searchUrl) => {
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/getMockTest/getDataWithPage/${searchUrl}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  getOne = async (id) => {
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/getMockTest/getOne/${id}`, {
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
