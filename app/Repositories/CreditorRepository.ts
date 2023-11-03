import Creditor from "App/Models/Creditor";

export interface ICreditorRepository {
    getCreditorsByFilters():Promise<Creditor[]>

}

export default class CreditorRepository implements ICreditorRepository {
    
    getCreditorsByFilters = async(): Promise<Creditor[]>=> {
        return await Creditor.query()
    }



}