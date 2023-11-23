/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return "Api de servicios Transversales de SAPIENCIA";
});


Route.group(() => {
  Route.post("/generate-basic-excel", "ReportController.generateExcelReport");
}).middleware('auth:REPORTE_VISUALIZAR')
  .prefix("/api/v1/reports")
  .middleware("auth");
// http://127.0.0.1:4204/api/v1/reports/generate-basic-excel



Route.group(() => {
  Route.get("/get-by-id/:id", "FundsController.getFundsById").middleware('auth:FONDOS_VISUALIZAR');
  Route.post("/get-paginated", "FundsController.getFundsPaginated").middleware('auth:FONDOS_CONSULTAR');
  Route.post("/create", "FundsController.createFund").middleware('auth:FONDOS_CREAR');
  Route.put("/update/:id", "FundsController.updateFund").middleware('auth:FONDOS_EDITAR');
  Route.get("/get-all", "FundsController.getAllFunds").middleware('auth:FONDOS_CONSULTAR');
})
  .prefix("/api/v1/funds")
  .middleware("auth");
  


  Route.group(() => {
  Route.post("/get-paginated", "PagPagosController.getPagosPaginated").middleware('auth:PAGOS_CONSULTAR');
  Route.post("/create", "PagPagosController.processDocument").middleware('auth:PAGOS_CARGAR');
}).prefix("/api/v1/pag-pagos");



Route.group(() => {
  Route.get("/get-by-id/:id", "BudgetsController.getBudgetsById").middleware('auth:RUTA_PRESUPUESTAL_VISUALIZAR');
  Route.post("/get-paginated", "BudgetsController.getBudgetsPaginated").middleware('auth:RUTA_PRESUPUESTAL_CONSULTAR');
  Route.post("/create", "BudgetsController.createBudgets").middleware('auth:RUTA_PRESUPUESTAL_CREAR');
  Route.put("/update/:id", "BudgetsController.updateBudgets").middleware('auth:RUTA_PRESUPUESTAL_EDITAR');
  Route.get("/get-all", "BudgetsController.getAllBudgets").middleware('auth:RUTA_PRESUPUESTAL_CONSULTAR');
  Route.get("/get-all-cpc", "BudgetsController.getAllCpc");
})
  .prefix("/api/v1/budgets")
  .middleware("auth");




  Route.group(() => {
  Route.get("/get-all", "EntitiesController.getEntities");
})
  .prefix("/api/v1/entities")
  .middleware("auth");

  

Route.group(() => {
  Route.post(
    "/get-paginated",
    "PosPreSapienciaController.getPosPreSapienciaPaginated"
  ).middleware('auth:POSICION_PRESUPUESTAL_CONSULTAR');
  Route.put("/update/:id", "PosPreSapienciaController.updatePosPreSapiencia").middleware('auth:POSPRE_EDITAR');
  Route.get("/get-all", "PosPreSapienciaController.getAllPosPreSapiencia").middleware('auth:POSICION_PRESUPUESTAL_CONSULTAR');
  Route.get(
    "/get-posprevinculation-by-id/:id",
    "PosPreSapienciaController.getPosPreSapienciaById"
  ).middleware('auth:POSPRE_VISUALIZAR');
  Route.post(
    "/get-list-pospresap-vinculation-paginated",
    "PosPreSapienciaController.getListPosPreSapVinculationPaginated"
  ).middleware('auth:MGA_VINCULAR');
  Route.post(
    "/create-pospresap-vinculation",
    "PosPreSapienciaController.createPosPreSapVinculation"
  ).middleware('auth:POSPRE_CREAR');
  Route.post(
    "/update-pospresap-vinculation/:id",
    "PosPreSapienciaController.updatePosPreSapVinculation"
  ).middleware('auth:POSPRE_SAPIENCIA_VINCULAR');
})
  .prefix("/api/v1/pospre-sapiencia")
  .middleware("auth");




