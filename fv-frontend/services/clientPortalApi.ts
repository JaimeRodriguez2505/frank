import axios from "axios"
import { API_URL } from "@/config/constants"

const clientPortalApi = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
})

clientPortalApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("client_portal_token")
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})

export const clientPortalService = {
  login: (codigo_cliente: string, pin: string) =>
    clientPortalApi.post("/client-portal/login", { codigo_cliente, pin }),
  me: () => clientPortalApi.get("/client-portal/me"),
  getRequests: () => clientPortalApi.get("/client-portal/requests"),
}

export default clientPortalApi
