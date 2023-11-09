declare module "@ioc:core.PayrollProvider" {
  import { IPayrollService } from "App/Services/External/PayrollService";

  const PayrollService: IPayrollService;
  export default PayrollService;
}
