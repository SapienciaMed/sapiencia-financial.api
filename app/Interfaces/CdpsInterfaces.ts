import { DateTime } from 'luxon';


export interface ICreateCdp {
    date: DateTime;
    contractObject: string;
    consecutive: number;
    sapConsecutive: number;
    icdArr: {
      idRppCode: number;
      cdpPosition: number;
      amount: number;
    }[];
    type: number;
  }