import Pac from "App/Models/Pac";

export interface IReportRepository {
  generateReportPac(year: number): Promise<any[]>;
}

export default class ReportRepository implements IReportRepository {
  async generateReportPac(year: number): Promise<any[]> {
    const res = await Pac.query().where("exercise", year);

    return res.map((i) => i.serialize());
  }
}
