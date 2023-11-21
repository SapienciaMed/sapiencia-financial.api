import { EProjectTypes } from "App/Constants/ProjectsEnums";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IProject } from "App/Interfaces/ProjectsInterfaces";
import {
  IProjectsVinculation,
  IProjectsVinculationFull,
} from "App/Interfaces/ProjectsVinculationInterfaces";
import VinculationMGARepository from "App/Repositories/VinculationMGARepository";
import StrategicDirectionService from "App/Services/External/StrategicDirectionService";

export async function tranformProjectsVinculation(
  projects: IProjectsVinculation[]
): Promise<IProjectsVinculationFull[]> {
  const toReturn: IProjectsVinculationFull[] = [];
  let investmentProjects: IProject[] = [];

  const strategicDirectionService = new StrategicDirectionService(
    new VinculationMGARepository()
  );

  if (projects.find((i) => i.type == EProjectTypes.investment)) {
 
    const res = await strategicDirectionService.getProjectByFilters({
      idList: projects.map((i) => i.investmentProjectId),
    });


    if (res.operation.code !== EResponseCodes.OK) {
      throw new Error(
        "Error al comunicarse con la api de direccion estreategica"
      );
    }

    investmentProjects = res.data;
  }

  for (const project of projects) {
    if (project.type == EProjectTypes.investment) {
      const iProject = investmentProjects.find(
        (j) => j.id == project.investmentProjectId
      );

      toReturn.push({
        ...project,
        projectId: iProject?.projectCode || "",
        conceptProject: iProject?.name || "",
        plannedValue: iProject?.plannedValue || 0,
        assignmentValue: iProject?.assignmentValue || 0,
      });
    } else {
      toReturn.push({
        ...project,
        projectId: project.functionalProject?.number || "",
        conceptProject: project.functionalProject?.name || "",
        plannedValue: 0,
        assignmentValue: 0,
      });
    }
  }

  return toReturn;
}