Route.group(() => {
  Route.get("/get-by-id/:id", "VinculationMGAController.getVinculationMGAById");
  Route.post(
    "/get-paginated",
    "VinculationMGAController.getVinculationMGAPaginated"
  );
  Route.post(
    "/get-detailed-activities-api-planning",
    "VinculationMGAController.getDetailedActivitiesV2"
  );
  Route.post(
    "/create-vinculation-api-planning",
    "VinculationMGAController.createVinculationWithPlanningV2"
  );
  Route.post(
    "/get-detailed-activities-api-planning-nouseonpospre/:pospreorgid",
    "VinculationMGAController.getDetailedActivitiesNoUseOnPosPre"
  );
  Route.post(
    "/get-detailed-activities-api-planning-yesuseonpospre/:pospreorgid",
    "VinculationMGAController.getDetailedActivitiesYesUseOnPosPre"
  );
  Route.get(
    "/get-detailed-activities-api-planning-by-id/:id",
    "VinculationMGAController.getVinculationDetailedActivitiesV2ById"
  );
  Route.post(
    "/update-vinculation-multiple",
    "VinculationMGAController.updateMultipleVinculation"
  );
  Route.post("/get-activities-detail", "VinculationMGAController.getActivitiesDetail")
  Route.post("/create-vinculation-mga", "VinculationMGAController.createVinculationMga")
  Route.post("/validate", "VinculationMGAController.validateVinculationMga")
  Route.post("/validate-all-Cdp", "VinculationMGAController.validateAallCdp")
}).prefix("/api/v1/vinculation-mga")
.middleware("auth");

  





Route.group(() => {
  Route.get("/get-by-id/:id", "FunctionalAreaController.getFunctionalAreaById").middleware('auth:AREA_FUNCIONAL_CONSULTAR');
  Route.post(
    "/get-paginated",
    "FunctionalAreaController.getFunctionalAreaPaginated"
  ).middleware('auth:AREA_FUNCIONAL_CONSULTAR');
  Route.post("/create", "FunctionalAreaController.createFunctionalArea").middleware('auth:AREA_FUNCIONAL_CREAR');
  Route.put("/update/:id", "FunctionalAreaController.updateFunctionalArea").middleware('auth:AREA_FUNCIONAL_EDITAR');
  Route.get("/get-all", "FunctionalAreaController.getAllFunctionalAreas").middleware('auth:AREA_FUNCIONAL_CONSULTAR');
  Route.post(
    "/link/create",
    "FunctionalAreaController.createProjectFunctionalArea"
  ).middleware('auth:AREA_FUNCIONAL_AGREGAR_PROYECTO');
  Route.post(
    "/link/update",
    "FunctionalAreaController.updateProjectFunctionalArea"
  ).middleware('auth:AREA_FUNCIONAL_CREAR');
  Route.delete(
    "/link/delete/:id",
    "FunctionalAreaController.deleteProjectFunctionalArea"
  ).middleware('auth:AREA_FUNCIONAL_ELIMINAR');
  Route.post(
    "/link/get-paginated",
    "FunctionalAreaController.getProjectFunctionalAreaPaginated"
  ).middleware('auth:AREA_FUNCIONAL_CONSULTAR');
})
  .prefix("/api/v1/functional-area")
  .middleware("auth");




Route.group(() => {
  Route.post("/get-paginated", "ProjectsController.getProjectsPaginated");
  Route.get("/get-all", "ProjectsController.getAllProjects");
  Route.post(
    "/get-unrelated-projects",
    "ProjectsController.getUnrelatedProjects"
  );
})
  .prefix("/api/v1/projects")
  .middleware("auth");

Route.group(() => {
  Route.get(
    "/get-by-id/:id",
    "ManagementCenterController.getManagementCenterById"
  );
  Route.post(
    "/get-paginated",
    "ManagementCenterController.getManagementCenterPaginated"
  );
})
  .prefix("/api/v1/management-center")
  .middleware("auth");


Route.group(() => {
  Route.get("/get-all", "TypesTransfersController.getTypeTransfers");
})
  .prefix("/api/v1/type-transfers")
  .middleware("auth");

  
Route.group(() => {
  Route.get("/get-by-id/:id", "BudgetsRoutesController.getBudgetsRoutesById").middleware('auth:RUTA_PRESUPUESTAL_VISUALIZAR');
  Route.post(
    "/get-paginated",
    "BudgetsRoutesController.getBudgetsRoutesPaginated"
  ).middleware('auth:RUTA_PRESUPUESTAL_CONSULTAR');
  Route.get(
    "/get-data",
    "BudgetsRoutesController.getBudgetsRoutesWithoutPagination"
  ).middleware('auth:RUTA_PRESUPUESTAL_CONSULTAR');
  Route.post("/create", "BudgetsRoutesController.createBudgetsRoutes").middleware('auth:RUTA_PRESUPUESTAL_CREAR');
  Route.put("/update/:id", "BudgetsRoutesController.updateBudgetsRoutes").middleware('auth:RUTA_PRESUPUESTAL_EDITAR');
})
  .prefix("/api/v1/budget-routes")
  .middleware("auth");


