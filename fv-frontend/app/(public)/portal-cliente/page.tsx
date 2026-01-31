"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { clientPortalService } from "@/services/clientPortalApi"
import { FaSignOutAlt, FaTruck, FaMapMarkerAlt, FaClock, FaCheckCircle } from "react-icons/fa"

interface PortalEvent {
  id: number
  estado?: string | null
  progreso?: number
  etapa_logistica?: string | null
  nota?: string | null
  ocurrido_en?: string | null
}

interface PortalRequest {
  id: number
  nombre_pieza: string
  tipo_importacion: string
  marca_vehiculo: string
  modelo_vehiculo: string
  anio_vehiculo: string
  estado: string
  progreso: number
  etapa_logistica?: string | null
  ciudad_destino?: string | null
  eta_fecha?: string | null
  comentario_cliente?: string | null
  created_at?: string
  updated_at?: string
  eventos?: PortalEvent[]
}

const statusLabel: Record<string, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  completado: "Completado",
  cancelado: "Cancelado",
}

const PortalCliente = () => {
  const [codigoCliente, setCodigoCliente] = useState("")
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requests, setRequests] = useState<PortalRequest[]>([])
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    setLoggedIn(Boolean(localStorage.getItem("client_portal_token")))
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await clientPortalService.getRequests()
      const data = response.data.data || response.data || []
      setRequests(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching client requests:", err)
      setError("No se pudieron cargar tus solicitudes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loggedIn) {
      fetchRequests()
    }
  }, [loggedIn])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      setLoading(true)
      const response = await clientPortalService.login(codigoCliente.trim(), pin.trim())
      const token = response.data.token
      localStorage.setItem("client_portal_token", token)
      setLoggedIn(true)
    } catch (err) {
      console.error("Login error:", err)
      setError("Código o PIN inválido")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("client_portal_token")
    setLoggedIn(false)
    setRequests([])
    setCodigoCliente("")
    setPin("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-secondary/70 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Portal del Cliente
          </h1>
          {loggedIn && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white shadow-md hover:shadow-lg"
            >
              <FaSignOutAlt /> Salir
            </button>
          )}
        </div>

        {!loggedIn ? (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800 max-w-lg">
            <h2 className="text-xl font-bold mb-6">Ingresa con tu código y PIN</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Código de cliente</label>
                <input
                  value={codigoCliente}
                  onChange={(e) => setCodigoCliente(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Ej: FV-1234"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">PIN</label>
                <input
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="4-8 dígitos"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="text-gray-500">Cargando solicitudes...</div>
            ) : requests.length === 0 ? (
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-600 dark:text-gray-300">No tienes solicitudes registradas aún.</p>
              </div>
            ) : (
              requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{req.nombre_pieza}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {req.marca_vehiculo} {req.modelo_vehiculo} ({req.anio_vehiculo})
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                      {statusLabel[req.estado] || req.estado}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Progreso</span>
                      <span>{req.progreso ?? 0}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${req.progreso ?? 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <FaTruck className="text-primary" />
                      {req.etapa_logistica || "Etapa no definida"}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" />
                      {req.ciudad_destino || "Destino pendiente"}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-primary" />
                      {req.eta_fecha ? `ETA ${req.eta_fecha}` : "ETA por confirmar"}
                    </div>
                  </div>

                  {req.comentario_cliente && (
                    <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
                      <strong>Comentario:</strong> {req.comentario_cliente}
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2">Timeline</h4>
                    {req.eventos && req.eventos.length > 0 ? (
                      <div className="space-y-3">
                        {req.eventos.map((ev) => (
                          <div key={ev.id} className="flex items-start gap-3">
                            <FaCheckCircle className="text-primary mt-1" />
                            <div>
                              <p className="text-sm font-medium">
                                {ev.etapa_logistica || statusLabel[ev.estado || ""] || "Actualización"}
                              </p>
                              {ev.nota && <p className="text-xs text-gray-500">{ev.nota}</p>}
                              {ev.ocurrido_en && (
                                <p className="text-xs text-gray-400">{new Date(ev.ocurrido_en).toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Aún no hay eventos registrados.</p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PortalCliente
