# SIGE ERP — Frontend

Aplicación web del Sistema ERP SaaS Multi-tenant para Manufactura.

**Tecnologías:** Next.js 16 · React 19 · Tailwind CSS v4 · Bun

---

## Requisitos

| Herramienta | Versión |
|-------------|---------|
| Bun         | 1.0+ |
| Node.js     | 20.19+ |

---

## Inicio rápido

```bash
# 1. Clonar y entrar al frontend
cd sige-frontend

# 2. Instalar dependencias
bun install

# 3. Iniciar servidor (puerto 3001)
$env:PORT = "3001"; bun run dev
```

**Importante:** El frontend usa el puerto **3001** por defecto para no conflictuar con el backend (puerto 3000).

La aplicación arranca en **http://localhost:3001**.

---

## Configuración

El frontend se conecta automáticamente al backend en `http://localhost:3000`.
Si el backend corre en otro puerto, configurar:

```bash
$env:NEXT_PUBLIC_API_URL = "http://localhost:3000"
```

---

## Rutas del sistema

| Ruta | Módulo | Descripción |
|------|--------|-------------|
| `/login` | Auth | Inicio de sesión multi-tenant |
| `/register` | Auth | Registro de nueva empresa |
| `/dashboard` | Reportes | Dashboard gerencial con KPIs y exportación PDF |
| `/inventarios` | Inventarios | Materias primas, productos, almacenes, movimientos |
| `/produccion` | Producción | Órdenes de producción y listas BOM |
| `/compras` | Compras | Órdenes de compra y proveedores |
| `/ventas` | Ventas | Ventas, clientes y facturación |
| `/contabilidad` | Contabilidad | Plan de cuentas y asientos contables |
| `/rrhh` | RRHH | Empleados, turnos y registro de horas |

---

## Credenciales de prueba

Iniciar sesión con cualquiera de estas cuentas (el backend debe estar corriendo):

| Empresa | Email | Contraseña |
|---------|-------|------------|
| CBN (Cervecería) | admin@cbn.com | cbn123 |
| Droguería INTI | admin@inti.com | inti123 |
| Empakar Express | admin@empakar.com | empakar123 |

---

## Scripts

```bash
bun run dev       # Servidor desarrollo (hot-reload)
bun run build     # Build producción
bun run start     # Servidor producción
bun run lint      # ESLint
```

---

## Estructura

```
sige-frontend/
├── app/
│   ├── (auth)/          # Login y registro (layout público)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # Módulos del sistema (layout autenticado)
│   │   ├── dashboard/
│   │   ├── inventarios/
│   │   ├── produccion/
│   │   ├── compras/
│   │   ├── ventas/
│   │   ├── contabilidad/
│   │   └── rrhh/
│   ├── layout.tsx       # Layout raíz con provider de auth
│   ├── page.tsx         # Redirige a /login
│   └── globals.css      # Design system (Stitch tokens)
├── src/
│   ├── components/ui/   # Button, Input, Card, Sidebar
│   ├── contexts/        # AuthContext (JWT + cookies)
│   ├── lib/             # API client, helpers
│   ├── middleware.ts    # Protección de rutas
│   └── types/           # Tipos TypeScript
├── package.json
└── tsconfig.json
```