Route.group(() => {
  Route.post("/get-paginated", "AdditionsController.getAdditionsPaginated").middleware('auth:ADICION_CONSULTAR');
  Route.post("/get-funds", "AdditionsController.getFundsList");
  Route.post("/get-pospre", "AdditionsController.getPosPreList");
  Route.post(
    "/get-pospre-sapiencia",
    "AdditionsController.getPosPreSapienciaList"
  );
  Route.post("/save-data", "AdditionsController.executeCreateAdditions").middleware('auth:ADICION_CREAR'); //Como acción de guardado
  Route.post("/create", "AdditionsController.createAdditions").middleware('auth:ADICION_CREAR'); //Como acción validación
  Route.get(
    "/get-actadmin-district",
    "AdditionsController.getAllAdditionsByDistrict"
  );
  Route.get(
    "/get-actadmin-sapiencia",
    "AdditionsController.getAllAdditionsBySapiencia"
  );
  Route.get("/get-by-id/:id", "AdditionsController.getAdditionById").middleware('auth:ADICION_CONSULTAR');
  Route.post("/update/:id", "AdditionsController.updateAdditionWithMov").middleware('auth:ADICION_EDITAR'); //Como acción de validación
  Route.post(
    "/update-save/:id",
    "AdditionsController.executeUpdateAdditionWithMov"
  ); //Como acción de guardado/actualizado
  Route.post("/get-info-filter", "AdditionsController.budgetCdp"); //Como acción de guardado/actualizado
  ("AdditionsController.executeUpdateAdditionWithMov");
})
  .prefix("/api/v1/additions")
  .middleware("auth");

Route.group(() => {
  Route.post("/get-paginated", "TransfersController.getTransfersPaginated");
  Route.post("/get-funds", "TransfersController.getFundsList");
  Route.post("/get-pospre", "TransfersController.getPosPreList");
  Route.post(
    "/get-pospre-sapiencia",
    "TransfersController.getPosPreSapienciaList"
  );
  Route.post("/save-data", "TransfersController.executeCreateTransfers").middleware('auth:TRASLADO_CREAR'); //Como acción de guardado
  Route.post("/create", "TransfersController.createTransfers").middleware('auth:TRASLADO_CREAR'); //Como acción validación
  Route.get(
    "/get-actadmin-district",
    "TransfersController.getAllTransfersByDistrict"
  );
  Route.get(
    "/get-actadmin-sapiencia",
    "TransfersController.getAllTransfersBySapiencia"
  ).middleware('auth:TRASLADO_CONSULTAR');
  Route.get("/get-by-id/:id", "TransfersController.getTransferById").middleware('auth:TRASLADO_VISUALIZAR');;
  Route.post("/update/:id", "TransfersController.updateTransferWithMov").middleware('auth:TRASLADO_EDITAR'); //Como acción de validación
  Route.post(
    "/update-save/:id",
    "TransfersController.executeUpdateTransferWithMov"
  ).middleware('auth:TRASLADO_EDITAR');;
})
  .prefix("/api/v1/transfers")
  .middleware("auth");

Route.group(() => {
  Route.get(
    "/get-by-id/:id",
    "FunctionalProjectsController.getFunctionalProjectById"
  ).middleware('auth:PROYECTO_FUNCIONAMIENTO_CONSULTAR');
  Route.post(
    "/get-paginated",
    "FunctionalProjectsController.getFunctionalProjectPaginated"
  ).middleware('auth:PROYECTO_FUNCIONAMIENTO_CONSULTAR');
  Route.post("/create", "FunctionalProjectsController.createFunctionalProject").middleware('auth:PROYECTO_FUNCIONAMIENTO_CREAR');
  Route.post(
    "/update-save/:id",
    "FunctionalProjectsController.updateFunctionalProject"
  ).middleware('auth:PROYECTO_FUNCIONAMIENTO_EDITAR');
})
  .prefix("/api/v1/projectOperation")
  .middleware("auth");


