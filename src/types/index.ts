export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  idEmpresa: string;
  roles: { id: string; nombre: string }[];
  permisos: string[];
}

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}

export interface Empresa {
  id: string;
  nit: string;
  razonSocial: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  empresaNombre: string;
  nit: string;
  email: string;
  password: string;
  nombreAdmin: string;
  direccion?: string;
  telefono?: string;
}
