import {
  IProjectAdditionList,
} from "../Interfaces/AdditionsInterfaces";
import ProjectsVinculation from "App/Models/ProjectsVinculation";
import { IProject } from '../Interfaces/ProjectsInterfaces';

export interface IProjectsRepository {
  getProjectById(projectId: number): Promise<IProjectAdditionList | null>;
  getProjectByInvestmentProjectId(id: number): Promise<IProject | null>;
}

export default class ProjectsRepository implements IProjectsRepository {
  constructor() {}

  //?OBTENER PROYECTO POR PK DE PROYECTO
  async getProjectById(
    projectId: number
  ): Promise<IProjectAdditionList | null> {

    const res = await ProjectsVinculation.query()
      .preload("areaFuntional")
      .where("id", projectId)
      .first();

    return res ? (res.serialize() as IProjectAdditionList) : null;
  }

  //?OBTENER VINCULACIÓN PROYECTO POR ID DE INVERSIÓN (API PLANEACIÓN)
  async getProjectByInvestmentProjectId(id: number): Promise<IProject | null> {

    const res = await ProjectsVinculation.query()
      .where("investmentProjectId", id)
      .first();

    return res ? (res.serialize() as IProject) : null;
  }

}
