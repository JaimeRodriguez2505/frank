import axios from "axios"
import { API_URL } from "../config/constants"
import { compressImage } from "../utils/imageCompression"

// Crear instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para CORS y cookies
  headers: {
    "Accept": "application/json",
  },
})

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Mejorar el manejo de errores en el interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 (No autorizado) y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Aquí podrías implementar la lógica para renovar el token
      // Por ahora, simplemente redirigimos al login
      localStorage.removeItem("token")
      window.location.href = "/login"
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

/**
 * Procesa un FormData y comprime automáticamente las imágenes grandes
 * Esto resuelve el problema de límites de PHP (upload_max_filesize = 2MB)
 */
async function processFormDataWithCompression(formData: FormData): Promise<FormData> {
  const newFormData = new FormData();

  // Obtener todas las claves únicas
  const keys = Array.from(formData.keys());
  const uniqueKeys = [...new Set(keys)];

  for (const key of uniqueKeys) {
    // Obtener TODOS los valores para esta clave (importante para arrays de archivos)
    const values = formData.getAll(key);

    for (const value of values) {
      // Si es un archivo de imagen, comprimirlo
      if (value instanceof File && value.type.startsWith('image/')) {
        console.log(`📸 Compressing image field: ${key} (${value.name})`);
        const compressedFile = await compressImage(value);
        newFormData.append(key, compressedFile);
      } else {
        // Copiar otros campos sin cambios
        newFormData.append(key, value);
      }
    }
  }

  console.log(`✅ FormData processed: ${newFormData.getAll('images[]').length} additional images ready`);
  return newFormData;
}

// Tipos para los datos
interface CategoryData {
  name: string;
  description?: string;
}

interface ClaimData {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

// Servicios para categorías
export const categoryService = {
  getAll: () => api.get("/categories"),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: CategoryData) => api.post("/categories", data),
  update: (id: number, data: CategoryData) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
}

// Servicios para productos
export const productService = {
  getAll: () => api.get("/products"),
  getById: (id: number) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get("/products/featured"),
  create: async (data: FormData) => {
    // Comprimir imágenes automáticamente ANTES de enviar
    const processedData = await processFormDataWithCompression(data);

    // Mapear y convertir 'categoryId' del frontend a 'category_id' que espera el backend
    const categoryId = processedData.get("categoryId")
    if (categoryId && typeof categoryId === "string") {
      processedData.delete("categoryId")
      processedData.append("category_id", Number(categoryId).toString())
    }

    // Verificar si precio_de_oferta está vacío y eliminarlo si es así
    const precioOferta = processedData.get("precio_de_oferta")
    if (precioOferta === "") {
      processedData.delete("precio_de_oferta")
    }

    return api.post("/products", processedData)
  },
  update: async (id: number, data: FormData) => {
    // Comprimir imágenes automáticamente ANTES de enviar
    const processedData = await processFormDataWithCompression(data);

    // Mapear y convertir 'categoryId' del frontend a 'category_id' que espera el backend
    const categoryId = processedData.get("categoryId")
    if (categoryId && typeof categoryId === "string") {
      processedData.delete("categoryId")
      processedData.append("category_id", Number(categoryId).toString())
    }

    // Verificar si precio_de_oferta está vacío y eliminarlo si es así
    const precioOferta = processedData.get("precio_de_oferta")
    if (precioOferta === "") {
      processedData.delete("precio_de_oferta")
    }

    // Usar ruta POST especial para actualizaciones con FormData (evita problemas con method spoofing)
    return api.post(`/products/${id}/update`, processedData)
  },
  delete: (id: number) => api.delete(`/products/${id}`),
}

// Servicios para reclamaciones
export const claimService = {
  getAll: () => api.get("/claims"),
  create: (data: ClaimData) => api.post("/claims", data),
}

// Servicios para contactos
export const contactService = {
  getAll: () => api.get("/contacts"),
  getById: (id: number) => api.get(`/contacts/${id}`),
  markAsRead: (id: number) => api.put(`/contacts/${id}/read`),
  delete: (id: number) => api.delete(`/contacts/${id}`),
}

// Servicios para testimonios
export const testimonialService = {
  getAll: () => api.get("/testimonials"),
  getById: (id: number) => api.get(`/testimonials/${id}`),
  create: async (data: FormData) => {
    // Comprimir imágenes automáticamente ANTES de enviar
    const processedData = await processFormDataWithCompression(data);

    return api.post("/testimonials", processedData)
  },
  update: async (id: number, data: FormData) => {
    // Comprimir imágenes automáticamente ANTES de enviar
    const processedData = await processFormDataWithCompression(data);

    // Usar ruta POST especial para actualizaciones con FormData (evita problemas con method spoofing)
    return api.post(`/testimonials/${id}/update`, processedData)
  },
  delete: (id: number) => api.delete(`/testimonials/${id}`),
  toggleActive: (id: number) => api.put(`/testimonials/${id}/toggle-active`),
}

// Servicios para banners
export const bannerService = {
  getAll: () => api.get("/banners"),
  getById: (id: number) => api.get(`/banners/${id}`),
  create: async (data: FormData) => {
    // Comprimir imágenes automáticamente ANTES de enviar
    const processedData = await processFormDataWithCompression(data);

    return api.post("/banners", processedData)
  },
  update: async (id: number, data: FormData) => {
    // Comprimir imágenes automáticamente ANTES de enviar
    const processedData = await processFormDataWithCompression(data);

    // Usar ruta POST especial para actualizaciones con FormData (evita problemas con method spoofing)
    return api.post(`/banners/${id}/update`, processedData)
  },
  delete: (id: number) => api.delete(`/banners/${id}`),
  toggleActive: (id: number) => api.put(`/banners/${id}/toggle-active`),
}

// Servicios para solicitudes de importación
export const importRequestService = {
  getAll: () => api.get("/import-requests"),
  getById: (id: number) => api.get(`/import-requests/${id}`),
  create: async (data: FormData) => {
    // Comprimir imágenes automáticamente ANTES de enviar
    const processedData = await processFormDataWithCompression(data);

    return api.post("/import-requests", processedData)
  },
  updateStatus: (id: number, estado: string) =>
    api.put(`/import-requests/${id}/estado`, { estado }),
  delete: (id: number) => api.delete(`/import-requests/${id}`),
}

// Servicios para categoría destacada
export const featuredCategoryService = {
  get: () => api.get("/featured-category"),
  update: (categoryId: number | null) =>
    api.put("/featured-category", { category_id: categoryId }),
}

export default api
