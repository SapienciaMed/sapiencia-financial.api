declare module "@ioc:core.CreditorsProvider" {
    import { ICreditorService } from "App/Services/CreditorService";
  
    const CreditorService: ICreditorService;
    export default CreditorService;
  }
  