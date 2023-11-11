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
})
  .prefix("/api/v1/reports")
  .middleware("auth");
// http://127.0.0.1:4204/api/v1/reports/generate-basic-excel

Route.group(() => {
  Route.get("/get-by-id/:id", "FundsController.getFundsById");
  Route.post("/get-paginated", "FundsController.getFundsPaginated");
  Route.post("/create", "FundsController.createFund");
  Route.put("/update/:id", "FundsController.updateFund");
  Route.get("/get-all", "FundsController.getAllFunds");
}).prefix("/api/v1/funds");
// .middleware("auth");

Route.group(() => {
  Route.get("/get-by-id/:id", "BudgetsController.getBudgetsById");
  Route.post("/get-paginated", "BudgetsController.getBudgetsPaginated");
  Route.post("/create", "BudgetsController.createBudgets");
  Route.put("/update/:id", "BudgetsController.updateBudgets");
  Route.get("/get-all", "BudgetsController.getAllBudgets");
}).prefix("/api/v1/budgets");
// .middleware("auth");

Route.group(() => {
  Route.get("/get-all", "EntitiesController.getEntities");
}).prefix("/api/v1/entities");
// .middleware("auth");

Route.group(() => {
  Route.post(
    "/get-paginated",
    "PosPreSapienciaController.getPosPreSapienciaPaginated"
  );
  Route.put("/update/:id", "PosPreSapienciaController.updatePosPreSapiencia");
  Route.get("/get-all", "PosPreSapienciaController.getAllPosPreSapiencia");
  Route.get(
    "/get-posprevinculation-by-id/:id",
    "PosPreSapienciaController.getPosPreSapienciaById"
  );
  Route.post(
    "/get-list-pospresap-vinculation-paginated",
    "PosPreSapienciaController.getListPosPreSapVinculationPaginated"
  );
  Route.post(
    "/create-pospresap-vinculation",
    "PosPreSapienciaController.createPosPreSapVinculation"
  );
  Route.post(
    "/update-pospresap-vinculation/:id",
    "PosPreSapienciaController.updatePosPreSapVinculation"
  );
}).prefix("/api/v1/pospre-sapiencia");
// .middleware("auth");

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
}).prefix("/api/v1/vinculation-mga");
// .middleware("auth");

Route.group(() => {
  Route.get("/get-by-id/:id", "FunctionalAreaController.getFunctionalAreaById");
  Route.post(
    "/get-paginated",
    "FunctionalAreaController.getFunctionalAreaPaginated"
  );
  Route.post("/create", "FunctionalAreaController.createFunctionalArea");
  Route.put("/update/:id", "FunctionalAreaController.updateFunctionalArea");
  Route.get("/get-all", "FunctionalAreaController.getAllFunctionalAreas");
  Route.post(
    "/link/create",
    "FunctionalAreaController.createProjectFunctionalArea"
  );
  Route.post(
    "/link/update",
    "FunctionalAreaController.updateProjectFunctionalArea"
  );
  Route.delete(
    "/link/delete/:id",
    "FunctionalAreaController.deleteProjectFunctionalArea"
  );
  Route.post(
    "/link/get-paginated",
    "FunctionalAreaController.getProjectFunctionalAreaPaginated"
  );
}).prefix("/api/v1/functional-area");
// .middleware("auth");

Route.group(() => {
  Route.post("/get-paginated", "ProjectsController.getProjectsPaginated");
  Route.get("/get-all", "ProjectsController.getAllProjects");
  Route.post(
    "/get-unrelated-projects",
    "ProjectsController.getUnrelatedProjects"
  );
}).prefix("/api/v1/projects");
// .middleware("auth");

Route.group(() => {
  Route.get(
    "/get-by-id/:id",
    "ManagementCenterController.getManagementCenterById"
  );
  Route.post(
    "/get-paginated",
    "ManagementCenterController.getManagementCenterPaginated"
  );
}).prefix("/api/v1/management-center");
// .middleware("auth");

Route.group(() => {
  Route.get("/get-all", "TypesTransfersController.getTypeTransfers");
}).prefix("/api/v1/type-transfers");
// .middleware("auth");

Route.group(() => {
  Route.get("/get-by-id/:id", "BudgetsRoutesController.getBudgetsRoutesById");
  Route.post(
    "/get-paginated",
    "BudgetsRoutesController.getBudgetsRoutesPaginated"
  );
  Route.get(
    "/get-data",
    "BudgetsRoutesController.getBudgetsRoutesWithoutPagination"
  );
  Route.post("/create", "BudgetsRoutesController.createBudgetsRoutes");
  Route.put("/update/:id", "BudgetsRoutesController.updateBudgetsRoutes");
}).prefix("/api/v1/budget-routes");
// .middleware("auth");

Route.group(() => {
  Route.post("/get-paginated", "AdditionsController.getAdditionsPaginated");
  Route.post("/get-funds", "AdditionsController.getFundsList");
  Route.post("/get-pospre", "AdditionsController.getPosPreList");
  Route.post(
    "/get-pospre-sapiencia",
    "AdditionsController.getPosPreSapienciaList"
  );
  Route.post("/save-data", "AdditionsController.executeCreateAdditions"); //Como acción de guardado
  Route.post("/create", "AdditionsController.createAdditions"); //Como acción validación
  Route.get(
    "/get-actadmin-district",
    "AdditionsController.getAllAdditionsByDistrict"
  );
  Route.get(
    "/get-actadmin-sapiencia",
    "AdditionsController.getAllAdditionsBySapiencia"
  );
  Route.get("/get-by-id/:id", "AdditionsController.getAdditionById");
  Route.post("/update/:id", "AdditionsController.updateAdditionWithMov"); //Como acción de validación
  Route.post(
    "/update-save/:id",
    "AdditionsController.executeUpdateAdditionWithMov"
  ); //Como acción de guardado/actualizado
  Route.post("/get-info-filter", "AdditionsController.budgetCdp"); //Como acción de guardado/actualizado
  ("AdditionsController.executeUpdateAdditionWithMov");
}).prefix("/api/v1/additions");

