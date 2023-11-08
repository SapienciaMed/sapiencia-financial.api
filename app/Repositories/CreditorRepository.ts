import { ICreditor, ICreditorsFilter } from "App/Interfaces/Creditors";
import Creditor from "App/Models/Creditor";
import { IPagingData } from "App/Utils/ApiResponses";

export interface ICreditorRepository {

    getCreditorsByFilters(creditorsFilter: ICreditorsFilter): Promise<IPagingData<ICreditor>>

}

export default class CreditorRepository implements ICreditorRepository {

    getCreditorsByFilters = async (creditorsFilter: ICreditorsFilter): Promise<IPagingData<ICreditor>> => {
        const query = Creditor.query();
            if(creditorsFilter.id) {
                query.where('id', creditorsFilter.id!)
            }
            if(creditorsFilter.document){
                query.where('document', creditorsFilter.document!)
            }

            const res = await query.paginate(creditorsFilter.page, creditorsFilter.perPage);
            const { data, meta } = res.serialize();

        return {
            array: data as ICreditor[],
            meta,
        };
    }



}