// Configuración para desarrollo local vs producción
export const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4246/api") 
  : (process.env.API_URL_INTERNAL || "http://fv-gateway/api")

export const IMAGE_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://127.0.0.1:4246") 
  : (process.env.IMAGE_BASE_URL_INTERNAL || "http://fv-gateway")
export const CATEGORIES = {
  REPUESTOS: "Repuestos",
  TUNNING: "Tunning",
  ACCESORIOS: "Accesorios",
  RACING: "Racing",
  POR_MARCA: "Por Marca",
  POR_SISTEMA: "Por Sistema",
}

//https://api.globivaldetalles.com/api
//http://localhost:3001/api
