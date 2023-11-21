declare module "@ioc:core.TransfersProvider" {
  import { ITransfersService } from "App/Services/TransfersService";

  const TransfersProvider: ITransfersService;
  export default TransfersProvider;
}
