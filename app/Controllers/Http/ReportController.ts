import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ReportProvider from "@ioc:core.ReportProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { schema } from "@ioc:Adonis/Core/Validator";

export default class ReportController {

  public async generateExcelReport({ response, request }: HttpContextContract) {
    try {
      const filters = await request.validate({
        schema: schema.create({
          reportId: schema.string(),
          year: schema.number(),
        }),
      });
      response.header("Content-Type", "application/vnd.ms-excel");
      response.header(
        "Content-Disposition",
        "attachment; filename=report.xlsx"
      );
      const result = await ReportProvider.generateExcelReport(filters);

      response.send(result);
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }

  }
}
