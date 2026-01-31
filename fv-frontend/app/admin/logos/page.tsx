"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { brandLogoService } from "@/services/api"
import { IMAGE_BASE_URL } from "@/config/constants"
import { FaTrash, FaToggleOn, FaToggleOff, FaUpload } from "react-icons/fa"
import { toast } from "react-toastify"

interface BrandLogo {
  id: number
  name?: string | null
  image_path: string
  sort_order: number
  active: boolean
}

const toImageUrl = (path: string) => {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

const AdminLogos = () => {
  const [logos, setLogos] = useState<BrandLogo[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [file, setFile] = useState<File | null>(null)

  const fetchLogos = async () => {
    try {
      setLoading(true)
      const response = await brandLogoService.getAll(false)
      const data = response.data.data || response.data || []
      setLogos(data)
    } catch (error) {
      console.error("Error fetching logos:", error)
      toast.error("No se pudieron cargar los logos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogos()
  }, [])

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append("image", file)
    formData.append("name", name)
    formData.append("sort_order", String(sortOrder))
    try {
      await brandLogoService.create(formData)
      toast.success("Logo subido")
      setName("")
      setSortOrder(0)
      setFile(null)
      fetchLogos()
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast.error("No se pudo subir el logo")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este logo?")) return
    try {
      await brandLogoService.delete(id)
      toast.success("Logo eliminado")
      fetchLogos()
    } catch (error) {
      console.error("Error deleting logo:", error)
      toast.error("No se pudo eliminar")
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await brandLogoService.toggleActive(id)
      fetchLogos()
    } catch (error) {
      console.error("Error toggling logo:", error)
      toast.error("No se pudo actualizar")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent mb-8">
          Logos de Marcas
        </h1>

        <div className="relative z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre (opcional)"
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="Orden"
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
            <button
              onClick={handleUpload}
              className="relative z-20 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold pointer-events-auto"
            >
              <FaUpload /> Subir
            </button>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-gray-500">Cargando...</div>
          ) : logos.length === 0 ? (
            <div className="p-8 text-gray-500">No hay logos cargados.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              {logos.map((logo) => (
                <motion.div
                  key={logo.id}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow"
                >
                  <img
                    src={toImageUrl(logo.image_path)}
                    alt={logo.name || "logo"}
                    className="w-full h-24 object-contain"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{logo.name || "Sin nombre"}</span>
                    <span>#{logo.sort_order}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => handleToggle(logo.id)}
                      className="text-sm text-primary"
                    >
                      {logo.active ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button
                      onClick={() => handleDelete(logo.id)}
                      className="text-sm text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminLogos
