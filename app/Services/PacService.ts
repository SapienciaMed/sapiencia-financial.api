import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import IPacRepository from "App/Repositories/PacRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export default interface IPacService {
    uploadPac(file: any, body: IBody): Promise<ApiResponse<any>>;
}

interface IBody { 
    exercise: number;
    typeSource: string;
    typePac: string;
 }

export default class PacService implements IPacService {

    constructor(private pacRepository: IPacRepository) { }

    uploadPac = async (file: any, _body:IBody ): Promise<ApiResponse<any>> => {

        // Obtener información y validación de excel
        const { validTemplateStatus, data, rowsWithFieldsEmpty, rowsWithFieldNumberInvalid } = await this.pacRepository.uploadPac(file);
        if (validTemplateStatus.error) {
            return new ApiResponse(validTemplateStatus, EResponseCodes.FAIL, validTemplateStatus.message);
        }

        console.log({})

        //Meses Meses

        //RouteId ===>>> 


        // los mismos

        //console.log({dataLoadedFromExcel})
        /* dataLoadedFromExcel = [{
            "managementCenter": "91500000",
            "sapienciaPosition": "2340201", //sobra
            "sapienciaBudgetPosition": "923202020091",
            "fundSapiencia": "911000123",
            "fund":'145000123', //sobra
            "functionArea": "22020700.3620.99", // sobra
            "project": "200074",
            "pacAnnualization":[{
                            "id": 1,
                            "pacId": 1,
                            "type": "Programado",
                            "jan": 1.2,
                            "feb": 1.2,
                            "mar": 1.2,
                            "abr": 1.2,
                            "may": 1.2,
                            "jun": 1.2,
                            "jul": 1.2,
                            "ago": 1.2,
                            "sep": 1.2,
                            "oct": 1.2,
                            "nov": 1.2,
                            "dec": 1.2,
                            "dateModify": "",
                            "dateCreate": ""
                        },
                        {
                            "id": 1,
                            "pacId": 1,
                            "type": "Recaudo",
                            "jan": 1.2,
                            "feb": 1.2,
                            "mar": 1.2,
                            "abr": 1.2,
                            "may": 1.2,
                            "jun": 1.2,
                            "jul": 1.2,
                            "ago": 1.2,
                            "sep": 1.2,
                            "oct": 1.2,
                            "nov": 1.2,
                            "dec": 1.2,
                            "dateModify": "",
                            "dateCreate": ""
                        }]
        }] */

        /* responseSebas = [{
            "sourceType": "Propio",
            "budgetRouteId": 1,
            "version": 1,
            "exercise": 2023,
            "isActive": true,
            "pacAnnualization":[
{
                            "id": 1,
                            "pacId": 1,
                            "type": "Programado",
                            "jan": 1.2,
                            "feb": 1.2,
                            "mar": 1.2,
                            "abr": 1.2,
                            "may": 1.2,
                            "jun": 1.2,
                            "jul": 1.2,
                            "ago": 1.2,
                            "sep": 1.2,
                            "oct": 1.2,
                            "nov": 1.2,
                            "dec": 1.2,
                            "dateModify": "",
                            "dateCreate": ""
                        },
                        {
                            "id": 1,
                            "pacId": 1,
                            "type": "Recaudo",
                            "jan": 1.2,
                            "feb": 1.2,
                            "mar": 1.2,
                            "abr": 1.2,
                            "may": 1.2,
                            "jun": 1.2,
                            "jul": 1.2,
                            "ago": 1.2,
                            "sep": 1.2,
                            "oct": 1.2,
                            "nov": 1.2,
                            "dec": 1.2,
                            "dateModify": "",
                            "dateCreate": ""
                        }
            ]
        }] */


        // validar información (Consistencia data del negocio)
        //dataValidacion = respository.validarEnExcel(dataLoadedFromExcel) // Valicion de formato, campos vacios, y calculos.
        /* return {
            errorMessage:[{

            }],
            {
                "arrayData": [
                   {  
                        "id": 1,
                        "sourceType": "Propio",
                        "budgetRouteId": 1,
                        "version": 1,
                        "exercise": 2023,
                        "isActive": true,
                        "dateModify": "",
                        "dateCreate": "",
                        "pacAnnualization": [{
                            "id": 1,
                            "pacId": 1,
                            "type": "Programado",
                            "jan": 1.2,
                            "feb": 1.2,
                            "mar": 1.2,
                            "abr": 1.2,
                            "may": 1.2,
                            "jun": 1.2,
                            "jul": 1.2,
                            "ago": 1.2,
                            "sep": 1.2,
                            "oct": 1.2,
                            "nov": 1.2,
                            "dec": 1.2,
                            "dateModify": "",
                            "dateCreate": ""
                        }]
            
                    }
        } */


        //dataValidacion = respository.validarNegocio(data) // Validacion de consistencia de información.


        //reposutory.dataStructure() // data

        // almacenar información

        // metodo gardar ....
        //dataValidacion = respository.updateOrCreate()

        return new ApiResponse({validTemplateStatus, rowsWithFieldsEmpty,rowsWithFieldNumberInvalid, data}, EResponseCodes.OK);

    }


}