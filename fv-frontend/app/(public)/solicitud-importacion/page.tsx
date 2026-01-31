"use client"

import { useState } from "react"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaEnvelope,
  FaPhone,
  FaTag,
  FaCheckCircle,
  FaPaperPlane,
  FaCar,
  FaCalendar,
  FaGlobe,
  FaExclamationTriangle,
  FaTimes,
  FaCloudUploadAlt,
  FaWhatsapp,
  FaMoneyBillWave,
  FaClock,
  FaInfoCircle
} from "react-icons/fa"
import { toast } from "react-toastify"
import { importRequestService } from "@/services/api"
import { fadeInUp } from "@/config/animationVariants"

// Esquema de validación
const ImportRequestSchema = Yup.object().shape({
  nombre_pieza: Yup.string()
    .min(3, "Nombre demasiado corto")
    .max(255, "Nombre demasiado largo")
    .required("El nombre de la pieza es obligatorio"),
  tipo_importacion: Yup.string()
    .required("Selecciona el tipo de importación")
    .oneOf(['tuning', 'repuestos', 'racing'], "Tipo de importación inválido"),
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  telefono: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .min(9, "El número debe tener al menos 9 dígitos")
    .required("El teléfono es obligatorio"),
  mensaje: Yup.string()
    .min(10, "Mensaje demasiado corto")
    .max(1000, "Mensaje demasiado largo")
    .required("El mensaje es obligatorio"),
  marca_vehiculo: Yup.string()
    .min(2, "Marca demasiado corta")
    .max(100, "Marca demasiado larga")
    .required("La marca del vehículo es obligatoria"),
  modelo_vehiculo: Yup.string()
    .min(1, "Modelo demasiado corto")
    .max(100, "Modelo demasiado largo")
    .required("El modelo del vehículo es obligatorio"),
  anio_vehiculo: Yup.string()
    .matches(/^[0-9]{4}$/, "Debe ser un año válido (4 dígitos)")
    .required("El año del vehículo es obligatorio"),
  pais_origen: Yup.string()
    .min(2, "País demasiado corto")
    .max(100, "País demasiado largo")
    .required("El país de origen es obligatorio"),
  nivel_urgencia: Yup.string()
    .required("Selecciona el nivel de urgencia")
    .oneOf(['baja', 'media', 'alta', 'urgente'], "Nivel de urgencia inválido"),
})

// Componente FloatingLabelInput
interface FloatingLabelInputProps {
  label: string
  name: string
  type?: string
  icon?: React.ReactNode
  as?: string
  rows?: number
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  name,
  type = "text",
  icon,
  as,
  rows
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Field name={name}>
      {({ field, meta }: any) => {
        const hasValue = field.value && field.value.toString().trim().length > 0
        const hasError = meta.touched && meta.error

        return (
          <div className="relative">
            {as === "textarea" ? (
              <textarea
                {...field}
                rows={rows}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  setIsFocused(false)
                  field.onBlur(e)
                }}
                className={`w-full px-4 py-3 pt-6 border-2 rounded-xl bg-white dark:bg-gray-800 outline-none transition-all ${
                  hasError
                    ? "border-red-500"
                    : isFocused
                    ? "border-primary"
                    : "border-gray-300 dark:border-gray-700"
                } ${icon ? "pl-12" : ""}`}
              />
            ) : (
              <input
                {...field}
                type={type}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  setIsFocused(false)
                  field.onBlur(e)
                }}
                className={`w-full px-4 py-3 pt-6 border-2 rounded-xl bg-white dark:bg-gray-800 outline-none transition-all ${
                  hasError
                    ? "border-red-500"
                    : isFocused
                    ? "border-primary"
                    : "border-gray-300 dark:border-gray-700"
                } ${icon ? "pl-12" : ""}`}
              />
            )}

            {icon && (
              <motion.div
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                animate={{
                  color: isFocused ? "var(--primary)" : undefined
                }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}

            <motion.label
              className="absolute left-4 text-gray-500 pointer-events-none"
              animate={{
                y: isFocused || hasValue ? -8 : 12,
                x: icon && !(isFocused || hasValue) ? 32 : 0,
                scale: isFocused || hasValue ? 0.85 : 1,
                color: hasError ? "#ef4444" : isFocused ? "var(--primary)" : undefined
              }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: "left center" }}
            >
              {label}
            </motion.label>

            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: isFocused ? 1 : 0,
                scale: isFocused ? 1 : 1.05
              }}
              transition={{ duration: 0.2 }}
            />

            <ErrorMessage name={name}>
              {(msg) => (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 ml-1"
                >
                  {msg}
                </motion.p>
              )}
            </ErrorMessage>
          </div>
        )
      }}
    </Field>
  )
}

