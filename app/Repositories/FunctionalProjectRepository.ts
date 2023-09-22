import { IFunctionalProject } from '../Interfaces/FunctionalProjectInterfaces';
import FunctionalProject from '../Models/FunctionalProject';


export interface IFunctionalProjectRepository {

  getAllFunctionalProjects():Promise<IFunctionalProject[]>;
  createFunctionalProject(functionalProject:IFunctionalProject):Promise<IFunctionalProject>;

}

export default class FunctionalProjectRepository implements IFunctionalProjectRepository{

  constructor() {}
  
  async getAllFunctionalProjects():Promise<IFunctionalProject[]> {

    const res = await FunctionalProject.query();
    return res as unknown as IFunctionalProject[];

  }
  
  async createFunctionalProject (functionalProject:IFunctionalProject):Promise<IFunctionalProject> {

    return functionalProject;
    //const res = await FunctionalProject.query();
    //return res as unknown as IFunctionalProject;

  }

}
