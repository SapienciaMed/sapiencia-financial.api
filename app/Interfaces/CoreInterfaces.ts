export interface IParameter {
    id: string;
    name: string;
    description?: string;
    value: string;
    aplicationId: number;
  }
  
  export interface IGenericList {
    id: number;
    grouper: string;
    itemCode: string;
    itemDescription: string;
    additionalFields?: object
  }
  
  export interface IAdditionalField {
    grouper: string;
    parentItemCode: string;
    fieldName?: string;
  }