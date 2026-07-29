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
    update: (id: string, d: any) => api.patch(`/proveedor/${id}`, d),
    remove: (id: string) => api.delete(`/proveedor/${id}`),
  },
  ordenCompra: {
    list: () => api.get('/orden-compra'),
    create: (d: any) => api.post('/orden-compra', d),
    recibir: (id: string) => api.patch(`/orden-compra/${id}/recibir`, {}),
    aprobar: (id: string) => api.patch(`/orden-compra/${id}/aprobar`, {}),
    cancelar: (id: string) => api.patch(`/orden-compra/${id}/cancelar`, {}),
  },
  clientes: {
    list: () => api.get('/cliente'),
    create: (d: any) => api.post('/cliente', d),
    update: (id: string, d: any) => api.patch(`/cliente/${id}`, d),
    remove: (id: string) => api.delete(`/cliente/${id}`),
  },
  ventas: {
    list: () => api.get('/venta'),
    create: (d: any) => api.post('/venta', d),
    anular: (id: string) => api.patch(`/venta/${id}/anular`, {}),
  },
  asientos: {
    list: (page = 1) => api.get(`/asiento-contable?page=${page}&limit=50`),
    create: (d: any) => api.post('/asiento-contable', d),
  },
  cargo: {
    list: () => api.get('/cargo'),
    create: (d: any) => api.post('/cargo', d),
    update: (id: string, d: any) => api.patch(`/cargo/${id}`, d),
  },
  empleado: {
    list: () => api.get('/empleado'),
    create: (d: any) => api.post('/empleado', d),
    update: (id: string, d: any) => api.patch(`/empleado/${id}`, d),
  },
  turno: {
    list: () => api.get('/turno'),
    create: (d: any) => api.post('/turno', d),
    update: (id: string, d: any) => api.patch(`/turno/${id}`, d),
  },
  registroHoras: {
    list: (idEmpleado?: string) => api.get(`/registro-horas${idEmpleado ? `?idEmpleado=${idEmpleado}` : ''}`),
    create: (d: any) => api.post('/registro-horas', d),
  },
  reportes: {
    dashboard: () => api.get('/reportes/dashboard'),
    exportPdf: () => api.get('/reportes/exportar-pdf', { responseType: 'blob' }),
    ventasMensuales: (meses = 6) => api.get(`/reportes/ventas-mensuales?meses=${meses}`),
    comprasMensuales: (meses = 6) => api.get(`/reportes/compras-mensuales?meses=${meses}`),
    produccionMensual: (meses = 6) => api.get(`/reportes/produccion-mensual?meses=${meses}`),
    topProductos: (limite = 5) => api.get(`/reportes/top-productos?limite=${limite}`),
    distribucionInventario: () => api.get('/reportes/distribucion-inventario'),
    kpiConfig: () => api.get('/reportes/kpi-config'),
    updateKpiConfig: (data: any) => api.put('/reportes/kpi-config', data),
  },
  cuentasContables: {
    list: () => api.get('/cuenta-contable'),
    create: (d: any) => api.post('/cuenta-contable', d),
  },
  usuarios: {
    list: () => api.get('/usuario'),
    create: (d: any) => api.post('/usuario', d),
    update: (id: string, d: any) => api.patch(`/usuario/${id}`, d),
    remove: (id: string) => api.delete(`/usuario/${id}`),
  },
  rolesAdmin: {
    list: () => api.get('/rol'),
    create: (d: any) => api.post('/rol', d),
    update: (id: string, d: any) => api.patch(`/rol/${id}`, d),
    remove: (id: string) => api.delete(`/rol/${id}`),
  },
  permisos: {
    list: () => api.get('/permiso'),
  },
  empresaAdmin: {
    get: () => api.get('/empresa'),
    update: (id: string, d: any) => api.patch(`/empresa/${id}`, d),
  },
};
