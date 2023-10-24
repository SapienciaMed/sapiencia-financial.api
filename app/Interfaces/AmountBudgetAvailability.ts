
export interface IAmountBudgetAvailability{
    id?: number;
    exercise: string;
    cdpCode: number;
    idRppCode: number;
    cdpPosition: number;
    amount: number;
    rpAssocs?: string;
    isActive: boolean;
    reasonCancellation: string;

}