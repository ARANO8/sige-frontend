import { api } from './api';

export interface Categoria {
  id: string; nombre: string; descripcion?: string; estado: string;
}

export interface UnidadMedida {
  id: string; nombre: string; abreviatura?: string; estado: string;
}

export interface MateriaPrima {
  id: string; codigo: string; nombre: string; descripcion?: string;
  idCategoria?: string; idUnidadMedida?: string;
  costoUnitario: number; stockMinimo: number;
  categoria?: Categoria; unidadMedida?: UnidadMedida;
  lotes?: Lote[]; stocks?: Stock[];
}

export interface Lote {
  id: string; numeroLote: string; idMateriaPrima: string;
  fechaVencimiento?: string; cantidadInicial: number; cantidadActual: number;
  materiaPrima?: MateriaPrima;
}

export interface Producto {
  id: string; codigo: string; nombre: string; descripcion?: string;
  idCategoria?: string; idUnidadMedida?: string;
  precioVenta: number; costoEstandar: number; stockMinimo: number;
  categoria?: Categoria; unidadMedida?: UnidadMedida;
  stocks?: Stock[];
}

export interface Almacen {
  id: string; nombre: string; ubicacion?: string;
  _count?: { stocks: number }; stocks?: Stock[];
}

export interface Stock {
  id: string; idAlmacen: string; idProducto?: string; idMateriaPrima?: string;
  cantidad: number; almacen?: Almacen;
  producto?: Pick<Producto, 'id' | 'nombre' | 'codigo'>;
  materiaPrima?: Pick<MateriaPrima, 'id' | 'nombre' | 'codigo'>;
}

export interface Movimiento {
  id: string; tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  cantidad: number; fecha: string; referencia?: string;
  producto?: Pick<Producto, 'id' | 'nombre' | 'codigo'>;
  materiaPrima?: Pick<MateriaPrima, 'id' | 'nombre' | 'codigo'>;
  almacen?: Pick<Almacen, 'id' | 'nombre'>;
}

export const inventariosApi = {
  categorias: {
    list: () => api.get<Categoria[]>('/categoria'),
    create: (d: Partial<Categoria>) => api.post<Categoria>('/categoria', d),
  },
  unidadesMedida: {
    list: () => api.get<UnidadMedida[]>('/unidad-medida'),
    create: (d: Partial<UnidadMedida>) => api.post<UnidadMedida>('/unidad-medida', d),
  },
  materiasPrimas: {
    list: () => api.get<MateriaPrima[]>('/materia-prima'),
    create: (d: Partial<MateriaPrima>) => api.post<MateriaPrima>('/materia-prima', d),
    update: (id: string, d: Partial<MateriaPrima>) => api.patch<MateriaPrima>(`/materia-prima/${id}`, d),
    remove: (id: string) => api.delete(`/materia-prima/${id}`),
  },
  productos: {
    list: () => api.get<Producto[]>('/producto'),
    create: (d: Partial<Producto>) => api.post<Producto>('/producto', d),
    update: (id: string, d: Partial<Producto>) => api.patch<Producto>(`/producto/${id}`, d),
    remove: (id: string) => api.delete(`/producto/${id}`),
  },
  almacenes: {
    list: () => api.get<Almacen[]>('/almacen'),
    create: (d: Partial<Almacen>) => api.post<Almacen>('/almacen', d),
    update: (id: string, d: Partial<Almacen>) => api.patch<Almacen>(`/almacen/${id}`, d),
    remove: (id: string) => api.delete(`/almacen/${id}`),
  },
  movimientos: {
    list: (page = 1) => api.get<{ data: Movimiento[]; total: number }>(`/movimiento-inventario?page=${page}&limit=50`),
    create: (d: Partial<Movimiento> & { idAlmacen: string; cantidad: number }) => api.post<Movimiento>('/movimiento-inventario', d),
  },
};
