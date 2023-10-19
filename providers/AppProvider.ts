import type { ApplicationContract } from "@ioc:Adonis/Core/Application";

export default class AppProvider {
  constructor(protected app: ApplicationContract) { }

  public async register() {
    // Register your own bindings

    /**************************************************************************/
    /******************************** SERVICES ********************************/
    /**************************************************************************/
    const FundsService = await import("App/Services/FundsService");
    const EntitiesService = await import("App/Services/EntitiesService");
    const BudgetsService = await import("App/Services/BudgetsService");
    const PosPreSapienciaService = await import(
      "App/Services/PosPreSapienciaService"
    );
    const VinculationMGAService = await import(
      "App/Services/VinculationMGAService"
    );
    const FunctionalAreaService = await import(
      "App/Services/FunctionalAreaService"
    );
    const ManagementCenterService = await import(
      "App/Services/ManagementCenterService"
    );
    const TypesTransfersService = await import(
      "App/Services/TypesTransfersService"
    );
    const ProjectsService = await import("App/Services/ProjectsService");
    const BudgetsRoutesService = await import(
      "App/Services/BudgetsRoutesService"
    );
    const AdditionsService = await import("App/Services/AdditionsService");
    const TransfersService = await import("App/Services/TransfersService");
    const FunctionalProjectService = await import(
      "App/Services/FunctionalProjectService"
    );
    const StrategicDirectionService = await import(
      "App/Services/External/StrategicDirectionService"
    );
    const PacService = await import("App/Services/PacService");
    const CdpService = await import("App/Services/CdpsService")
    /**************************************************************************/
    /************************ EXTERNAL SERVICES ********************************/
    /**************************************************************************/

    /**************************************************************************/
    /******************************** REPOSITORIES ****************************/
    /**************************************************************************/
    const BudgetsRepository = await import(
      "App/Repositories/BudgetsRepository"
    );
    const FundsRepository = await import("App/Repositories/FundsRepository");
    const EntitiesRepository = await import(
      "App/Repositories/EntitiesRepository"
    );
    const PosPreSapienciaRepository = await import(
      "App/Repositories/PosPreSapienciaRepository"
    );
    const VinculationMGARepository = await import(
      "App/Repositories/VinculationMGARepository"
    );
    const FunctionalAreaRepository = await import(
      "App/Repositories/FunctionalAreaRepository"
    );
    const ProjectsRepository = await import(
      "App/Repositories/ProjectsRepository"
    );
    const ManagementCenterRepository = await import(
      "App/Repositories/ManagementCenterRepository"
    );
    const TypesTransfersRepository = await import(
      "App/Repositories/TypeTransfersRepository"
    );
    const BudgetsRoutesRepository = await import(
      "App/Repositories/BudgetsRoutesRepository"
    );
    const AdditionsRepository = await import(
      "App/Repositories/AdditionsRepository"
    );
    const MovementAdditionRepository = await import(
      "App/Repositories/MovementAdditionRepository"
    );
    const TransfersRepository = await import(
      "App/Repositories/TransfersRepository"
    );
    const MovementTransferRepository = await import(
      "App/Repositories/MovementTransferRepository"
    );
    const FunctionalProjectRepository = await import(
      "App/Repositories/FunctionalProjectRepository"
    );

    const PacRepository = await import("App/Repositories/PacRepository");
    const CdpRepository = await import("App/Repositories/CdpsRepository")

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
    this.app.container.singleton(
      "core.PosPreSapienciaProvider",
      () =>
        new PosPreSapienciaService.default(
          new PosPreSapienciaRepository.default()
        )
    );
    this.app.container.singleton(
      "core.VinculationMGAProvider",
      () =>
        new VinculationMGAService.default(
          new VinculationMGARepository.default()
        )
    );
    this.app.container.singleton(
      "core.FunctionalAreaProvider",
      () =>
        new FunctionalAreaService.default(
          new FunctionalAreaRepository.default()
        )
    );
    this.app.container.singleton(
      "core.ProjectsProvider",
      () =>
        new ProjectsService.default(
          new StrategicDirectionService.default(
            new VinculationMGARepository.default()
          ),
          new FunctionalAreaRepository.default()
        )
    );

    this.app.container.singleton(
      "core.ManagementCenterProvider",
      () =>
        new ManagementCenterService.default(
          new ManagementCenterRepository.default()
        )
    );
    this.app.container.singleton(
      "core.TypesTransfersProvider",
      () =>
        new TypesTransfersService.default(
          new TypesTransfersRepository.default()
        )
    );
    this.app.container.singleton(
      "core.BudgetsRoutesProvider",
      () =>
        new BudgetsRoutesService.default(new BudgetsRoutesRepository.default())
    );

    this.app.container.singleton(
      "core.AdditionsProvider",
      () =>
        new AdditionsService.default(
          new AdditionsRepository.default(),
          new MovementAdditionRepository.default(),
          new ProjectsRepository.default(),
          new FundsRepository.default(),
          new PosPreSapienciaRepository.default(),
          new BudgetsRepository.default(),
          new BudgetsRoutesRepository.default(),
          new StrategicDirectionService.default(
            new VinculationMGARepository.default()
          )
        )
    );

    this.app.container.singleton(
      "core.TransfersProvider",
      () =>
        new TransfersService.default(
          new TransfersRepository.default(),
          new MovementTransferRepository.default(),
          new ProjectsRepository.default(),
          new FundsRepository.default(),
          new PosPreSapienciaRepository.default(),
          new BudgetsRepository.default(),
          new BudgetsRoutesRepository.default()
        )
    );

    //API EXTERNA
    this.app.container.singleton(
      "core.PlanningProvider",
      () =>
        new StrategicDirectionService.default(
          new VinculationMGARepository.default()
        )
    );

    this.app.container.singleton(
      "core.FunctionalProjectProvider",
      () =>
        new FunctionalProjectService.default(
          new FunctionalProjectRepository.default()
        )
    );

    this.app.container.singleton(
      "core.PacProvider",
      () =>
        new PacService.default(
          new PacRepository.default(),
          new ProjectsRepository.default(),
          new FunctionalProjectRepository.default(),
          new FundsRepository.default(),
          new PosPreSapienciaRepository.default(),
          new BudgetsRoutesRepository.default(),
          new StrategicDirectionService.default(
            new VinculationMGARepository.default()
          )
        )
    );

/*    
    this.app.container.singleton(
      "core.CdpsProvider",
      () =>
        new CdpService.default(
          new CdpRepository
           //cdpRepository.getAllCdps()
        )
    ); */
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
