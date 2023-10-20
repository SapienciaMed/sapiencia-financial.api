import CdpCertificadoDisponibilidadPresupuestal from "../Models/CertificateBudgetAvailability";
import IcdAmountsCdp from "../Models/IcdAmountsCdp";
// import BudgetsRoutes from "../Models/BudgetsRoutes";


export default interface ICdpsRepository {
    getAllCdps(): Promise<any[]>;
    createCdps(cdpDataTotal: any): Promise<any>;
}

// const dataFake = [
//     { title: "Datos falsos", value: "Prueba" }
// ]

export default class CdpsRepository implements ICdpsRepository {

    async getAllCdps(): Promise<any[]> {
        const res = await CdpCertificadoDisponibilidadPresupuestal.query()
            .preload("icdAmounts", (query) => {
                query.preload('budgetRoute', (query) => {
                    query.preload('budget', (query) => {
                        query.where('id', 1)
                    })
                    query.preload('pospreSapiencia')
                    query.preload('funds')
                    query.preload('projectVinculation')
                })
            }).paginate(1, 20);
        return res as unknown as any[];
    }


    async filterCdpsByDateAndContractObject(date: string, contractObject: string): Promise<any[]> {
        const results = await CdpCertificadoDisponibilidadPresupuestal.query()
            .where('CDP_FECHA', new Date(date).toISOString().split('T')[0])
            .where('CDP_OBJETO_CONTRACTUAL', 'LIKE', `%${contractObject}%`)
            .preload('icdAmounts');

        const cdps = results.map(result => result.toJSON());
        return cdps;
    }

    async deleteCdpById(cdpId: number): Promise<void> {
        const cdp = await CdpCertificadoDisponibilidadPresupuestal.find(cdpId);
        if (!cdp) {
            throw new Error('El registro no existe');
        }
        await cdp.delete();
    }

    async createCdps(cdpDataTotal: any) {
        const { date, contractObject, consecutive, sapConsecutive, icdArr } = cdpDataTotal;

        const existingCdps = await this.filterCdpsByDateAndContractObject(date, contractObject);
        let alert = "";

        if (existingCdps.length > 0) {
            alert = `Ya existe un CDP registrado para el objeto contractual ${contractObject} y la fecha ${date}`;
            throw new Error(alert);
        }

        const cdp = new CdpCertificadoDisponibilidadPresupuestal();
        cdp.date = date;
        cdp.contractObject = contractObject;
        cdp.consecutive = consecutive;
        cdp.sapConsecutive = sapConsecutive;
        await cdp.save();
        const icd = await cdp.related('icdAmounts').createMany(icdArr);
        if (!icd) { alert = "Error al guardar los importes"; }
        alert = "Se guardó correctamente la información";
        return { message: alert, cdp, icd };
    }


}