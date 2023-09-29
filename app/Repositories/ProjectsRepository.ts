import { IPagingData } from "App/Utils/ApiResponses";
import {
  IProjectAdditionFilters,
  IProjectAdditionList,
} from "../Interfaces/AdditionsInterfaces";
import ProjectsVinculation from "App/Models/ProjectsVinculation";

export interface IProjectsRepository {
  getProjectsList(
    filters: IProjectAdditionFilters
  ): Promise<IPagingData<IProjectAdditionList>>;
  getProjectById(projectId: number): Promise<IProjectAdditionList | null>;
}

export default class ProjectsRepository implements IProjectsRepository {
  constructor() {}

  //?OBTENER LISTADO DE PROYECTOS CON SU ÁREA FUNCIONAL VINCULADA
  async getProjectsList(
    filters: IProjectAdditionFilters
  ): Promise<IPagingData<IProjectAdditionList>> {
    let { page, perPage } = filters;

    const res = ProjectsVinculation.query();

    res.preload("areaFuntional");

    page = 1;
    perPage = (await res).length;

    const projectsVinculationPaginated = await res.paginate(page, perPage);

    const { data, meta } = projectsVinculationPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IProjectAdditionList[],
      meta,
    };
  }

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
