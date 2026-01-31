"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaFileImport,
  FaCar,
  FaGlobe,
  FaExclamationTriangle,
  FaImage,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa"
import { toast } from "react-toastify"
import { importRequestService, clientPortalAdminService } from "@/services/api"
import { IMAGE_BASE_URL } from "@/config/constants"

// Helper para normalizar URLs de imágenes
const getImageUrl = (path: string): string => {
  if (!path) return ""
  if (path.startsWith("http")) return path
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${IMAGE_BASE_URL}${cleanPath}`
}

interface ImportRequest {
  id: number
  nombre_pieza: string
  tipo_importacion: string
  email: string
  telefono: string
  mensaje: string
  marca_vehiculo: string
  modelo_vehiculo: string
  anio_vehiculo: string
  pais_origen: string
  nivel_urgencia: string
  imagenes: string[]
  estado: string
  codigo_cliente?: string | null
  progreso?: number
  etapa_logistica?: string | null
  ciudad_destino?: string | null
  eta_fecha?: string | null
  comentario_cliente?: string | null
  comentario_interno?: string | null
  created_at: string
}

const SolicitudesAdmin = () => {
  const [requests, setRequests] = useState<ImportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [showTrackedOnly, setShowTrackedOnly] = useState(false)
  const [sortTrackedFirst, setSortTrackedFirst] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [selectedRequest, setSelectedRequest] = useState<ImportRequest | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [trackingForm, setTrackingForm] = useState({
    codigo_cliente: "",
    progreso: 0,
    etapa_logistica: "",
    ciudad_destino: "",
    eta_fecha: "",
    comentario_cliente: "",
    comentario_interno: "",
  })
  const [eventForm, setEventForm] = useState({
    estado: "",
    progreso: 0,
    etapa_logistica: "",
    nota: "",
    visible_cliente: true,
  })
  const [pinForm, setPinForm] = useState("")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await importRequestService.getAll()
      const requestsData = response.data.data || response.data
      setRequests(requestsData)
    } catch (error) {
      console.error("Error al cargar solicitudes:", error)
      toast.error("No se pudieron cargar las solicitudes")
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.nombre_pieza.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.marca_vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.modelo_vehiculo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "todos" || request.estado === filterStatus

    const hasTracking = Boolean(
      request.codigo_cliente || request.progreso || request.etapa_logistica || request.ciudad_destino,
    )

    const matchesTracked = !showTrackedOnly || hasTracking

    return matchesSearch && matchesStatus && matchesTracked
  })

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortTrackedFirst) return 0
    const aTracked = Boolean(a.codigo_cliente || a.progreso || a.etapa_logistica || a.ciudad_destino)
    const bTracked = Boolean(b.codigo_cliente || b.progreso || b.etapa_logistica || b.ciudad_destino)
    if (aTracked === bTracked) return 0
    return aTracked ? -1 : 1
  })

  const totalPages = Math.max(1, Math.ceil(sortedRequests.length / itemsPerPage))
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus, showTrackedOnly])

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await importRequestService.updateStatus(id, newStatus)
      toast.success("Estado actualizado correctamente")
      fetchRequests()
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      toast.error("No se pudo actualizar el estado")
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) {
      try {
        await importRequestService.delete(id)
        toast.success("Solicitud eliminada correctamente")
        fetchRequests()
      } catch (error) {
        console.error("Error al eliminar solicitud:", error)
        toast.error("No se pudo eliminar la solicitud")
      }
    }
  }

  const handleViewDetails = (request: ImportRequest) => {
    setSelectedRequest(request)
    setCurrentImageIndex(0)
    setModalOpen(true)
    setTrackingForm({
      codigo_cliente: request.codigo_cliente || "",
      progreso: request.progreso ?? 0,
      etapa_logistica: request.etapa_logistica || "",
      ciudad_destino: request.ciudad_destino || "",
      eta_fecha: request.eta_fecha || "",
      comentario_cliente: request.comentario_cliente || "",
      comentario_interno: request.comentario_interno || "",
    })
    setEventForm({
      estado: request.estado || "",
      progreso: request.progreso ?? 0,
      etapa_logistica: request.etapa_logistica || "",
      nota: "",
      visible_cliente: true,
    })
    setPinForm("")
  }

  const handleUpdateTracking = async () => {
    if (!selectedRequest) return
    try {
      await importRequestService.updateTracking(selectedRequest.id, {
        codigo_cliente: trackingForm.codigo_cliente || null,
        progreso: Number(trackingForm.progreso) || 0,
        etapa_logistica: trackingForm.etapa_logistica || null,
        ciudad_destino: trackingForm.ciudad_destino || null,
        eta_fecha: trackingForm.eta_fecha || null,
        comentario_cliente: trackingForm.comentario_cliente || null,
        comentario_interno: trackingForm.comentario_interno || null,
      })
      toast.success("Tracking actualizado")
      fetchRequests()
    } catch (error) {
      console.error("Error updating tracking:", error)
      toast.error("No se pudo actualizar el tracking")
    }
  }

  const handleAddEvent = async () => {
    if (!selectedRequest) return
    try {
      await importRequestService.addEvent(selectedRequest.id, {
        estado: eventForm.estado || undefined,
        progreso: Number(eventForm.progreso) || 0,
        etapa_logistica: eventForm.etapa_logistica || null,
        nota: eventForm.nota || null,
        visible_cliente: eventForm.visible_cliente,
      })
      toast.success("Evento agregado")
      setEventForm((prev) => ({ ...prev, nota: "" }))
      fetchRequests()
    } catch (error) {
      console.error("Error adding event:", error)
      toast.error("No se pudo agregar el evento")
    }
  }

  const handleSetPin = async () => {
    if (!selectedRequest || !trackingForm.codigo_cliente || !pinForm) return
    try {
      await clientPortalAdminService.upsertPin(trackingForm.codigo_cliente, pinForm)
      toast.success("PIN actualizado para el cliente")
      setPinForm("")
    } catch (error) {
      console.error("Error setting PIN:", error)
      toast.error("No se pudo actualizar el PIN")
    }
  }

  const getUrgencyBadge = (urgencia: string) => {
    const styles = {
      baja: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      media: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      alta: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      urgente: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
    }
    return styles[urgencia as keyof typeof styles] || styles.media
  }

  const getStatusBadge = (estado: string) => {
    const styles = {
      pendiente: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      en_proceso: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      completado: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      cancelado: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
    }
    return styles[estado as keyof typeof styles] || styles.pendiente
  }

  const getStatusLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      completado: "Completado",
      cancelado: "Cancelado"
    }
    return labels[estado] || estado
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-fv-gold/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center text-white shadow-lg"
              >
                <FaFileImport className="text-2xl" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent">
                Solicitudes de Importación
              </h1>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg focus-within:ring-2 focus-within:ring-primary/50 transition-all w-full sm:w-auto"
            >
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por pieza, marca, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 w-full sm:w-64"
              />
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {['todos', 'pendiente', 'en_proceso', 'completado', 'cancelado'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {status === 'todos' ? 'Todos' : getStatusLabel(status)}
              </motion.button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showTrackedOnly}
                onChange={(e) => setShowTrackedOnly(e.target.checked)}
              />
              Solo con tracking
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={sortTrackedFirst}
                onChange={(e) => setSortTrackedFirst(e.target.checked)}
              />
              Priorizar con tracking
            </label>
            <span className="text-xs text-gray-500">
              Mostrando {sortedRequests.length} solicitudes
            </span>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="flex-1 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : sortedRequests.length === 0 ? (
            <div className="p-12 text-center">
              <FaFileImport className="text-6xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No hay solicitudes de importación disponibles
              </p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Pieza
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Vehículo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Urgencia
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.map((request, index) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.nombre_pieza}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {request.email}
                          </div>
                          {(request.codigo_cliente || request.progreso || request.etapa_logistica) && (
                            <div className="mt-2 inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                              Tracking activo
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {request.marca_vehiculo} {request.modelo_vehiculo}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {request.anio_vehiculo}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                            {request.tipo_importacion}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getUrgencyBadge(request.nivel_urgencia)}`}>
                            {request.nivel_urgencia}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={request.estado}
                            onChange={(e) => handleStatusChange(request.id, e.target.value)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border-none cursor-pointer capitalize ${getStatusBadge(request.estado)}`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en_proceso">En Proceso</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewDetails(request)}
                              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                              title="Ver detalles"
                            >
                              <FaEye />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(request.id)}
                              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal de detalles */}
      <AnimatePresence>
        {modalOpen && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary to-fv-gold p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Detalles de la Solicitud</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Información principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      Nombre de la Pieza
                    </h3>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedRequest.nombre_pieza}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      Tipo de Importación
                    </h3>
                    <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                      {selectedRequest.tipo_importacion}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      Email
                    </h3>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedRequest.email}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      Teléfono
                    </h3>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedRequest.telefono}
                    </p>
                  </div>
                </div>

                {/* Información del vehículo */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaCar /> Información del Vehículo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Marca</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRequest.marca_vehiculo}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Modelo</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRequest.modelo_vehiculo}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Año</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRequest.anio_vehiculo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detalles adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <FaGlobe /> País de Origen
                    </h3>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedRequest.pais_origen}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <FaExclamationTriangle /> Nivel de Urgencia
                    </h3>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize inline-block ${getUrgencyBadge(selectedRequest.nivel_urgencia)}`}>
                      {selectedRequest.nivel_urgencia}
                    </span>
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Mensaje
                  </h3>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    {selectedRequest.mensaje}
                  </p>
                </div>

                {/* Tracking del cliente */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Tracking para portal del cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Código cliente</label>
                      <input
                        value={trackingForm.codigo_cliente}
                        onChange={(e) => setTrackingForm({ ...trackingForm, codigo_cliente: e.target.value })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                        placeholder="FV-1234"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">PIN cliente</label>
                      <div className="mt-1 flex gap-2">
                        <input
                          value={pinForm}
                          onChange={(e) => setPinForm(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                          placeholder="4-8 dígitos"
                        />
                        <button
                          onClick={handleSetPin}
                          className="px-3 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-md"
                        >
                          Guardar PIN
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Progreso (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={trackingForm.progreso}
                        onChange={(e) => setTrackingForm({ ...trackingForm, progreso: Number(e.target.value) })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Etapa logística</label>
                      <input
                        value={trackingForm.etapa_logistica}
                        onChange={(e) => setTrackingForm({ ...trackingForm, etapa_logistica: e.target.value })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                        placeholder="En tránsito"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Ciudad destino</label>
                      <input
                        value={trackingForm.ciudad_destino}
                        onChange={(e) => setTrackingForm({ ...trackingForm, ciudad_destino: e.target.value })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                        placeholder="Lima"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">ETA (fecha)</label>
                      <input
                        type="date"
                        value={trackingForm.eta_fecha}
                        onChange={(e) => setTrackingForm({ ...trackingForm, eta_fecha: e.target.value })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Comentario cliente</label>
                      <input
                        value={trackingForm.comentario_cliente}
                        onChange={(e) => setTrackingForm({ ...trackingForm, comentario_cliente: e.target.value })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                        placeholder="Visible al cliente"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Comentario interno</label>
                    <textarea
                      value={trackingForm.comentario_interno}
                      onChange={(e) => setTrackingForm({ ...trackingForm, comentario_interno: e.target.value })}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      rows={2}
                      placeholder="Solo interno"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdateTracking}
                      className="px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-md hover:shadow-lg"
                    >
                      Guardar tracking
                    </button>
                  </div>
                </div>

                {/* Nuevo evento */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Agregar evento al timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Estado</label>
                      <select
                        value={eventForm.estado}
                        onChange={(e) => setEventForm({ ...eventForm, estado: e.target.value })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      >
                        <option value="">Sin cambio</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En proceso</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Progreso (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={eventForm.progreso}
                        onChange={(e) => setEventForm({ ...eventForm, progreso: Number(e.target.value) })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Etapa logística</label>
                      <input
                        value={eventForm.etapa_logistica}
                        onChange={(e) => setEventForm({ ...eventForm, etapa_logistica: e.target.value })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                        placeholder="En aduana"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Nota</label>
                    <textarea
                      value={eventForm.nota}
                      onChange={(e) => setEventForm({ ...eventForm, nota: e.target.value })}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      rows={2}
                      placeholder="Comentario para el cliente"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={eventForm.visible_cliente}
                      onChange={(e) => setEventForm({ ...eventForm, visible_cliente: e.target.checked })}
                    />
                    Visible para el cliente
                  </label>
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddEvent}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-md hover:shadow-lg"
                    >
                      Agregar evento
                    </button>
                  </div>
                </div>

                {/* Imágenes */}
                {selectedRequest.imagenes && selectedRequest.imagenes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                      <FaImage /> Imágenes ({selectedRequest.imagenes.length})
                    </h3>
                    <div className="relative">
                      {/* Main Image */}
                      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                        <img
                          src={getImageUrl(selectedRequest.imagenes[currentImageIndex])}
                          alt={`Imagen ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />

                        {/* Navigation Arrows */}
                        {selectedRequest.imagenes.length > 1 && (
                          <>
                            <button
                              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + selectedRequest.imagenes.length) % selectedRequest.imagenes.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                            >
                              <FaChevronLeft />
                            </button>
                            <button
                              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % selectedRequest.imagenes.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                            >
                              <FaChevronRight />
                            </button>
                          </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-lg">
                          {currentImageIndex + 1} / {selectedRequest.imagenes.length}
                        </div>
                      </div>

                      {/* Thumbnails */}
                      {selectedRequest.imagenes.length > 1 && (
                        <div className="grid grid-cols-5 gap-2 mt-4">
                          {selectedRequest.imagenes.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                index === currentImageIndex
                                  ? 'border-primary scale-105'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                              }`}
                            >
                              <img
                                src={getImageUrl(img)}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SolicitudesAdmin
