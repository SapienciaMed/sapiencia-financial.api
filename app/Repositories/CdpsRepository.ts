import { ICdpData, ICdps, IGetAllCdps, IIcdAmount } from "App/Interfaces/CdpsInterfaces";
import CdpCertificadoDisponibilidadPresupuestal from "../Models/CertificateBudgetAvailability";

export interface ICdpsRepository {
    searchCdps(cdps: ICdps): Promise<IGetAllCdps[]>;
}

export const filteredDataDate = (res: { meta?: any; data: any; }, cdps: ICdps) => {
    return {
        ...res,
        data: res.data.filter((item: ICdpData) => {
            const date = new Date(item.date);
            const year = date.getFullYear().toString();

            return (!cdps.initialDate || date >= new Date(cdps.initialDate)) &&
                (!cdps.endDate || date <= new Date(cdps.endDate)) &&
                year === cdps.dateOfCdp &&
                (!cdps.pospre || item.icdAmounts.some((icdAmount: IIcdAmount) => icdAmount.budgetRoute.pospreSapiencia?.id === cdps.pospre)) &&
                (!cdps.project || item.icdAmounts.some((icdAmount: IIcdAmount) => icdAmount.budgetRoute.projectVinculation?.id === cdps.project)) &&
                (!cdps.fund || item.icdAmounts.some((icdAmount: IIcdAmount) => icdAmount.budgetRoute.fund?.id === cdps.fund));
        })
    };
};

export default class CdpsRepository implements ICdpsRepository {
    constructor() { }

    async searchCdps(cdps: ICdps): Promise<IGetAllCdps[]> {

        const res = await CdpCertificadoDisponibilidadPresupuestal.query()
            .preload("icdAmounts", (query) => {
                query.preload('budgetRoute', (query) => {
                    query.preload('budget')
                    query.preload('pospreSapiencia')
                    query.preload('funds')
                    query.preload('projectVinculation')
                })
            }).paginate(1, 20);

        const data: IGetAllCdps = filteredDataDate(res.serialize(), cdps)

        return data as unknown as IGetAllCdps[];
    }

}