Route.group(() => {
  Route.post("/upload-pac", "PacsController.uploadPac").middleware('auth:PAC_CARGAR');
  Route.post("/review-budgetroute", "PacsController.reviewBudgetsRoute");
  Route.post("/transfers-pac", "PacsController.transfersOnPac").middleware('auth:PAC_TRASLADO');
  Route.post("/validity-list", "PacsController.validityList");
  Route.post("/resources-type-list", "PacsController.resourcesTypeList");
  Route.post("/lists-dinamics-routes", "PacsController.listDinamicsRoutes");
  Route.post(
    "/search-annualdata-routes",
    "PacsController.searchAnnualDataRoutes"
  );
  Route.post("/get-ultimate-version", "PacsController.getUltimateVersion");
  Route.post("/search-pacs", "PacsController.searchPacs").middleware('auth:PAC_CONSULTAR');
  Route.post("/get-routes-by-validity", "PacsController.getRoutesByValidity");
  Route.post(
    "/lists-dinamics-association",
    "PacsController.listDinamicsAssociations"
  );
  Route.post("/create-association", "PacsController.createAssociations").middleware('auth:PAC_ASOCIAR_RUTAS');
  Route.post("/edit-pac", "PacsController.editPac").middleware('auth:PAC_EDITAR');
  Route.get("/get-pac-by-id/:id", "PacsController.getPacById").middleware('auth:PAC_VISUALIZAR');
  Route.post("/get-view-pac", "PacsController.viewPacComplete").middleware('auth:PAC_VISUALIZAR');
})
  .prefix("/api/v1/pac")
  .middleware("auth");

  
Route.group(() => {
  Route.post(
    "/search-cdps",
    "BudgetAvailabilityController.searchBudgetAvailability"
  ).middleware('auth:CDP_CONSULTAR');
  Route.post(
    "/create-cdp",
    "BudgetAvailabilityController.createCdpsCertificationBudgetAvailability"
  ).middleware('auth:CDP_CREAR');
  Route.post(
    "/asociate-amounts",
    "BudgetAvailabilityController.associateAmountsWithCdp"
  );
  Route.post(
    "/edit-cdp/:id",
    "BudgetAvailabilityController.editBudgetAvailabilityBasicDataCDP"
  ).middleware('auth:DATOS_BASICOS_CDP_EDITAR');
  Route.get(
    "/get-by-id/:id",
    "BudgetAvailabilityController.getBudgetAvailabilityById"
  ).middleware('auth:auth:CDP_VISUALIZAR');
  Route.post("/cancel-amount/", "BudgetAvailabilityController.cancelAmountCdp");
  Route.post("/link-mga/", "BudgetAvailabilityController.linkMga").middleware('auth:CDP_MGA_VINCULAR');
  Route.get(
    "/get-routeCDP-id/:id",
    "BudgetAvailabilityController.getRouteCDPId"
  );
  Route.put(
    "/updateRouteCDP/:id",
    "BudgetAvailabilityController.updateRoutesCDP"
  ).middleware('auth:CDP_RUTAS_EDITAR');
  Route.get("/get-CDPRp-id/:id", "BudgetAvailabilityController.getRpCDP").middleware('auth:CDP_VISUALIZAR_RP');
})
  .prefix("/api/v1/cdp").middleware("auth");


Route.group(() => {
  Route.post("/create-rp", "BudgetRecordsController.createRp").middleware('auth:RP_CREAR');
  Route.post(
    "/update-data-basic-rp",
    "BudgetRecordsController.updateDataBasicRp"
  ).middleware('auth:RP_DATOS_BASICOS_EDITAR');
  Route.get("/get-components", "BudgetRecordsController.getComponents");
  Route.post("/get-rp-by-filters", "BudgetRecordsController.getRpByFilters").middleware('auth:RP_CONSULTAR');
  Route.get("/get-all-activity-object-contracts", "BudgetRecordsController.getAllActivityObjectContracts");
  Route.get(
    "/get-totalvaluesimports/:id",
    "BudgetRecordsController.getTotalValuesImports"
  );
  Route.post("/update-data/:id", "BudgetRecordsController.updateRp").middleware('auth:RP_RUTAS_EDITAR');
  Route.get('/get-causation/:id', 'BudgetRecordsController.getCausation')
})
  .prefix("/api/v1/budget-records")
  .middleware("auth");
  
Route.group(() => {
  Route.post('create-creditor','CreditorsController.createCreditor').middleware('auth:ACREEDOR_CREAR')
  Route.post('update-creditor','CreditorsController.updateCreditor').middleware('auth:ACREEDOR_EDITAR')
  Route.post(
    "/get-creditors-by-filters",
    "CreditorsController.getCreditorsByFilters"
  ).middleware('auth:ACREEDOR_CONSULTAR');
}).prefix("/api/v1/creditors");

Route.group(() => {
  Route.get("/get-all-dependencies", "PayrollsController.getAllDependencies");
  Route.post(
    "/get-contractors-by-documents",
    "PayrollsController.getContractorsByDocuments"
  );
})
  .prefix("/api/v1/payroll")
  .middleware("auth");

Route.group(() => {
  Route.post("/uploads", "UploadMasiveController.redirectToUploadMasive");
})
  .prefix("/api/v1/upload-masive")
  .middleware("auth");
