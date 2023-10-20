import ICdpsRepository from "App/Repositories/CdpsRepository";
import CdpCertificadoDisponibilidadPresupuestal from "App/Models/CertificateBudgetAvailability";
export class CdpsRepositoryFake implements ICdpsRepository {
    async getAllCdps(): Promise<any[]> {
        return Promise.resolve([]); // Puedes reemplazar esto con datos de prueba según sea necesario
    }

    async createCdps(cdpDataTotal: any): Promise<any> {
        // Simula la creación de un CDP y devuelve los datos simulados
        return Promise.resolve({
            message: "Información guardada correctamente",
            cdp: { id: 1, ...cdpDataTotal },
            icd: [{ id: 1, ...cdpDataTotal.icdArr[0] }, { id: 2, ...cdpDataTotal.icdArr[1] }]
        });
    }

    async filterCdpsByDateAndContractObject(date: string, contractObject: string): Promise<any[]> {
        // Simula la funcionalidad de filtrado y devuelve datos simulados
        return Promise.resolve([]);
    }

    async deleteCdpById(cdpId: number): Promise<void> {
        // Simula la funcionalidad de eliminación y devuelve una promesa vacía
        return Promise.resolve();
    }
}
