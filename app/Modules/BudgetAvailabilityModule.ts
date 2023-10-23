declare module "@ioc:core.BudgetAvailabilityProvider" {
  import { IBudgetAvailabilityService } from "App/Services/BudgetAvailabilityService";

  const BudgetAvailabilityProvider: IBudgetAvailabilityService;
  export default BudgetAvailabilityProvider;
}
