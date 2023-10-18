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
        // const res =dataFake
        const res = await CdpCertificadoDisponibilidadPresupuestal.query().preload("icdAmounts",(query) => {
            query.select('id','cdp_id', 'amount')
        });
        return res as unknown as any[];
    }

}
