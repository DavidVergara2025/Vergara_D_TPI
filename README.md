# Food Store — Sistema de Pedidos de Comida (Trabajo Práctico Integrador)

**Materia:** Programación 4 — Tecnicatura Universitaria en Programación a Distancia (UTN)  
**Alumno:** David Vergara  

## Enlaces de Entrega 

* **Repositorio público de GitHub:** `https://github.com/DavidVergara2025/Vergara_D_TPI` 
* **Video de demostración:** `https://drive.google.com/file/d/17NJc0SY6ziXXCLRLStOZu5ll7i-leabb/view?usp=sharing` 

---

## Descripción General

**Food Store** es una aplicación web full-stack para la gestión y compra de pedidos de comida:
* **Backend (`backend/`)**: API REST desarrollada con **FastAPI** y **SQLModel** sobre **PostgreSQL**, estructurada en capas por dominio (`Router` $\rightarrow$ `Service` $\rightarrow$ `UnitOfWork` $\rightarrow$ `Repository` $\rightarrow$ `Model` / `Schemas`), autenticación mediante **JWT en cookie `HttpOnly` (`access_token`)**, control de acceso basado en roles (**RBAC**: `user` y `admin`) y reglas de negocio transaccionales (`RN-01` a `RN-06`).
* **Frontend (`frontend/`)**: Single Page Application construida con **React 19**, **TypeScript (`strict: true`)**, **Vite**, **Tailwind CSS 4**, **TanStack Query v5** (estado del servidor), **TanStack Form** (validación de formularios), **TanStack Table v8** (tablas del panel de administración), **React Router 7** (`ProtectedRoute` con `<Outlet />`) y **Zustand 5** (`authStore` con `persist` + `partialize` y `cartStore` con `persist`).

---

## Requisitos Previos

* **Python:** `3.11` a `3.13`
* **PostgreSQL:** `15` o superior (también soporta SQLite cambiando `DATABASE_URL` en desarrollo local)
* **Node.js:** `20.19` o superior
* **pnpm:** `9` o superior (`npm install -g pnpm`)

---

## Variables de Entorno 

### 1. Backend (`backend/.env`)
Copiar el archivo `backend/.env.example` a `backend/.env` y ajustar las credenciales de PostgreSQL:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL (o SQLite) | `postgresql+psycopg://postgres:123456@localhost:5432/foodstore` |
| `SECRET_KEY` | Clave secreta para firmar JWT (mínimo 32 caracteres) | `cambiar-esta-clave-de-al-menos-32-caracteres-123456` |
| `ALGORITHM` | Algoritmo de firma JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token y la cookie en minutos | `30` |
| `FRONTEND_ORIGIN` | Origen permitido en CORS con credenciales | `http://localhost:5173` |

### 2. Frontend (`frontend/.env`)
Copiar el archivo `frontend/.env.example` a `frontend/.env`:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API REST del backend | `http://localhost:8000/api/v1` |

---

## Instalación y Ejecución Paso a Paso 

### Paso 1: Levantar el Backend (`http://localhost:8000`)

1. Abrir una terminal y entrar en la carpeta `backend/`:
   ```bash
   cd backend
   ```
2. Crear y activar el entorno virtual:
   ```bash
   # En Windows (PowerShell):
   python -m venv .venv
   .\.venv\Scripts\activate

   # En Linux / macOS:
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Instalar las dependencias con versiones fijadas:
   ```bash
   pip install -r requirements.txt
   ```
4. Crear el archivo `.env` a partir de `.env.example` (asegurándose de que la base de datos indicada en `DATABASE_URL` exista en PostgreSQL):
   ```bash
   # En Windows (PowerShell):
   Copy-Item .env.example .env

   # En Linux / macOS:
   cp .env.example .env
   ```
5. Ejecutar el script de inicialización (**seed idempotente**), que crea las tablas, el usuario administrador, 4 categorías y 10 productos con stock:
   ```bash
   python -m app.db.seed
   ```
6. Iniciar el servidor de desarrollo:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * **Swagger UI (`/docs`):** [http://localhost:8000/docs](http://localhost:8000/docs)
   * **ReDoc (`/redoc`):** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### Paso 2: Levantar el Frontend (`http://localhost:5173`)

1. Abrir otra terminal y entrar en la carpeta `frontend/`:
   ```bash
   cd frontend
   ```
2. Crear el archivo `.env` a partir de `.env.example`:
   ```bash
   # En Windows (PowerShell):
   Copy-Item .env.example .env

   # En Linux / macOS:
   cp .env.example .env
   ```
3. Instalar las dependencias con `pnpm`:
   ```bash
   pnpm install
   ```
4. *(Opcional)* Verificar la compilación y el chequeo estricto de tipos de TypeScript:
   ```bash
   pnpm build
   ```
5. Iniciar el servidor de desarrollo de Vite:
   ```bash
   pnpm dev
   ```
   * **Aplicación Web:** [http://localhost:5173](http://localhost:5173)

---

## Usuarios Creados por el Seed 

Al ejecutar `python -m app.db.seed` se crean de forma idempotente las siguientes cuentas listas para probar ambos roles:

| Rol | Username | Email | Contraseña | Permisos principales |
| :--- | :--- | :--- | :--- | :--- |
| **`admin`** | **`admin`** | `admin@foodstore.com` | **`Admin1234!`** | Acceso total al Panel de Administración (`/admin/resumen`, `/admin/pedidos`, `/admin/productos`, `/admin/categorias`, `/admin/usuarios`) y compra como usuario. |
| **`user`** | **`cliente`** | `cliente@foodstore.com` | **`Cliente123!`** | Navegar catálogo, armar carrito, confirmar pedidos en `/checkout`, consultar y cancelar sus propios pedidos en `PENDIENTE` desde `/mis-pedidos`. |

---

## Estructura del Proyecto

```text
Vergara_David_TPI/
├── backend/
│   ├── app/
│   │   ├── core/               # config, database, security, deps, unit_of_work, base_repository
│   │   ├── modules/            # Módulos de dominio bajo /api/v1
│   │   │   ├── auth/           # router, service, schemas (/auth/register, /token, /logout, /me)
│   │   │   ├── usuarios/       # models, schemas, repository, unit_of_work, service, router
│   │   │   ├── categorias/     # models, schemas, repository, unit_of_work, service, router
│   │   │   ├── productos/      # models, schemas, repository, unit_of_work, service, router
│   │   │   └── pedidos/        # models, schemas, repository, unit_of_work, service, router (RN-01 a RN-06)
│   │   ├── db/
│   │   │   └── seed.py         # Seed idempotente (admin / Admin1234!, categorías y productos)
│   │   └── main.py             # Punto de entrada FastAPI + CORS con credenciales
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── shared/             # api (axiosInstance, handleApiError, queryClient), ui, components, layout
│   │   ├── features/           # auth, categories, products, pedidos
│   │   ├── store/              # authStore (persist + partialize) y cartStore (persist)
│   │   ├── routes/             # AppRouter y ProtectedRoute (<Outlet />)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```