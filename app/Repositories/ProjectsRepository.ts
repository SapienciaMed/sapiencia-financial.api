import ProjectsVinculation from "App/Models/ProjectsVinculation";
import { IProject } from '../Interfaces/ProjectsInterfaces';
import { tranformProjectsVinculation } from "App/Utils/sub-services";
import { IProjectsVinculation, IProjectsVinculationFull } from "App/Interfaces/ProjectsVinculationInterfaces";

export interface IProjectsRepository {
  getProjectById(projectId: number): Promise<IProjectsVinculationFull | null>;
  getProjectByInvestmentProjectId(id: number): Promise<IProject | null>;
  getProjectVinculationByProjectInvestmentId(proyectsIds: number[]): Promise<ProjectsVinculation[]>
}

export default class ProjectsRepository implements IProjectsRepository {
  constructor() {}

  //?OBTENER PROYECTO POR PK DE PROYECTO
  async getProjectById(
    projectId: number
  ): Promise<IProjectsVinculationFull | null> {

    const res = await ProjectsVinculation.query()
      .preload("areaFuntional").preload("functionalProject")
      .where("id", projectId)
      .first();

      if(!res) {
        return null
      }
      
    const toSend = await tranformProjectsVinculation([res.serialize() as IProjectsVinculation])


    return toSend.length === 0 ? null : toSend[0];
  }

  //?OBTENER VINCULACIÓN PROYECTO POR ID DE INVERSIÓN (API PLANEACIÓN)
  async getProjectByInvestmentProjectId(id: number): Promise<IProject | null> {

    const res = await ProjectsVinculation.query()
      .where("investmentProjectId", id)
      .first();

    return res ? (res.serialize() as IProject) : null;
  }
  
  async getProjectVinculationByProjectInvestmentId(proyectsIds: number[]): Promise<ProjectsVinculation[]> {

    const res = await ProjectsVinculation.query()
      .whereIn("investmentProjectId", proyectsIds)
      
    return res;
  }

}
