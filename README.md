# Ferretería Inventario

Sistema web para la gestión operativa de una ferretería con control de inventario, compras, ventas, clientes, proveedores, usuarios y panel de métricas.

## ✨ Descripción

Ferretería Inventario es una aplicación web desarrollada con **Next.js 15** y **React 19** que permite administrar la operación diaria de una ferretería PYME. El sistema centraliza la información de productos, proveedores, clientes, compras y ventas, además de ofrecer un dashboard con indicadores y recomendaciones basadas en los datos diarios.

## 🚀 Funcionalidades

- **Autenticación** con JWT y protección de rutas.
- **Dashboard** con métricas de ventas y compras del día, gráficos y recomendaciones.
- **Gestión de productos**.
- **Gestión de proveedores**.
- **Gestión de clientes**.
- **Gestión de ventas**.
- **Gestión de compras**.
- **Gestión de usuarios**.
- **UI moderna** con MUI, Emotion, Framer Motion, React Icons y Recharts.
- **Pruebas unitarias e integrales** con Jest y Testing Library.

## 🛠️ Tecnologías

- **Framework:** Next.js 15
- **UI:** React 19, MUI, Emotion, Framer Motion
- **Base de datos:** MongoDB via Mongoose
- **Autenticación:** JWT + bcryptjs
- **Pruebas:** Jest, Testing Library
- **Linter:** ESLint

## 📁 Estructura del proyecto

- `src/app/` — páginas, layouts y rutas API
- `src/lib/` — utilidades de autenticación y conexión a base de datos
- `src/models/` — modelos de MongoDB
- `src/app/screens/` — componentes de pantalla por módulo
- `src/__tests__/` — pruebas unitarias e integrales

## 🔧 Variables de entorno

Crea un archivo `.env.local` o ajusta tu configuración con las siguientes variables:

```env
DB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
```

> Si el proyecto ya incluye un archivo `.env`, usa ese mismo formato y reemplaza los valores según tu entorno.

## ▶️ Instalación

```bash
npm install
```

## 🏃 Ejecución

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🧪 Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
npm run test:watch
npm run test:coverage
```

## 🧪 Pruebas

Para ejecutar todas las pruebas:

```bash
npm test
```

Para generar el reporte de cobertura:

```bash
npm run test:coverage
```

## 📌 Requisitos

- Node.js 18 o superior
- MongoDB disponible
- Navegador moderno

## 📚 Notas

El proyecto está organizado en módulos para facilitar la extensión y el mantenimiento del sistema. Si quieres, puedo dejar también un archivo `CONTRIBUTING.md` o un `CHANGELOG.md` para estandarizar el flujo de trabajo del equipo.
