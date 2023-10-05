import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import IPacRepository from "App/Repositories/PacRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export default interface IPacService {
    uploadPac(file): Promise<ApiResponse<any>>;
}

export default class PacService implements IPacService {

    constructor(private pacRepository: IPacRepository) { }

    uploadPac = async (file: any): Promise<ApiResponse<any>> => {
       
        // Obtener información y validación de excel
        const dataLoadedFromExcel = await this.pacRepository.uploadPac(file);
        
        /* dataLoadedFromExcel = [{
            "managementCenter": "91500000",
            "sapienciaPosition": "2340201", //sobra
            "sapienciaBudgetPosition": "923202020091",
            "fundSapiencia": "911000123",
            "fund":'145000123', //sobra
            "functionArea": "22020700.3620.99", // sobra
            "project": "200074"
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
                        "pacAnnualization": {
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
                        }
            
                    }
        } */


        //dataValidacion = respository.validarNegocio(res) // Validacion de consistencia de información.
 
        
        //reposutory.dataStructure() // data

        // almacenar información
        
        // metodo gardar ....
        //dataValidacion = respository.updateOrCreate()


        return new ApiResponse(dataLoadedFromExcel, EResponseCodes.OK);
    }


}