import CdpCertificadoDisponibilidadPresupuestal from "../Models/CertificateBudgetAvailability";
import IcdAmountsCdp from "../Models/IcdAmountsCdp";
// import BudgetsRoutes from "../Models/BudgetsRoutes";


export default interface ICdpsRepository {
    getAllCdps(): Promise<any[]>;
    createCdps(cdpData: any, icdData: any, date:any): Promise<any>;
}

// const dataFake = [
//     { title: "Datos falsos", value: "Prueba" }
// ]

export default class CdpsRepository implements ICdpsRepository {
    
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
    

      async filterCdpsByDateAndContractObject(date: string, contractObject: string): Promise<any[]> {
        const results = await CdpCertificadoDisponibilidadPresupuestal.query()
            .where('CDP_FECHA', date)
            .where('CDP_OBJETO_CONTRACTUAL', 'LIKE', `%${contractObject}%`)
            .preload('icdAmounts');
    
        const cdps = results.map(result => result.toJSON());
        return cdps;
    }

      async createCdps(cdpData: any, icdData: any, date: any) {
        const { contractObject, consecutive } = cdpData;
    
        const existingCdps = await this.filterCdpsByDateAndContractObject(date, contractObject);
    
        if (existingCdps.length > 0) {
            throw new Error('El valor ya se encuentra registrado');
        }
    
        const cdp = new CdpCertificadoDisponibilidadPresupuestal();
        cdp.date = cdpData.date;
        cdp.contractObject = contractObject;
        cdp.consecutive = consecutive;
        await cdp.save();
        const icd = new IcdAmountsCdp();
        if(cdp.id){
            icd.cdpCode = cdp.id;
            icd.idRppCode = icdData.idRppCode;
            icd.cdpPosition = icdData.cdpPosition;
            icd.amount = icdData.amount;
            await icd.save();
        }
    
        return { cdp, icd };
    }
}