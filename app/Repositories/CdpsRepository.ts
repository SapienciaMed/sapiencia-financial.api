import CdpCertificadoDisponibilidadPresupuestal from "../Models/CertificateBudgetAvailability";
// import BudgetsRoutes from "../Models/BudgetsRoutes";

export interface ICdpsRepository {
    getAllCdps(): Promise<any[]>;
}

// const dataFake = [
//     { title: "Datos falsos", value: "Prueba" }
// ]

export default class CdpsRepository implements ICdpsRepository {
    constructor() { }

    async getAllCdps(): Promise<any[]> {
        const res = await CdpCertificadoDisponibilidadPresupuestal.query()
            .preload("icdAmounts", (query) => {
                query.preload('budgetRoute', (query) => {
                    query.preload('budget',(query)=>{
                        query.where('id',1)
                    })
                    query.preload('pospreSapiencia')
                    query.preload('funds')
                    query.preload('projectVinculation')
                })
            }).paginate(1,20);
        return res as unknown as any[];
    }

}
