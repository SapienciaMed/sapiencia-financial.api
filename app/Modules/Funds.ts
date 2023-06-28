declare module "@ioc:core.FundsProvider" {
  import { IFundsService } from "App/Services/FundsService";

  const FundsProvider: IFundsService;
  export default FundsProvider;
}