interface ImportRequestFormValues {
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
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const SolicitudImportacion = () => {
  const [enviando, setEnviando] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    if (files.length + selectedImages.length > 5) {
      toast.error("Máximo 5 imágenes permitidas")
      return
    }

    const newImages = [...selectedImages, ...files].slice(0, 5)
    setSelectedImages(newImages)

    // Crear previews
    const newPreviews: string[] = []
    newImages.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === newImages.length) {
          setImagePreviews(newPreviews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setSelectedImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (
    values: ImportRequestFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    setEnviando(true)
    try {
      const formData = new FormData()

      // Agregar todos los campos de texto
      Object.keys(values).forEach(key => {
        formData.append(key, values[key as keyof ImportRequestFormValues])
      })

      // Agregar imágenes
      selectedImages.forEach((image) => {
        formData.append('imagenes[]', image)
      })

      await importRequestService.create(formData)
      toast.success("¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.")
      setSubmitted(true)
      resetForm()
      setSelectedImages([])
      setImagePreviews([])

      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      toast.error("Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-secondary/70 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-fv-gold/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Speed streak accents */}
      <div className="pointer-events-none absolute inset-x-0 top-10 z-10 overflow-hidden">
        <div className="speed-streak top-0 left-0"></div>
        <div className="speed-streak streak-2 top-8 left-16"></div>
        <div className="speed-streak streak-3 top-16 left-32"></div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent mb-6">
            Solicitud de Importación
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            ¿Buscas una pieza específica? Completa el formulario y te ayudaremos a importarla.
          </p>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">¿Ya tienes una solicitud?</span>
            <Link
              href="/portal-cliente"
              className="px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-primary hover:shadow-md transition-all"
            >
              Ver seguimiento
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-800"
        >
          <Formik
            initialValues={{
              nombre_pieza: "",
              tipo_importacion: "",
              email: "",
              telefono: "",
              mensaje: "",
              marca_vehiculo: "",
              modelo_vehiculo: "",
              anio_vehiculo: "",
              pais_origen: "",
              nivel_urgencia: "",
            }}
            validationSchema={ImportRequestSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => {
              // Calcular porcentaje de completado
              const fields = Object.keys(values)
              const completed = fields.filter(field => values[field as keyof ImportRequestFormValues] && String(values[field as keyof ImportRequestFormValues]).trim()).length
              const imageCompletion = selectedImages.length > 0 ? 1 : 0
              const completionPercentage = ((completed + imageCompletion) / (fields.length + 1)) * 100

              return (
                <>
                  {/* Progress Bar */}
                  <motion.div
                    className="mb-8"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Progreso del formulario</span>
                      <span className="text-primary font-bold">{Math.round(completionPercentage)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] shadow-lg"
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: completionPercentage / 100,
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        style={{ transformOrigin: "left" }}
                        transition={{
                          scaleX: { duration: 0.3, ease: "easeOut" },
                          backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Success Message */}
                  <AnimatePresence>
                    {submitted && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 180, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-6 mb-6"
                      >
                        <div className="flex items-center gap-4">
                          <FaCheckCircle className="text-green-500 text-4xl" />
                          <div>
                            <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
                              ¡Solicitud enviada exitosamente!
                            </h3>
                            <p className="text-green-600 dark:text-green-300 text-sm">
                              Te responderemos a la brevedad
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Form className="space-y-6">
                    {/* Nombre de la pieza */}
                    <FloatingLabelInput
                      label="Nombre de la pieza"
                      name="nombre_pieza"
                      type="text"
                      icon={<FaTag />}
                    />

                    {/* Tipo de importación */}
                    <Field name="tipo_importacion">
                      {({ field, meta }: any) => (
                        <div className="relative">
                          <select
                            {...field}
                            className={`w-full px-4 py-3 pt-6 border-2 rounded-xl bg-white dark:bg-gray-800 outline-none transition-all appearance-none ${
                              meta.touched && meta.error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                            }`}
                          >
                            <option value=""></option>
                            <option value="tuning">Tuning</option>
                            <option value="repuestos">Repuestos</option>
                            <option value="racing">Racing</option>
                          </select>
                          <motion.label
                            className="absolute left-4 text-gray-500 pointer-events-none"
                            animate={{
                              y: field.value ? -8 : 12,
                              scale: field.value ? 0.85 : 1,
                              color: meta.touched && meta.error ? "#ef4444" : undefined
                            }}
                            transition={{ duration: 0.2 }}
                            style={{ transformOrigin: "left center" }}
                          >
                            Tipo de importación
                          </motion.label>
                          <ErrorMessage name="tipo_importacion">
                            {(msg) => <p className="text-red-500 text-sm mt-1 ml-1">{msg}</p>}
                          </ErrorMessage>
                        </div>
                      )}
                    </Field>

                    {/* Teléfono (Prioritario) */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaPhone className="text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Contacto Prioritario</span>
                      </div>
                      <FloatingLabelInput
                        label="Número de teléfono / WhatsApp"
                        name="telefono"
                        type="tel"
                        icon={<FaWhatsapp />}
                      />
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        Te contactaremos por WhatsApp para confirmar disponibilidad y precio
                      </p>
                    </div>

                    {/* Email */}
                    <FloatingLabelInput
                      label="Correo electrónico"
                      name="email"
                      type="email"
                      icon={<FaEnvelope />}
                    />

                    {/* Payment Information Box */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <FaMoneyBillWave className="text-primary text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Información de Pago
                        </h3>
                      </div>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-3">
                          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">
                            <strong>Adelanto del 50%</strong> una vez confirmado el repuesto
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <FaWhatsapp className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">
                            Recibirás un <strong>QR de Yape/Plin</strong> en tu WhatsApp y email
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <FaClock className="text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">
                            <strong>Tiempo estimado:</strong> 1-2 días desde Lima (según disponibilidad)
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <FaInfoCircle className="text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm">
                            Podrás hacer seguimiento de tu solicitud con tu email
                          </span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Marca, Modelo, Año */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FloatingLabelInput
                        label="Marca del vehículo"
                        name="marca_vehiculo"
                        type="text"
                        icon={<FaCar />}
                      />
                      <FloatingLabelInput
                        label="Modelo"
                        name="modelo_vehiculo"
                        type="text"
                      />
                      <FloatingLabelInput
                        label="Año"
                        name="anio_vehiculo"
                        type="text"
                        icon={<FaCalendar />}
                      />
                    </div>

                    {/* País de origen */}
                    <FloatingLabelInput
                      label="País de origen de la pieza"
                      name="pais_origen"
                      type="text"
                      icon={<FaGlobe />}
                    />

                    {/* Nivel de urgencia */}
                    <Field name="nivel_urgencia">
                      {({ field, meta }: any) => (
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <FaExclamationTriangle />
                          </div>
                          <select
                            {...field}
                            className={`w-full pl-12 pr-4 py-3 pt-6 border-2 rounded-xl bg-white dark:bg-gray-800 outline-none transition-all appearance-none ${
                              meta.touched && meta.error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                            }`}
                          >
                            <option value=""></option>
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                            <option value="urgente">Urgente</option>
                          </select>
                          <motion.label
                            className="absolute left-12 text-gray-500 pointer-events-none"
                            animate={{
                              y: field.value ? -8 : 12,
                              x: field.value ? -32 : 0,
                              scale: field.value ? 0.85 : 1,
                              color: meta.touched && meta.error ? "#ef4444" : undefined
                            }}
                            transition={{ duration: 0.2 }}
                            style={{ transformOrigin: "left center" }}
                          >
                            Nivel de urgencia
                          </motion.label>
                          <ErrorMessage name="nivel_urgencia">
                            {(msg) => <p className="text-red-500 text-sm mt-1 ml-1">{msg}</p>}
                          </ErrorMessage>
                        </div>
                      )}
                    </Field>

                    {/* Mensaje */}
                    <FloatingLabelInput
                      label="Detalles adicionales"
                      name="mensaje"
                      as="textarea"
                      rows={4}
                    />

                    {/* Imágenes */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Imágenes (Opcional - Máximo 5)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                          disabled={selectedImages.length >= 5}
                        />
                        <label
                          htmlFor="image-upload"
                          className={`cursor-pointer ${selectedImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 dark:text-gray-400">
                            {selectedImages.length >= 5 ? 'Máximo alcanzado' : 'Haz clic para seleccionar imágenes'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedImages.length}/5 imágenes seleccionadas
                          </p>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                          {imagePreviews.map((preview, index) => (
                            <motion.div
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="relative group"
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="submit"
                        disabled={isSubmitting || enviando}
                        className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-primary to-fv-gold hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
                      >
                        <motion.div
                          animate={enviando ? { rotate: 360 } : {}}
                          transition={enviando ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                        >
                          <FaPaperPlane className={enviando ? "animate-pulse" : ""} />
                        </motion.div>
                        <span>{enviando ? "Enviando..." : "Enviar solicitud"}</span>
                      </button>
                    </motion.div>
                  </Form>
                </>
              )
            }}
          </Formik>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SolicitudImportacion
