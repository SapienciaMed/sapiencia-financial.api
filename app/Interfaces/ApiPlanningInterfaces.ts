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

export interface Activity {
  id:                     number;
  objetiveActivity:       number;
  stageActivity:          number;
  productMGA:             string;
  activityMGA:            string;
  productDescriptionMGA:  string;
  activityDescriptionMGA: string;
  validity:               number;
  year:                   number;
  idProject:              number;
}

export interface IApiPlanningDetailedActivities {

  id:                  number;
  activityId:          number;
  consecutive:         string;
  detailActivity:      string;
  component:           number;
  measurement:         number;
  amount:              number;
  unitCost:            number;
  pospre:              number;
  validatorCPC:        null;
  clasificatorCPC:     null;
  sectionValidatorCPC: null;
  activity:            Activity;

}

export interface IApiPlanningDetailedActivitiesSpecify {

  //*Actividad Detallada MGA
  activityDetailedId: number;           // PK Actividad Detallada
  consecutiveActivityDetailed: string;  // Código Consecuetivo Actividad Detallada #.#.# ...
  detailActivityDetailed: string;       // Descripción Actividad Detallada
  amountActivityDetailed: number;       // Cantidad
  measurementActivityDetailed: number;  // Medida
  unitCostActivityDetailed: number;     // Costo Unitario
  totalCostActivityDetailed: number;    // Costo Total
  //*Actividad MGA GENERAL
  activityId: number;                   // PK Actividad General
  codeMga: number;                      // Código General de Actividad MGA
  codeConsecutiveProductMga: string;    // Consecutivo Código Producto
  productDescriptionMGA: string;        // Descripción Producto
  codeConsecutiveActivityMga: string;   // Consecutivo Código Actividad
  activityDescriptionMGA: string;       // Descripción Actividad

}

