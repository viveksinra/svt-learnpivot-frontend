import { AuthService } from "./auth.service";
import { DashboardService } from "./dashboard.service";
import { CustomerService } from "./customer.service";
import { MyCourseService } from "./myCourse.service";
import { MockTestService } from "./mockTest.service";
import { RegistrationService } from "./registration.service.js";


import { EmployeeService } from "./employee.service";
import { ResidentService } from "./resident.service";
import { MedicationService } from "./medication.service";
import { CareService } from "./care.service";
import { LedgerService } from "./ledger.service";
import { PayReceiveService } from "./payReceive.service";
import { InvoiceService } from "./invoice.service";
import { AccessService } from "./access.service";

import { API_ENDPOINT } from "../utils/index";
import { ChildService } from "./child.service";
import { ReportService } from "./report.service";
import { MyProfileService } from "./myProfile.service";

export const authService = new AuthService(API_ENDPOINT);
export const dashboardService = new DashboardService(API_ENDPOINT);
export const customerService = new CustomerService(API_ENDPOINT);
export const myCourseService = new MyCourseService(API_ENDPOINT);
export const mockTestService = new MockTestService(API_ENDPOINT);
export const registrationService = new RegistrationService(API_ENDPOINT);
export const childService = new ChildService(API_ENDPOINT);
export const myProfileService = new MyProfileService(API_ENDPOINT);
export const reportService = new ReportService(API_ENDPOINT);


export const prospectService = new EmployeeService(API_ENDPOINT);
export const employeeService = new EmployeeService(API_ENDPOINT);
export const residentService = new ResidentService(API_ENDPOINT);
export const medicationService = new MedicationService(API_ENDPOINT);
export const careService = new CareService(API_ENDPOINT);
export const ledgerService = new LedgerService(API_ENDPOINT);
export const payReceiveService = new PayReceiveService(API_ENDPOINT);
export const invoiceService = new InvoiceService(API_ENDPOINT);
export const accessService = new AccessService(API_ENDPOINT);
