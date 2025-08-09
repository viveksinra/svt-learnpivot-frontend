import { AuthService } from "./auth.service";
import { DashboardService } from "./dashboard.service";
import { MyCourseService } from "./myCourse.service";
import { MockTestService } from "./mockTest.service";
import { RegistrationService } from "./registration.service.js";


import { API_ENDPOINT } from "../utils/index";
import { ChildService } from "./child.service";
import { ReportService } from "./report.service";
import { MyProfileService } from "./myProfile.service";
import { TransactionService } from "./transaction.service";
import { PaperService } from "./paper.service";

export const authService = new AuthService(API_ENDPOINT);
export const dashboardService = new DashboardService(API_ENDPOINT);
export const myCourseService = new MyCourseService(API_ENDPOINT);
export const mockTestService = new MockTestService(API_ENDPOINT);
export const registrationService = new RegistrationService(API_ENDPOINT);
export const childService = new ChildService(API_ENDPOINT);
export const myProfileService = new MyProfileService(API_ENDPOINT);
export const reportService = new ReportService(API_ENDPOINT);
export const transactionService = new TransactionService(API_ENDPOINT);
export const paperService = new PaperService(API_ENDPOINT);


