import LinkRpcdp from 'App/Models/LinkRpcdp';

export interface IPago {
  id?: number;
  vinculacionRpCode: number;
  valorCausado: number;
  valorPagado: number;
  usuarioCreo: string;
  fechaCreo: string; // Ajusta el tipo de fecha según el formato real en tu modelo (puede ser DateTime)
  vinculacionRprIcd?: LinkRpcdp; // Ajusta según el modelo real de LinkRpcdp
}

export interface IPagoFilters {
  id?: number;
  vinculacionRpCode?: number;
  valorCausado?: number;
  valorPagado?: number;
  usuarioCreo?: string;
  fechaCreo?: string; // Ajusta el tipo de fecha según el formato real en tu modelo (puede ser DateTime)
  page: number;
  perPage: number;
}

export interface IPagingData<T> {
  array: T[];
  meta: {
    total: number;
    perPage: number;
    page: number;
    lastPage: number;
  };
}

