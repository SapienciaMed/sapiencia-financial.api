declare module "@ioc:core.ReportProvider" {
  import { IReportService } from "App/Services/ReportService";
  const ReportProvider: IReportService;
  export default ReportProvider;
}
