import { IPagingData } from "App/Utils/ApiResponses";

import { IProject } from "App/Interfaces/ProjectsInterfaces";
import { IProjectsVinculation } from '../Interfaces/ProjectsVinculationInterfaces';

import {
  IProjectAdditionFilters,
  IProjectAdditionList
} from '../Interfaces/AdditionsInterfaces';

import ProjectsVinculation from 'App/Models/ProjectsVinculation';

export interface IProjectsRepository {

  getInitialResource(): Promise<string>;
  getAllProjects(): Promise<IProject[] | any>;
  getProjectsList(filters: IProjectAdditionFilters): Promise<IPagingData<IProjectAdditionList>>;
  getProjectById(projectId: number): Promise<IProjectAdditionList | null>;
  getProjectsNoUseOnFunctionalArea(functionalArea: number): Promise<IPagingData<IProjectsVinculation | any>>;

}


export default class ProjectsRepository implements IProjectsRepository {

  constructor() { };

  async getInitialResource(): Promise<string> {

    return "Iniciando Repositorio ...";

  }

  async getAllProjects(): Promise<IProject[] | any> {

    const res = await ProjectsVinculation.query();
    return res as ProjectsVinculation[];
  }

  //?OBTENER LISTADO DE PROYECTOS CON SU ÁREA FUNCIONAL VINCULADA
  //* Este lo usamos específicamente para las adiciones
  async getProjectsList(filters: IProjectAdditionFilters): Promise<IPagingData<IProjectAdditionList>> {

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
  //* Este lo usamos específicamente para las adiciones
  async getProjectById(projectId: number): Promise<IProjectAdditionList | null> {

    const res = await ProjectsVinculation.query()
      .where('id', projectId)
      .first();

    return res ? (res.serialize() as IProjectAdditionList) : null;

  }

  //?OBTENER PROYECTOS QUE NO ESTÁN SIENDO USADOS POR EL ÁREA FUNCIONAL
  async getProjectsNoUseOnFunctionalArea(functionalArea: number): Promise<IPagingData<IProjectsVinculation | any>> {

    const res = ProjectsVinculation.query().where("functionalAreaId", functionalArea);
    res.preload("areaFuntional");

    const projectsVinculationPaginated = await res.paginate(1, 10000);

    const { data, meta } = projectsVinculationPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IProjectsVinculation[],
      meta,
    };

  }

}
