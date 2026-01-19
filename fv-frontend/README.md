# FV Auto Importaciones - Frontend Next.js

Este proyecto ha sido migrado de Vite + React a Next.js con App Router.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
fv-frontend/
├── app/                    # App Router de Next.js
│   ├── (public)/          # Rutas públicas (grupo de rutas)
│   │   ├── layout.tsx     # Layout público
│   │   ├── page.tsx       # Página principal (/)
│   │   ├── catalogo/      # /catalogo
│   │   ├── producto/      # /producto/[id]
│   │   └── ...
│   ├── admin/             # Rutas admin
│   │   ├── layout.tsx     # Layout admin con protección
│   │   ├── page.tsx       # Dashboard (/admin)
│   │   └── ...
│   ├── layout.tsx         # Layout raíz
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
├── contexts/             # Contextos (Theme, etc.)
├── hooks/                # Custom hooks
├── services/             # Servicios API
├── config/               # Configuración
└── public/               # Assets estáticos
```

## 🔧 Configuración

### Variables de Entorno

El proyecto usa la configuración de API definida en `config/constants.ts`:

```typescript
export const API_URL = "http://127.0.0.1:8000/api"
export const IMAGE_BASE_URL = "http://127.0.0.1:8000"
```

Para producción, actualiza estas URLs según corresponda.

## 📝 Cambios Principales de la Migración

1. **Rutas**: De React Router a Next.js App Router
   - `/` → `app/(public)/page.tsx`
   - `/catalogo` → `app/(public)/catalogo/page.tsx`
   - `/producto/:id` → `app/(public)/producto/[id]/page.tsx`
   - `/admin/*` → `app/admin/*/page.tsx`

2. **Navegación**: 
   - `Link` de `react-router-dom` → `Link` de `next/link`
   - `useNavigate` → `useRouter` de `next/navigation`
   - `useParams` → `useParams` de `next/navigation`
   - `NavLink` → `Link` con `usePathname` para estado activo

3. **Layouts**:
   - `PublicLayout` → `app/(public)/layout.tsx`
   - `AdminLayout` → `app/admin/layout.tsx`

4. **Componentes**:
   - Todos los componentes ahora usan `'use client'` cuando es necesario
   - Las importaciones usan alias `@/` para rutas absolutas

## 🎨 Estilos

El proyecto usa:
- **Tailwind CSS** para estilos utilitarios
- **Styled Components** para componentes estilizados
- **Framer Motion** para animaciones

## 🔐 Autenticación

Las rutas admin están protegidas con `ProtectedRoute` que verifica la autenticación usando el hook `useAuth`.

## 📦 Dependencias Principales

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Styled Components
- Framer Motion
- Axios
- React Toastify

## 🐛 Solución de Problemas

Si encuentras errores de importación:
1. Verifica que todas las rutas relativas (`../../`) se hayan actualizado a alias (`@/`)
2. Asegúrate de que los componentes que usan hooks de Next.js tengan `'use client'`
3. Verifica que las rutas de imágenes en `public/` sean correctas

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
