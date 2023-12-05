
export interface IPago {
  id?: number;
  vinculacionRpCode: number;
  valorCausado: number;
  valorPagado: number;
  usuarioCreo: string;
  fechaCreo: Date ;  
  vinculacionRprIcdId?: number;  
  posicion?: number;
}


export interface IPagoMasive {
  id?: number;
  posicion: number;
  valorCausado: number;  
  valorPagado: number;  
  vinculacionRpCode: number;
}


export interface IPagoMasiveSave {
  id?: number;
  posicion?: number;
  valorCausado: number;  
  valorPagado: number;  
  vinculacionRpCode: number;  
  mes?: number;  
  ejercicio?: string;  
  usuarioCreo?: string;
  fechaCreo?: Date ;  
  
}


export interface IPagoFilters {
  vinculacionRpCode?: number;
  mes?: number;
  exercise?: string;
  page: number;
  perPage?: number; 
}



export interface IPagoResponse {
  PAG_MES: string;
  CONSECUTIVO_SAP: number;
  PAG_VALOR_CAUSADO: number;
  PAG_VALOR_PAGADO: number;
  VRP_POSICION: number;
  VRP_VALOR_FINAL: number;
  [key: string]: any;
}


export interface IPagingData<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    page: number;
    lastPage: number;
  } | null;
}

