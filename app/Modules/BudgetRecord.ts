declare module "@ioc:core.BudgetRecordProvider" {
    import { IBudgetRecordService } from "App/Services/BudgetRecordService";
  
    const BudgetRecordProvider: IBudgetRecordService;
    export default BudgetRecordProvider;
  }