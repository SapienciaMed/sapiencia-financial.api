import {
  IProjectAdditionList,
} from "../Interfaces/AdditionsInterfaces";
import ProjectsVinculation from "App/Models/ProjectsVinculation";

export interface IProjectsRepository {
  getProjectById(projectId: number): Promise<IProjectAdditionList | null>;
}

export default class ProjectsRepository implements IProjectsRepository {
  constructor() {}

  //?OBTENER PROYECTO POR CODIGO DE PROYECTO (REFERENCIAL)
  async getProjectById(
    projectId: number
  ): Promise<IProjectAdditionList | null> {
    const res = await ProjectsVinculation.query()
      .where("id", projectId)
      .first();

    return res ? (res.serialize() as IProjectAdditionList) : null;
  }
}
