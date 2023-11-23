import { ICreditor, ICreditorsFilter } from "App/Interfaces/Creditors";
import Creditor from "App/Models/Creditor";
import { IPagingData } from "App/Utils/ApiResponses";

export interface ICreditorRepository {

    getCreditorsByFilters(creditorsFilter: ICreditorsFilter): Promise<IPagingData<ICreditor>>
    createCreditor(data: ICreditor): Promise<ICreditor>
    updateCreditor(data: ICreditor): Promise<ICreditor | null>

}

export default class CreditorRepository implements ICreditorRepository {

    createCreditor = async (creditor: ICreditor): Promise<ICreditor> => {
        const toCreateICreditor = new Creditor();
        delete creditor.id;
        toCreateICreditor.fill({ ...creditor });
        await toCreateICreditor.save();

        return toCreateICreditor.serialize() as ICreditor;

    }

    updateCreditor = async (creditor: ICreditor): Promise<ICreditor | null> => {
        const toUpdate = await Creditor.findOrFail(creditor.id);
        if (!toUpdate) {
            return null;
        }

        toUpdate.taxIdentification = creditor.taxIdentification!;
        toUpdate.name = creditor.name!;
        toUpdate.city = creditor.city!;
        toUpdate.address = creditor.address!;
        toUpdate.phone = creditor.phone!;
        toUpdate.email = creditor.email!;
        toUpdate.userModify = creditor.userModify!;
        toUpdate.userCreate = creditor.userCreate!;
        toUpdate.dateCreate = creditor.dateCreate!;
        toUpdate.dateModify = new Date().toISOString();
        if (creditor.userModify) {
            toUpdate.userModify = creditor.userModify;
        }

        await toUpdate.save();
        return toUpdate.serialize() as ICreditor;
    }

    getCreditorsByFilters = async (creditorsFilter: ICreditorsFilter): Promise<IPagingData<ICreditor>> => {
        const query = Creditor.query();
        if (creditorsFilter.id) {
            query.where('id', creditorsFilter.id!)
        }
        if (creditorsFilter.typeDocument) {
            query.where('typeDocument', creditorsFilter.typeDocument!)
        }
        if (creditorsFilter.document) {
            query.where('document', creditorsFilter.document!)
        }
        if (creditorsFilter.taxIdentification) {
            query.where('taxIdentification', creditorsFilter.taxIdentification!)
        }
        if (creditorsFilter.name) {
            query.where('name', creditorsFilter.name!)
        }

        const res = await query.paginate(creditorsFilter.page, creditorsFilter.perPage);
        const { data, meta } = res.serialize();

        return {
            array: data as ICreditor[],
            meta,
        };
    }





}