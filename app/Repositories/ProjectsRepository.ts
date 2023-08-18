import { IPagingData } from "App/Utils/ApiResponses";
import { IProject, IProjectFilters } from "App/Interfaces/ProjectsInterfaces";
import { IProjectAdditionFilters, IProjectAdditionList } from '../Interfaces/AdditionsInterfaces';
import ProjectsVinculation from 'App/Models/ProjectsVinculation';

export interface IProjectsRepository {

  getProjectsPaginated(filters: IProjectFilters): Promise<IPagingData<IProject>>;
  getAllProjects(): Promise<IProject[]>;
  getProjectsList(filters: IProjectAdditionFilters): Promise<IPagingData<IProjectAdditionList>>;

}


export default class ProjectsRepository implements IProjectsRepository {
  data: IProject[]
  constructor() {
    this.data = [
      {
        id: "1",
        name: "Proyecto 1",
        plannedValue: 550000
      },
      {
        id: "2",
        name: "Proyecto 2",
        plannedValue: 132239444
      },
      {
        id: "3",
        name: "Proyecto 3",
        plannedValue: 55433222
      },
      {
        id: "4",
        name: "Proyecto 4",
        plannedValue: 4445677
      },
      {
        id: "5",
        name: "Proyecto 5",
        plannedValue: 74344551
      },
      {
        id: "6",
        name: "Proyecto 6",
        plannedValue: 74344551
      },
      {
        id: "7",
        name: "Proyecto 7",
        plannedValue: 74344551
      },
      {
        id: "8",
        name: "Proyecto 8",
        plannedValue: 74344551
      },
      {
        id: "9",
        name: "Proyecto 9",
        plannedValue: 74344551
      },
      {
        id: "10",
        name: "Proyecto 10",
        plannedValue: 74344551
      },
      {
        id: "11",
        name: "Proyecto 11",
        plannedValue: 74344551
      },
      {
        id: "12",
        name: "Proyecto 12",
        plannedValue: 74344551
      },
      {
        id: "13",
        name: "Proyecto 13",
        plannedValue: 74344551
      },
      {
        id: "14",
        name: "Proyecto 14",
        plannedValue: 74344551
      },
      {
        id: "15",
        name: "Proyecto 15",
        plannedValue: 74344551
      },
      {
        id: "16",
        name: "Proyecto 16",
        plannedValue: 74344551
      },
      {
        id: "17",
        name: "Proyecto 17",
        plannedValue: 74344551
      },
      {
        id: "18",
        name: "Proyecto 18",
        plannedValue: 74344551
      },
      {
        id: "19",
        name: "Proyecto 19",
        plannedValue: 74344551
      },
      {
        id: "20",
        name: "Proyecto 20",
        plannedValue: 74344551
      },
      {
        id: "21",
        name: "Proyecto 21",
        plannedValue: 74344551
      },
      {
        id: "22",
        name: "Proyecto 22",
        plannedValue: 74344551
      },
    ];
  };

  async getProjectsPaginated(filters: IProjectFilters): Promise<IPagingData<IProject>> {
    const returnData = filters.id ? this.data.filter(item => item.id === filters.id) : this.data;
    const meta = {
      "total": 5,
      "per_page": 10,
      "current_page": 1,
      "last_page": 1,
      "first_page": 1,
      "first_page_url": "/?page=1",
      "last_page_url": "/?page=1",
      "next_page_url": null,
      "previous_page_url": null
    }
    return {
      array: returnData,
      meta,
    };
  }

  async getAllProjects(): Promise<IProject[]> {
    return this.data;
  }

  //?OBTENER LISTADO DE PROYECTOS CON SU ÁREA FUNCIONAL VINCULADA
  async getProjectsList(filters: IProjectAdditionFilters): Promise<IPagingData<IProjectAdditionList>>{

    let { page , perPage } = filters;

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

}
