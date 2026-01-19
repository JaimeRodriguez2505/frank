# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FV Auto Importaciones is a full-stack web application for an automotive import business. The project consists of:
- **Backend API** (`api_fvimport/`): Laravel 12 REST API with Sanctum authentication
- **Frontend** (`fv-frontend/`): Next.js 15 App Router application with TypeScript

## Docker Production Deployment

**Quick Start:**
```bash
# One-command deployment
./deploy.sh

# Or manual deployment
docker-compose build
docker-compose up -d
```

**Ports:**
- Frontend: `4245`
- Backend API: `4246`
- MySQL: `3309` (exposed for debugging)

**Container Management:**
```bash
docker-compose ps              # Check status
docker-compose logs -f         # View logs
docker-compose down            # Stop all containers
docker-compose restart         # Restart services
```

**See `README-DOCKER.md` for complete deployment guide.**

---

## Development Commands

### Backend (Laravel API)

**Location:** `api_fvimport/`

```bash
# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database operations
php artisan migrate              # Run migrations
php artisan migrate:fresh        # Fresh migration (drops all tables)
php artisan db:seed              # Seed database

# Development server
php artisan serve                # Starts on http://localhost:8000

# Storage link (required for image uploads)
php artisan storage:link

# Testing
php artisan test                 # Run all tests (Pest)
vendor/bin/pest                  # Run Pest tests directly

# Code quality
vendor/bin/pint                  # Laravel Pint (code formatter)

# Development with all services
composer dev                     # Runs server, queue, logs, and Vite concurrently
```

### Frontend (Next.js)

**Location:** `fv-frontend/`

```bash
# Install dependencies
npm install

# Development
npm run dev                      # Starts on http://localhost:3000

# Production build
npm run build                    # Build for production
npm start                        # Start production server

# Code quality
npm run lint                     # ESLint
npm run type-check               # TypeScript type checking
```

## Architecture

### Backend (Laravel)

**Authentication:**
- Laravel Sanctum for token-based API authentication
- Token stored in `localStorage` on frontend
- Admin routes protected with `auth:sanctum` middleware
- Custom middleware: `ForceJsonResponse` ensures all API responses are JSON

**Database Structure:**
- Uses MySQL in production (`DB_CONNECTION=mysql` in `.env`)
- Key models: `Product`, `Category`, `ImportRequest`, `Banner`, `Testimonial`, `Contact`, `Claim`, `User`
- **Important:** The project migrated from a subcategories structure to a single-level category system (see migrations `2025_12_20_*`)
- Products now directly reference `category_id` (not `subcategory_id`)

**Image Handling:**
- File uploads limited to 2MB by default (shared hosting compatible)
- Supported formats: JPG, PNG, WEBP, SVG
- Images stored in `storage/app/public/` and symlinked to `public/storage/`
- Auto-compression on frontend before upload (see `fv-frontend/services/api.ts`)
- Product images support multiple images via `ProductImage` model

**API Routes Structure:**
```
/api/login, /api/register          # Authentication (public)
/api/categories                     # Category CRUD
/api/products                       # Product CRUD
/api/products/featured              # Featured products
/api/banners                        # Banner management
/api/testimonials                   # Testimonial management
/api/claims                         # Public complaint submissions
/api/contacts                       # Contact form submissions
/api/import-requests                # Import request submissions
/api/featured-category              # Featured category configuration
```

**Controllers Location:** `app/Http/Controllers/Api/`

**Key Configuration:**
- Image validation in Request classes enforces 2MB limit (configurable for higher hosting limits)
- FormData updates use POST routes with `/update` suffix (e.g., `/products/{id}/update`) to avoid method spoofing issues

### Frontend (Next.js)

**Routing Architecture:**
- Uses Next.js 15 App Router (not Pages Router)
- Route groups:
  - `(public)/`: Public-facing pages (home, catalog, products)
  - `admin/`: Protected admin panel with `ProtectedRoute` wrapper
- All admin routes require authentication (checked via `useAuth` hook)

**Authentication Flow:**
1. User logs in via `/login` page
2. Backend returns JWT token + user data
3. Token stored in `localStorage`, attached to requests via axios interceptor
4. `ProtectedRoute` component checks auth status, redirects to `/login` if unauthorized
5. 401 responses automatically clear token and redirect to login

**State Management:**
- Local component state with React hooks
- `useAuth` hook for authentication state
- Theme context in `contexts/ThemeContext.tsx`
- No Redux/global state management (simple prop passing)

**API Service Layer:**
- Centralized in `services/api.ts`
- Axios instance with interceptors for auth tokens
- Automatic image compression before upload (handles 2MB PHP limit)
- Service objects: `productService`, `categoryService`, `bannerService`, etc.

**Styling:**
- Tailwind CSS for utility classes
- Styled Components for complex component styling
- Framer Motion for animations
- Theme toggle (light/dark mode) via `ThemeToggle` component

**Key Constants:**
- API URL configured in `config/constants.ts`:
  - `API_URL`: Backend API endpoint (default: `http://127.0.0.1:8000/api`)
  - `IMAGE_BASE_URL`: Base URL for images (default: `http://127.0.0.1:8000`)

**Admin Panel:**
- Sidebar navigation with collapse state (persisted in `localStorage`)
- Responsive mobile menu
- Pages: Products, Categories, Banners, Testimonials, Contacts, Claims, Import Requests, Featured Category

## Important Development Notes

**Image Upload Flow:**
1. Frontend compresses images >500KB before upload (`utils/imageCompression.ts`)
2. Images automatically resized to max 1920px width at 85% quality
3. FormData sent with `Content-Type: multipart/form-data`
4. Backend validates max 2MB per image (configurable in Request classes)
5. Images stored in `storage/app/public/` with public symlink

**Category System:**
- Previous architecture used subcategories (deprecated as of Dec 2025)
- Current architecture: single-level categories only
- Products link directly to `category_id`
- Featured category setting also uses `category_id`

**FormData Updates:**
- Laravel PUT/PATCH with FormData is problematic
- Solution: Use POST routes with `/update` suffix (e.g., `/products/{id}/update`)
- Applies to: products, banners, testimonials

**Testing:**
- Backend uses Pest (PHP testing framework)
- Test location: `api_fvimport/tests/`
- No frontend tests currently configured

**Deployment Notes:**
- Configured for shared hosting with 2MB upload limits
- See `api_fvimport/CONFIGURACION_HOSTING.md` for hosting configuration
- Must run `php artisan storage:link` after deployment
- Permissions: 755 for `storage/` and `bootstrap/cache/`

## Common Workflows

**Adding a new product field:**
1. Create migration in `api_fvimport/database/migrations/`
2. Update `Product` model in `app/Models/Product.php` (add to `$fillable`)
3. Update validation in `app/Http/Requests/ProductRequest.php`
4. Update `ProductController` if special handling needed
5. Update frontend form in `fv-frontend/app/admin/productos/page.tsx`
6. Update `productService` in `fv-frontend/services/api.ts` if needed

**Adding a new admin page:**
1. Create page in `fv-frontend/app/admin/[page-name]/page.tsx`
2. Add route to `AdminSidebar` in `fv-frontend/components/admin/AdminSidebar.tsx`
3. Ensure page uses `'use client'` directive if it uses hooks
4. Page automatically wrapped with `ProtectedRoute` via admin layout

**Debugging API issues:**
- Check Laravel logs: `api_fvimport/storage/logs/laravel.log`
- Use `php artisan pail` for real-time log streaming
- Verify `.env` configuration matches expected values
- Check browser console for API request/response details
- Verify Sanctum token is being sent in Authorization header
