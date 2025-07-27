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
  sendOneEmail = async ( data) => {
    return this.instance
      .post(`/api/v1/publicMaster/otherApi/email/sendOneEmail`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  // ==================== MOCK REPORT MAKER METHODS ====================

  /**
   * Get all past CSSE mock tests for admin dropdown
   * @returns {Promise} Response with past mock tests
   */
  getPastCsseMockTest = async () => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/admin/getPastCsseMockTest`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Get all past FSCE mock tests for admin dropdown
   * @returns {Promise} Response with past mock tests
   */
  getPastFsceMockTest = async () => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/admin/getPastFsceMockTest`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Get all children registered for a specific mock test and batch
   * @param {Object} params - Parameters object
   * @param {string} params.mockTestId - Mock test ID
   * @param {string} params.batchId - Batch ID
   * @returns {Promise} Response with children data
   */
  getAllChildOfMockTest = async ({ mockTestId, batchId }) => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/admin/getAllChildOfMockTest/${mockTestId}/${batchId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Get CSSE mock test report by mock test ID and batch ID
   * @param {Object} params - Parameters object
   * @param {string} params.mockTestId - Mock test ID
   * @param {string} params.batchId - Batch ID
   * @returns {Promise} Response with mock test report
   */
  getCsseMockReport = async ({ mockTestId, batchId }) => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/admin/getCsseMockReport/${mockTestId}/${batchId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Create or update CSSE mock test report
   * @param {Object} data - Mock test report data
   * @param {string} data.mockTestId - Mock test ID
   * @param {string} data.batchId - Batch ID
   * @param {number} data.mathsMaxScore - Maximum math score
   * @param {number} data.englishMaxScore - Maximum English score
   * @param {Array} data.childScore - Array of child scores with ranks
   * @param {Object} data.boysThresholds - Boys thresholds for different schools
   * @param {Object} data.girlsThresholds - Girls thresholds for different schools
   * @returns {Promise} Response with success/error message
   */
  addCsseMockReport = async (data) => {
    return this.instance
      .post(`/api/v1/privateRoute/mockReportMaker/admin/addCsseMockReport`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
  addFsceMockReport = async (data) => {
    return this.instance
      .post(`/api/v1/privateRoute/mockReportMaker/admin/addFsceMockReport`, data, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Get FSCE mock test report by mock test ID and batch ID
   * @param {Object} params - Parameters object
   * @param {string} params.mockTestId - Mock test ID
   * @param {string} params.batchId - Batch ID
   * @returns {Promise} Response with mock test report
   */
  getFsceMockReport = async ({ mockTestId, batchId }) => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/admin/getFsceMockReport/${mockTestId}/${batchId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  // ==================== PARENT METHODS ====================

  /**
   * Get all past CSSE mock test results for a specific child (for parents)
   * @param {string} childId - Child ID
   * @returns {Promise} Response with child's mock test results
   */
  getMyPastCsseMockTestResultForAll = async (childId) => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/parent/getMyPastCsseMockTestResultForAll/${childId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Get specific CSSE mock test result by batch ID for a child (for parents)
   * @param {Object} params - Parameters object
   * @param {string} params.childId - Child ID
   * @param {string} params.mockTestId - Mock test ID
   * @param {string} params.batchId - Batch ID
   * @returns {Promise} Response with specific mock test result
   */
  getMyPastCsseMockTestResultByBatchId = async ({ childId, mockTestId, batchId }) => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/parent/getMyPastCsseMockTestResultByBatchId/${childId}/${mockTestId}/${batchId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Get mock test IDs by child ID (for parents)
   * @param {string} childId - Child ID
   * @returns {Promise} Response with mock test IDs for the child
   */
  getMockTestIdsByChildId = async (childId) => {
    return this.instance
      .get(`/api/v1/privateRoute/mockReportMaker/parent/getMockTestIdsByChildId/${childId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

// for fsce
 /**
   * Get all past CSSE mock test results for a specific child (for parents)
   * @param {string} childId - Child ID
   * @returns {Promise} Response with child's mock test results
   */
 getMyPastFsceMockTestResultForAll = async (childId) => {
  return this.instance
    .get(`/api/v1/privateRoute/mockReportMaker/parent/getMyPastFsceMockTestResultForAll/${childId}`, {
      headers: getAuthorizationHeader(),
    })
    .then((res) => res.data);
};

/**
 * Get specific CSSE mock test result by batch ID for a child (for parents)
 * @param {Object} params - Parameters object
 * @param {string} params.childId - Child ID
 * @param {string} params.mockTestId - Mock test ID
 * @param {string} params.batchId - Batch ID
 * @returns {Promise} Response with specific mock test result
 */
  getMyPastFsceMockTestResultByBatchId = async ({ childId, mockTestId, batchId }) => {
  return this.instance
    .get(`/api/v1/privateRoute/mockReportMaker/parent/getMyPastFsceMockTestResultByBatchId/${childId}/${mockTestId}/${batchId}`, {
      headers: getAuthorizationHeader(),
    })
    .then((res) => res.data);
};

getFsceMockTestIdsByChildId = async (childId) => {
  return this.instance
    .get(`/api/v1/privateRoute/mockReportMaker/parent/getFsceMockTestIdsByChildId/${childId}`, {
      headers: getAuthorizationHeader(),
    })
    .then((res) => res.data);
};









  // ==================== EXISTING METHODS ====================

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
    .then((res) => res.data.result.Location)
    .catch((err) => {console.log(err) });
  };

  // ==================== WAITING LIST METHODS ====================

  /**
   * Join waiting list for a mock test batch
   * @param {Object} params - Parameters object
   * @param {string} params.mockId - Mock test ID
   * @param {string} params.batchId - Batch ID
   * @param {string} params.childId - Child ID (optional)
   * @returns {Promise} Response with success/error message
   */
  joinWaitingList = async ({ mockId, batchId, childId = null }) => {
    return this.instance
      .post(`/api/v1/publicMaster/mockTest/waitingList/join/${mockId}`, { batchId, childId }, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Leave waiting list for a mock test batch
   * @param {Object} params - Parameters object
   * @param {string} params.mockId - Mock test ID
   * @param {string} params.batchId - Batch ID
   * @param {string} params.childId - Child ID (optional)
   * @returns {Promise} Response with success/error message
   */
  leaveWaitingList = async ({ mockId, batchId, childId = null }) => {
    return this.instance
      .delete(`/api/v1/publicMaster/mockTest/waitingList/leave/${mockId}`, {
        headers: getAuthorizationHeader(),
        data: { batchId, childId }
      })
      .then((res) => res.data);
  };

  /**
   * Admin: Get waiting list entries with optional filters
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (pending/accepted/rejected)
   * @param {string} params.mockTestId - Filter by mock test ID
   * @param {string} params.search - Search term
   * @param {string} params.sort - Sort order (dateAsc/dateDesc)
   * @returns {Promise} Response with waiting list data
   */
  adminGetWaitingList = async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/waitingList/admin/listAll${qs ? `?${qs}` : ""}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Admin: Update waiting list entry status
   * @param {Object} params - Parameters object
   * @param {string} params.entryId - Waiting list entry ID
   * @param {string} params.status - New status (accepted/rejected/pending)
   * @returns {Promise} Response with success/error message
   */
  adminUpdateWaitingStatus = async ({ entryId, status }) => {
    return this.instance
      .post(`/api/v1/publicMaster/mockTest/waitingList/admin/updateStatus/${entryId}`, { status }, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Check if seat is available for a mock test batch
   * @param {Object} params - Parameters object
   * @param {string} params.mockId - Mock test ID
   * @param {string} params.batchId - Batch ID
   * @returns {Promise} Response with availability status
   */
  checkIfSeatAvailable = async ({ mockId, batchId }) => {
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/getMockTest/checkIfSeatAvailable/${mockId}/${batchId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };

  /**
   * Check if seat is available for a mock test batch for specific child
   * @param {Object} params - Parameters object
   * @param {string} params.mockId - Mock test ID
   * @param {string} params.batchId - Batch ID
   * @param {string} params.childId - Child ID
   * @returns {Promise} Response with availability status
   */
  checkIfSeatAvailableForChild = async ({ mockId, batchId, childId }) => {
    return this.instance
      .get(`/api/v1/publicMaster/mockTest/getMockTest/checkIfSeatAvailableForChild/${mockId}/${batchId}/${childId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => res.data);
  };
}
