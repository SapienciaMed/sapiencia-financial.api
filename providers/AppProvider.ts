import type { ApplicationContract } from "@ioc:Adonis/Core/Application";

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings

    /**************************************************************************/
    /******************************** SERVICES ********************************/
    /**************************************************************************/
    const FundsService = await import("App/Services/FundsService");
    const EntitiesService = await import("App/Services/EntitiesService");
    const BudgetsService = await import("App/Services/BudgetsService");

    /**************************************************************************/
    /************************ EXTERNAL SERVICES ********************************/
    /**************************************************************************/

    /**************************************************************************/
    /******************************** REPOSITORIES ****************************/
    /**************************************************************************/
    const BudgetsRepository = await import(
      "App/Repositories/BudgetsRepository"
    );
    const FundsRepository = await import(
      "App/Repositories/FundsRepository"
    );
    const EntitiesRepository = await import(
      "App/Repositories/EntitiesRepository"
    );



    /**************************************************************************/
    /******************************** CORE  ***********************************/
    /**************************************************************************/

    this.app.container.singleton(
      "core.BudgetsProvider",
      () => new BudgetsService.default(new BudgetsRepository.default())
    );
    this.app.container.singleton(
      "core.FundsProvider",
      () => new FundsService.default(new FundsRepository.default())
    );
    this.app.container.singleton(
      "core.EntitiesProvider",
      () => new EntitiesService.default(new EntitiesRepository.default())
    );
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
