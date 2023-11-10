import * as XLSX from "xlsx";
import { EReportIds } from "App/Constants/ReportEnums";
import { IReportRepository } from "App/Repositories/ReportRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IExcelReportFilters } from "App/Interfaces/ReportsInterfaces";

export interface IReportService {
  generateExcelReport(
    filters: IExcelReportFilters
  ): Promise<ApiResponse<boolean>>;
}

export default class ReportService implements IReportService {
  constructor(private reportRepository: IReportRepository) {}

  private async generateExcelFile(data: any[]): Promise<any> {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    return buffer;
  }

  public async generateExcelReport(
    filters: IExcelReportFilters
  ): Promise<ApiResponse<boolean>> {
    let dataTable: any[];

    switch (filters.reportId) {
      case EReportIds.reportPAC:
        dataTable = await this.reportRepository.generateReportPac(filters.year);
        break;
      case EReportIds.reportModifiedRoutes:
        dataTable = await this.reportRepository.generateReportPac(filters.year);
        break;
      case EReportIds.reportDetailChangesBudget:
        dataTable = await this.reportRepository.generateReportDetailChangeBudgets(filters.year);
        break;
      case EReportIds.reportOverviewBudgetModifications:
        dataTable = await this.reportRepository.generateReportOverviewBudgetModifications(filters.year);
        break;
      case EReportIds.reportExecutionExpenses:
        dataTable = await this.reportRepository.generateReportExecutionExpenses(filters.year);
        break;
      case EReportIds.reportCdpBalance:
        dataTable = await this.reportRepository.generateReportCdpBalance(filters.year);
        break;
      case EReportIds.reportTransfers:
        dataTable = await this.reportRepository.generateReportTransfers(filters.year);
        break;

      default:
        dataTable = [];
        break;
    }

    const res = await this.generateExcelFile(dataTable);

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
