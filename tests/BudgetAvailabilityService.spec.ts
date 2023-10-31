import { IUpdateRoutesCDP } from './../app/Interfaces/BudgetAvailabilityInterfaces';
import test from "japa";
import { BudgetAvailabilityRepositoryFake } from "./FakeClass/BudgetAvailabilityRepositoryFake";
import BudgetAvailabilityService from "App/Services/BudgetAvailabilityService";
import { ApiResponse } from "../app/Utils/ApiResponses";
import { EResponseCodes } from "../app/Constants/ResponseCodesEnum";
import { IBudgetAvailabilityFilters } from "App/Interfaces/BudgetAvailabilityInterfaces";
import { DateTime } from "luxon";


const service = new BudgetAvailabilityService(
  new BudgetAvailabilityRepositoryFake()
);

test.group("CdpsService Tests", () => {
  /* test("CdpsService must have a method createCdps with a return", async (assert) => {
    const cdpData = {
      "date": "2023-10-18",
      "contractObject": "Este es el objeto de prueba 120",
      "consecutive": 1,
      "sapConsecutive": 1,
      "icdArr": [
        {
          "idRppCode": 85,
          "cdpPosition": 1,
          "amount": 1291291
        },
        {
          "idRppCode": 85,
          "cdpPosition": 1,
          "amount": 2392932
        }
      ]
    }
    const result = await service.createCdps(cdpData);
    assert.isNotNull(result);
  });

  test("the method createCdps must return a ApiResponse", async (assert) => {
    const cdpData = {
      "date": "2023-10-18",
      "contractObject": "Este es el objeto de prueba 120",
      "consecutive": 1,
      "sapConsecutive": 1,
      "icdArr": [
        {
          "idRppCode": 85,
          "cdpPosition": 1,
          "amount": 1291291
        },
        {
          "idRppCode": 85,
          "cdpPosition": 1,
          "amount": 2392932
        }
      ]
    }
    const result = await service.createCdps(cdpData);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createCdps must return a OK code", async (assert) => {
    const cdpData = {
      "date": "2023-10-18",
      "contractObject": "Este es el objeto de prueba 120",
      "consecutive": 1,
      "sapConsecutive": 1,
      "icdArr": [
        {
          "idRppCode": 85,
          "cdpPosition": 1,
          "amount": 1291291
        },
        {
          "idRppCode": 85,
          "cdpPosition": 1,
          "amount": 2392932
        }
      ]
    }
    const result = await service.createCdps(cdpData);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
 */

  test("Returns an object with meta and array properties", async (assert) => {
    const initialDate = DateTime.fromISO("2022-01-01");
    const endDate = DateTime.fromISO("2022-12-31");
    const filter: IBudgetAvailabilityFilters = {
      dateOfCdp: "2022",
      page: 1,
      perPage: 10,
      initialDate: initialDate,
      endDate: endDate,
      consecutiveSap: 12345,
      contractObject: "example",
    };
    const expectedItems = {
      meta: {},
      array: [],
    };

    // Act
    const result = await service.searchBudgetAvailability(filter);

    // Assert
    assert.containsAllDeepKeys(result.data, expectedItems);
  });

  test("Returns a list of budget availabilities filtered by the given parameters", async (assert) => {
    const initialDate = DateTime.fromISO("2022-01-01");
    const endDate = DateTime.fromISO("2022-12-31");
    const filter: IBudgetAvailabilityFilters = {
      dateOfCdp: "2022",
      page: 1,
      perPage: 10,
      initialDate: initialDate,
      endDate: endDate,
      consecutiveSap: 12345,
      contractObject: "example",
    };

    // Act
    const result = await service.searchBudgetAvailability(filter);

    // Assert
    assert.lengthOf(result.data.array, 1);
    assert.equal(result.data.meta.total, 1);
  });

  test("The method should successfully edit the basic data of a CDP when given valid input.", async (assert) => {
    const data = {
      id: 1,
      dateOfCdp: "2025-10-18T00:00:00.000-05:00",
      contractObject: "Este es el objeto vamos a actualizar Edit",
    };

    // Act
    const result = await service.editBudgetAvailabilityBasicDataCDP(1, data);

    assert.equal(result.data.date, data.dateOfCdp);
    assert.equal(result.data.contractObject, data.contractObject);
  });

  test("CdpsService must have a method getById with a return", async (assert) => {
    const result = await service.getById("1");
    assert.isNotNull(result);
  });

  test("the method getById must return a ApiResponse", async (assert) => {
    const result = await service.getById("1");
    assert.instanceOf(result, ApiResponse);
  });


  test("the method getById must return a OK code ", async (assert) => {
    const result = await service.getById("1");
    console.log({ result });
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

  test("The method should successfully edit route CDP when given valid input.", async (assert) => {
    const data: IUpdateRoutesCDP = {
      idRppCode: 85,
      cdpPosition: 1,
      amount: 12211.00,           
      modifiedIdcCountercredit: 1223,
      idcModifiedCredit: 1587,
      idcFixedCompleted: 15888,
      idcFinalValue: 15888   
    };   

    const result = await service.updateRoutesCDP(data, 1);

    assert.equal(result.data.idRppCode, data.idRppCode);
    assert.equal(result.data.cdpPosition, data.cdpPosition);
    assert.equal(result.data.amount, data.amount);
    assert.equal(result.data.modifiedIdcCountercredit, data.modifiedIdcCountercredit);
    assert.equal(result.data.idcModifiedCredit, data.idcModifiedCredit);
    assert.equal(result.data.idcFixedCompleted, data.idcFixedCompleted);
    assert.equal(result.data.idcFinalValue, data.idcFinalValue);
  });
});
