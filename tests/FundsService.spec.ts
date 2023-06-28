import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import FundsService from "App/Services/FundsService";
import { FundsRepositoryFake } from "./FakeClass/FundsRepositoryFake";
import { ApiResponse } from "App/Utils/ApiResponses";

const service = new FundsService(new FundsRepositoryFake());

test.group("RolService TEST for getFundsById", () => {
  test("class service must have a method getFundsById with a return", async (assert) => {
    const result = service.getFundsById(1);
    assert.isNotNull(result);
  });

  test("the method getFundsById must be a promise", async (assert) => {
    const result = service.getFundsById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getFundsById must return a ApiResponse", async (assert) => {
    const result = await service.getFundsById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getFundsById must return a OK code ", async (assert) => {
    const result = await service.getFundsById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

  test("the method getFundsById must return a array", async (assert) => {
    const result = await service.getFundsById(1);

    assert.isArray(result.data);
  });
});
