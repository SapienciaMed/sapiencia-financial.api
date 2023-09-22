export interface IProjectFilters {
  idList?: number[]
  codeList?: string[]
  status?: boolean
}

export interface IApiPlanningProject {

  id: number;
  user: string;
  status: boolean;
  bpin: string | null;
  project: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  process: number | null;
  localitation?: number;
  dependency: number | null;
  object?: string;
  pnd_pacto: string | null;
  pnd_linea: string | null;
  pnd_programa: string | null;
  pdd_linea: string | null;
  pdd_componentes: string | null;
  pdd_programa: string | null;
  pdi_linea: string | null;
  pdi_componentes: string | null;
  pdi_programa: string | null;
  problemDescription: string | null;
  magnitude: string | null;
  centerProblem: string | null;
  indicators: string | null;
  measurement: number | null;
  goal: number | null;
  // causes: ICause[] | null;
  // effects: IEffect[] | null;
  // actors: IParticipatingActors[] | null;


}

export interface IApiSpecificPlanningProjectData {

  id: number;
  bpin: string | null;
  project: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  user: string;

}

