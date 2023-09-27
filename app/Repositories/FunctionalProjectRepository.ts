import { IPagingData } from 'App/Utils/ApiResponses';
import { IFunctionalProject, IFunctionalProjectFilters } from '../Interfaces/FunctionalProjectInterfaces';
import FunctionalProject from '../Models/FunctionalProject';
import { DateTime } from 'luxon';


export interface IFunctionalProjectRepository {
  getFunctionalProjectById(id: number): Promise<IFunctionalProject | null>;
  getFunctionalProjectPaginated(filters: IFunctionalProjectFilters): Promise<IPagingData<IFunctionalProject>>;
  createFunctionalProject(functionalProject: IFunctionalProject): Promise<IFunctionalProject>;
  updateFunctionalProject(fund: IFunctionalProject, id: number): Promise<IFunctionalProject | null>;
}

export default class FunctionalProjectRepository implements IFunctionalProjectRepository {

  constructor() { }

  async getFunctionalProjectById(id: number): Promise<IFunctionalProject | null> {
    const res = await FunctionalProject.find(id);
    await res?.load('entity');
    return res ? (res.serialize() as IFunctionalProject) : null;
  }


  async getFunctionalProjectPaginated(filters: IFunctionalProjectFilters): Promise<IPagingData<IFunctionalProject>> {
    const query = FunctionalProject.query();
    query.orderBy("id", 'desc');
    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IFunctionalProject[],
      meta,
    };

  }

  async createFunctionalProject(functionalProject: IFunctionalProject): Promise<IFunctionalProject> {
    try {
      const toCreate = new FunctionalProject();
      toCreate.fill({ ...functionalProject });
      await toCreate.save();
      return toCreate.serialize() as IFunctionalProject;
    } catch (error) {
      console.log({ error })
      return error;
    }
  }


  async updateFunctionalProject(functionalProject: IFunctionalProject, id: number): Promise<IFunctionalProject | null> {
    const toUpdate = await FunctionalProject.find(id);
    if (!toUpdate) {
      return null;
    }

    toUpdate.entityId = functionalProject.entityId;
    toUpdate.number = functionalProject.number;
    toUpdate.name = functionalProject.name;
    toUpdate.isActivated = functionalProject.isActivated;
    toUpdate.dateFrom = functionalProject.dateFrom;
    toUpdate.dateTo = functionalProject.dateTo;
    toUpdate.dateModify = `${DateTime.local().toJSDate()}`
    if (functionalProject.userModify) {
      toUpdate.userModify = functionalProject.userModify;
    }

    await toUpdate.save();
    return toUpdate.serialize() as IFunctionalProject;
  }
}