Route.group(() => {
  Route.post("/get-paginated", "TransfersController.getTransfersPaginated");
  Route.post("/get-funds", "TransfersController.getFundsList");
  Route.post("/get-pospre", "TransfersController.getPosPreList");
  Route.post(
    "/get-pospre-sapiencia",
    "TransfersController.getPosPreSapienciaList"
  );
  Route.post("/save-data", "TransfersController.executeCreateTransfers"); //Como acción de guardado
  Route.post("/create", "TransfersController.createTransfers"); //Como acción validación
  Route.get(
    "/get-actadmin-district",
    "TransfersController.getAllTransfersByDistrict"
  );
  Route.get(
    "/get-actadmin-sapiencia",
    "TransfersController.getAllTransfersBySapiencia"
  );
  Route.get("/get-by-id/:id", "TransfersController.getTransferById");
  Route.post("/update/:id", "TransfersController.updateTransferWithMov"); //Como acción de validación
  Route.post(
    "/update-save/:id",
    "TransfersController.executeUpdateTransferWithMov"
  ); //Como acción de guardado/actualizado
}).prefix("/api/v1/transfers");
// .middleware("auth");

Route.group(() => {
  Route.get(
    "/get-by-id/:id",
    "FunctionalProjectsController.getFunctionalProjectById"
  );
  Route.post(
    "/get-paginated",
    "FunctionalProjectsController.getFunctionalProjectPaginated"
  );
  Route.post("/create", "FunctionalProjectsController.createFunctionalProject");
  Route.post(
    "/update-save/:id",
    "FunctionalProjectsController.updateFunctionalProject"
  );
}).prefix("/api/v1/projectOperation");

Route.group(() => {
  Route.post("/upload-pac", "PacsController.uploadPac");
  Route.post("/review-budgetroute", "PacsController.reviewBudgetsRoute");
  Route.post("/transfers-pac", "PacsController.transfersOnPac");
  Route.post("/validity-list", "PacsController.validityList");
  Route.post("/resources-type-list", "PacsController.resourcesTypeList");
  Route.post("/lists-dinamics-routes", "PacsController.listDinamicsRoutes");
  Route.post(
    "/search-annualdata-routes",
    "PacsController.searchAnnualDataRoutes"
  );
  Route.post("/get-ultimate-version", "PacsController.getUltimateVersion");
  Route.post("/search-pacs", "PacsController.searchPacs");
  Route.post("/get-routes-by-validity", "PacsController.getRoutesByValidity");
  Route.post(
    "/lists-dinamics-association",
    "PacsController.listDinamicsAssociations"
  );
  Route.post("/create-association", "PacsController.createAssociations");
  Route.post("/edit-pac", "PacsController.editPac");
  Route.get("/get-pac-by-id/:id", "PacsController.getPacById");
  Route.post("/get-view-pac", "PacsController.viewPacComplete");
}).prefix("/api/v1/pac");

Route.group(() => {
  Route.post(
    "/search-cdps",
    "BudgetAvailabilityController.searchBudgetAvailability"
  );
  Route.post(
    "/create-cdp",
    "BudgetAvailabilityController.createCdpsCertificationBudgetAvailability"
  );
  Route.post(
    "/asociate-amounts",
    "BudgetAvailabilityController.associateAmountsWithCdp"
  );
  Route.post(
    "/edit-cdp/:id",
    "BudgetAvailabilityController.editBudgetAvailabilityBasicDataCDP"
  );
  Route.get(
    "/get-by-id/:id",
    "BudgetAvailabilityController.getBudgetAvailabilityById"
  );
  Route.post("/cancel-amount/", "BudgetAvailabilityController.cancelAmountCdp");
  Route.post("/link-mga/", "BudgetAvailabilityController.linkMga");
  Route.get(
    "/get-routeCDP-id/:id",
    "BudgetAvailabilityController.getRouteCDPId"
  );
  Route.put(
    "/updateRouteCDP/:id",
    "BudgetAvailabilityController.updateRoutesCDP"
  );
  Route.get("/get-CDPRp-id/:id", "BudgetAvailabilityController.getRpCDP");
}).prefix("/api/v1/cdp");

Route.group(() => {
  Route.post("/create-rp", "BudgetRecordsController.createRp");
  Route.post(
    "/update-data-basic-rp",
    "BudgetRecordsController.updateDataBasicRp"
  );
  Route.get("/get-components", "BudgetRecordsController.getComponents");
  Route.post("/get-rp-by-filters", "BudgetRecordsController.getRpByFilters");
  Route.get(
    "/get-totalvaluesimports/:id",
    "BudgetRecordsController.getTotalValuesImports"
  );
  Route.post("/update-data/:id", "BudgetRecordsController.updateRp");
}).prefix("/api/v1/budget-records");

Route.group(() => {
  Route.post(
    "/get-creditors-by-filters",
    "CreditorsController.getCreditorsByFilters"
  );
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
