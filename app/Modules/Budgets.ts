declare module "@ioc:core.BudgetsProvider" {
  import { IBudgetsService } from "App/Services/BudgetsService";

  const BudgetsProvider: IBudgetsService;
  export default BudgetsProvider;
}
