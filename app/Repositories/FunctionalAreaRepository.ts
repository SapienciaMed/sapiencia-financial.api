import { EProjectTypes } from "App/Constants/ProjectsEnums";
import {
  IFunctionalArea,
  IFunctionalAreaFilters,
} from "App/Interfaces/FunctionalAreaInterfaces";
import { IProjectsVinculate, IProjectsVinculateFilters, IProjectsVinculation } from "App/Interfaces/ProjectsVinculationInterfaces";
import FunctionalArea from "App/Models/FunctionalArea";
import ProjectsVinculation from "App/Models/ProjectsVinculation";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IFunctionalAreaRepository {

  getFunctionalAreaById(id: number): Promise<IFunctionalArea | null>;
  getFunctionalAreaPaginated(filters: IFunctionalAreaFilters): Promise<IPagingData<IFunctionalArea>>;
  createFunctionalArea(functionalArea: IFunctionalArea): Promise<IFunctionalArea>;
  updateFunctionalArea(functionalArea: IFunctionalArea, id: number): Promise<IFunctionalArea | null>;
  createProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<IProjectsVinculation[]>;
  updateProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<IProjectsVinculation[] | null>;
  deleteProjectFunctionalArea(projectVinculate: number): Promise<boolean>;
  getAllProjectFunctionalArea():Promise<IProjectsVinculation[]>;
  getProjectFunctionalAreaPaginated(filters: IProjectsVinculateFilters): Promise<IPagingData<IProjectsVinculation>>;
  getAllFunctionalAreas():Promise<IFunctionalArea[]>;
  getFunctionalAreaByNumber(number: string): Promise<IPagingData<IFunctionalArea>>;
  getAllInvestmentProjectIds(): Promise<number[]>

}

export default class FunctionalAreaRepository
  implements IFunctionalAreaRepository {
  constructor() { }

  async getAllInvestmentProjectIds(): Promise<number[]> {
    const res = await ProjectsVinculation.query().where('type', EProjectTypes.investment)
    return res.map(i=> i.investmentProjectId)
  }

  async getFunctionalAreaById(id: number): Promise<IFunctionalArea | null> {
    const res = await FunctionalArea.find(id);
    return res ? (res.serialize() as IFunctionalArea) : null;
  }

  async getFunctionalAreaPaginated(filters: IFunctionalAreaFilters): Promise<IPagingData<IFunctionalArea>> {

    const query = FunctionalArea.query();
    query.orderBy("number", "asc");

    if (filters.number) {
      await query.whereILike("number", `%${filters.number}%`);
    }

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IFunctionalArea[],
      meta,
    };
  }

  async createFunctionalArea(functionalArea: IFunctionalArea): Promise<IFunctionalArea> {
    const toCreateFunctionalArea = new FunctionalArea();
    toCreateFunctionalArea.number = functionalArea.number;
    toCreateFunctionalArea.denomination = functionalArea.denomination;
    toCreateFunctionalArea.description = functionalArea.description;
    if (functionalArea.userCreate) toCreateFunctionalArea.userCreate = functionalArea.userCreate;
    await toCreateFunctionalArea.save();
    return toCreateFunctionalArea.serialize() as IFunctionalArea;
  }

  async updateFunctionalArea(functionalArea: IFunctionalArea, id: number): Promise<IFunctionalArea | null> {
    const toUpdate = await FunctionalArea.find(id);
    if (!toUpdate) {
      return null;
    }
    toUpdate.number = functionalArea.number;
    toUpdate.denomination = functionalArea.denomination;
    toUpdate.description = functionalArea.description;
    await toUpdate.save();
    return toUpdate.serialize() as IFunctionalArea;
  }

  async createProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<IProjectsVinculation[]> {
    const vinculations: IProjectsVinculation[] = [];
    await Promise.all(projectsVinculate.projects.map(async (project) => {
      const toCreate = new ProjectsVinculation();
      toCreate.functionalAreaId = projectsVinculate.idFunctionalArea;
      toCreate.type = project.type

      if(project.type == EProjectTypes.investment) {
        toCreate.investmentProjectId = project.id
      }
      else {
        toCreate.operationProjectId = project.id
      }
      toCreate.linked = project.linked;
      if (projectsVinculate.userCreate) toCreate.userCreate = projectsVinculate.userCreate;
      await toCreate.save();
      vinculations.push(toCreate.serialize() as IProjectsVinculation);
    }));
    return vinculations;
  }

  async updateProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<IProjectsVinculation[] | null> {
    const vinculationsEdit: IProjectsVinculation[] = [];
    const vinculations: ProjectsVinculation[] = [];
    let Continue = true;
    await Promise.all(projectsVinculate.projects.map(async (project) => {
      const searchProjectsVinculation = await ProjectsVinculation.find(project.id);
      if(!searchProjectsVinculation) {
        Continue = false;
      } else {
        searchProjectsVinculation.linked = project.linked;
        vinculations.push(searchProjectsVinculation);
      }
    }));
    if(!Continue) return null
    await Promise.all(vinculations.map(async (project) => {
      await project.save();
      vinculationsEdit.push(project.serialize() as IProjectsVinculation);
    }));
    return vinculationsEdit;
  }

  async deleteProjectFunctionalArea(projectVinculate: number): Promise<boolean> {
    try {
      await ProjectsVinculation.query()
        .where("id", projectVinculate)
        .delete();
      return true;
    } catch {
      return false;
    }
  }

  async getAllProjectFunctionalArea():Promise<IProjectsVinculation[]> {
    const res = await ProjectsVinculation.query().preload("areaFuntional");
    return res as IProjectsVinculation[];
  }

  async getProjectFunctionalAreaPaginated(filters: IProjectsVinculateFilters): Promise<IPagingData<IProjectsVinculation>> {
    const query = ProjectsVinculation.query();
    if (filters.id) {
      await query.where("functionalAreaId", filters.id);
    }
    query.orderBy('linked', 'desc');

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IProjectsVinculation[],
      meta,
    };
  }

  async getAllFunctionalAreas():Promise<IFunctionalArea[]> {
    const res = await FunctionalArea.query();
    return res as IFunctionalArea[];
  }

  async getFunctionalAreaByNumber(number: string): Promise<IPagingData<IFunctionalArea>> {

    const query = FunctionalArea.query();
    query.where("number", number);
    query.orderBy("number", "asc");

    const page = 1;
    const perPage = 1;

    const res = await query.paginate(page, perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IFunctionalArea[],
      meta,
    };

  }

}
