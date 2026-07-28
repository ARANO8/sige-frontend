import { api } from './api';

export const apiClient = {
  bom: {
    list: () => api.get('/bom'),
    create: (d: any) => api.post('/bom', d),
  },
  produccion: {
    list: () => api.get('/produccion'),
    create: (d: any) => api.post('/produccion', d),
    finalizar: (id: string) => api.patch(`/produccion/${id}/finalizar`, {}),
    cancelar: (id: string) => api.patch(`/produccion/${id}/cancelar`, {}),
  },
  proveedores: {
    list: () => api.get('/proveedor'),
    create: (d: any) => api.post('/proveedor', d),
    remove: (id: string) => api.delete(`/proveedor/${id}`),
  },
  ordenCompra: {
    list: () => api.get('/orden-compra'),
    create: (d: any) => api.post('/orden-compra', d),
    recibir: (id: string) => api.patch(`/orden-compra/${id}/recibir`, {}),
    aprobar: (id: string) => api.patch(`/orden-compra/${id}/aprobar`, {}),
  },
  clientes: {
    list: () => api.get('/cliente'),
    create: (d: any) => api.post('/cliente', d),
  },
  ventas: {
    list: () => api.get('/venta'),
    create: (d: any) => api.post('/venta', d),
  },
  asientos: {
    list: (page = 1) => api.get(`/asiento-contable?page=${page}&limit=50`),
    create: (d: any) => api.post('/asiento-contable', d),
  },
  reportes: {
    dashboard: () => api.get('/reportes/dashboard'),
  },
};
