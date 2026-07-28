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
  cargo: {
    list: () => api.get('/cargo'),
    create: (d: any) => api.post('/cargo', d),
  },
  empleado: {
    list: () => api.get('/empleado'),
    create: (d: any) => api.post('/empleado', d),
  },
  turno: {
    list: () => api.get('/turno'),
    create: (d: any) => api.post('/turno', d),
  },
  registroHoras: {
    list: (idEmpleado?: string) => api.get(`/registro-horas${idEmpleado ? `?idEmpleado=${idEmpleado}` : ''}`),
    create: (d: any) => api.post('/registro-horas', d),
  },
  reportes: {
    dashboard: () => api.get('/reportes/dashboard'),
    exportPdf: () => api.get('/reportes/exportar-pdf', { responseType: 'blob' }),
  },
  cuentasContables: {
    list: () => api.get('/cuenta-contable'),
    create: (d: any) => api.post('/cuenta-contable', d),
  },
  usuarios: {
    list: () => api.get('/usuario'),
    create: (d: any) => api.post('/usuario', d),
    remove: (id: string) => api.delete(`/usuario/${id}`),
  },
  rolesAdmin: {
    list: () => api.get('/rol'),
    create: (d: any) => api.post('/rol', d),
    remove: (id: string) => api.delete(`/rol/${id}`),
  },
  permisos: {
    list: () => api.get('/permiso'),
  },
  empresaAdmin: {
    get: () => api.get('/empresa'),
  },
};
