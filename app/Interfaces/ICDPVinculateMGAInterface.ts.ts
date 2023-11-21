export interface ICDPVinculateMGA {
    datos: IActivitieDetail[];
}


export interface IActivitieDetail {
    activitieMga: number;
    activitieDetailMga: number;
    percentageAfected: number;
    cdpCode: number;
    cpcCode: number;
}

