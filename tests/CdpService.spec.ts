import test from "japa";
import CdpsService from "../app/Services/CdpsService";
import { CdpsRepositoryFake } from "./FakeClass/CdpsRepositoryFake";
import { ApiResponse } from "../app/Utils/ApiResponses";
import { EResponseCodes } from "../app/Constants/ResponseCodesEnum";
import { ICreateCdp } from "App/Interfaces/CdpsInterfaces";

const service = new CdpsService(new CdpsRepositoryFake());

test.group("CdpsService Tests", () => {
  test("CdpsService must have a method getAllCdps with a return", async (assert) => {
    const result = await service.getAllCdps();
    assert.isNotNull(result);
  });

  test("the method getAllCdps must return a ApiResponse", async (assert) => {
    const result = await service.getAllCdps();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getAllCdps must return a OK code ", async (assert) => {
    const result = await service.getAllCdps();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

  test("CdpsService must have a method createCdps with a return", async (assert) => {
    const cdpData = {
  "date": "2023-10-18",
  "contractObject": "Este es el objeto de prueba 120",
  "consecutive": 1,
  "sapConsecutive": 1,
  "icdArr": [
      {
  "idRppCode":85,
  "cdpPosition":1,
  "amount": 1291291
      },
      {
  "idRppCode":85,
  "cdpPosition":1,
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
  "idRppCode":85,
  "cdpPosition":1,
  "amount": 1291291
      },
      {
  "idRppCode":85,
  "cdpPosition":1,
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
  "idRppCode":85,
  "cdpPosition":1,
  "amount": 1291291
      },
      {
  "idRppCode":85,
  "cdpPosition":1,
  "amount": 2392932
      }
  ]
}
    const result = await service.createCdps(cdpData);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

});
