import test from "japa";
import { BudgetRecordRepositoryFake } from "./FakeClass/BudgetRecordRepositoryFake";
import BudgetRecordService from "App/Services/BudgetRecordService";
import { StrategicDirectionServiceFake } from "./FakeClass/StrategicDirectionServiceFake";
import { IBudgetRecord, IBudgetRecordFilter } from "App/Interfaces/BudgetRecord";
import { ApiResponse } from "App/Utils/ApiResponses";

const service = new BudgetRecordService(new BudgetRecordRepositoryFake(), new StrategicDirectionServiceFake());

test.group("BudgetRecordService TEST for getAllActivityObjectContracts", () => {

    test("class service must have a method getAllActivityObjectContracts with a return", async (assert) => {
        const result = service.getAllActivityObjectContracts();
        assert.isNotNull(result);
    });

    test("the method getAllActivityObjectContracts must be a promise", async (assert) => {
        const result = service.getAllActivityObjectContracts();
        assert.typeOf(result, "Promise");
    });

    test("the method getAllActivityObjectContracts must return a ApiResponse", async (assert) => {
        const result = await service.getAllActivityObjectContracts();
        assert.instanceOf(result, ApiResponse);
    });

})

test.group("BudgetRecordService TEST for getComponents", () => {

    test("class service must have a method getComponents with a return", async (assert) => {
        const result = service.getComponents();
        assert.isNotNull(result);
    });

    test("the method getComponents must be a promise", async (assert) => {
        const result = service.getComponents();
        assert.typeOf(result, "Promise");
    });

    test("the method getComponents must return a ApiResponse", async (assert) => {
        const result = await service.getComponents();
        assert.instanceOf(result, ApiResponse);
    });

})

test.group("BudgetRecordService TEST for createCdps", () => {

    const budgetRecord: IBudgetRecord = {
        componentId: 1,
        contractualObject: '',
        dependencyId: 1,
        dateValidity: null,
        documentDate: '',
        contractorDocument: '',
        linksRp: [],
    }

    test("class service must have a method createCdps with a return", async (assert) => {
        const result = service.createCdps(budgetRecord);
        assert.isNotNull(result);
    });

    test("the method createCdps must be a promise", async (assert) => {
        const result = service.createCdps(budgetRecord);
        assert.typeOf(result, "Promise");
    });

    test("the method createCdps must return a ApiResponse", async (assert) => {
        const result = await service.createCdps(budgetRecord);
        assert.instanceOf(result, ApiResponse);
    });

})

test.group("BudgetRecordService TEST for createCdps", () => {

    const budgetRecord: IBudgetRecord = {
        componentId: 1,
        contractualObject: '',
        dependencyId: 1,
        dateValidity: null,
        documentDate: '',
        contractorDocument: '',
        linksRp: [],
    }

    test("class service must have a method createCdps with a return", async (assert) => {
        const result = service.createCdps(budgetRecord);
        assert.isNotNull(result);
    });

    test("the method createCdps must be a promise", async (assert) => {
        const result = service.createCdps(budgetRecord);
        assert.typeOf(result, "Promise");
    });

    test("the method createCdps must return a ApiResponse", async (assert) => {
        const result = await service.createCdps(budgetRecord);
        assert.instanceOf(result, ApiResponse);
    });
})

test.group("BudgetRecordService TEST for updateDataBasicRp", () => {

    const budgetRecord: IBudgetRecord = {
        componentId: 1,
        contractualObject: '',
        dependencyId: 1,
        dateValidity: null,
        documentDate: '',
        contractorDocument: '',
        linksRp: [],
    }

    test("class service must have a method updateDataBasicRp with a return", async (assert) => {
        const result = service.updateDataBasicRp(budgetRecord);
        assert.isNotNull(result);
    });

    test("the method updateDataBasicRp must be a promise", async (assert) => {
        const result = service.updateDataBasicRp(budgetRecord);
        assert.typeOf(result, "Promise");
    });

    test("the method updateDataBasicRp must return a ApiResponse", async (assert) => {
        const result = await service.updateDataBasicRp(budgetRecord);
        assert.instanceOf(result, ApiResponse);
    });

})

test.group("BudgetRecordService TEST for getRpByFilters", () => {

    const budgetRecordFilter: IBudgetRecordFilter = {
        taxAccreditedId: 1,
        consecutiveRpAurora: 1,
        consecutiveRpSap: 1,
    }

    test("class service must have a method getRpByFilters with a return", async (assert) => {
        const result = service.getRpByFilters(budgetRecordFilter);
        assert.isNotNull(result);
    });


    test("the method getRpByFilters must be a promise", async (assert) => {
        const result = service.getRpByFilters(budgetRecordFilter);
        assert.typeOf(result, "Promise");
    });

    test("the method getRpByFilters must return a ApiResponse", async (assert) => {
        const result = await service.getRpByFilters(budgetRecordFilter);
        assert.instanceOf(result, ApiResponse);
    });
})

