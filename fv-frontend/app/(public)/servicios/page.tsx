"use client"

import { motion } from "framer-motion"
import {
  Package,
  Zap,
  Gauge,
  Wrench,
  Globe,
  CheckCircle2,
  Sparkles,
  Award,
  ShieldCheck
} from "lucide-react"

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

const Servicios = () => {
  const mainServices = [
    {
      icon: Globe,
      title: "Importación Directa",
      description: "Traemos repuestos y accesorios directamente del extranjero, sin intermediarios.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2072&auto=format&fit=crop",
      features: [
        "Originalidad",
        "Mejor precio",
        "Tiempos claros",
        "Proceso seguro"
      ]
    },
    {
      icon: Package,
      title: "Repuestos Deportivos",
      description: "Catálogo especializado en performance real y estética deportiva.",
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop",
      features: [
        "Accesorios internos y externos",
        "Sistema eléctrico y/o componentes",
        "Performance (turbos, admisión, frenos, etc.)",
        "Sistemas de suspensión y frenos",
        "Tuning y estética deportiva"
      ]
    },
    {
      icon: Wrench,
      title: "Pedidos Especiales",
      description: "Buscamos, cotizamos e importamos el repuesto que no encuentras.",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1974&auto=format&fit=crop",
      features: [
        "Búsqueda y cotización",
        "Importación bajo pedido",
        "Seguimiento completo",
        "Recomendaciones personalizadas"
      ]
    }
  ]

  const additionalServices = [
    {
      icon: ShieldCheck,
      title: "Reparación de tapas de timón (airbag)",
      description: "Reparación especializada para tapas de timón, con acabado seguro y prolijo."
    },
    {
      icon: Sparkles,
      title: "Atención Personalizada",
      description: "Atención directa y rápida por WhatsApp para cotizaciones, consultas técnicas y seguimiento."
    },
    {
      icon: Gauge,
      title: "Asesoría Especializada",
      description: "Te asesoramos según marca, modelo, año y objetivo de tu auto."
    },
    {
      icon: Zap,
      title: "Planchado y pintura",
      description: "Acabados y pintura con enfoque detallista para una estética impecable."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Modern decorative background elements */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/15 to-transparent rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-fv-gold/15 to-transparent rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 dark:opacity-20"></div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 md:py-24 px-4 overflow-hidden"
      >
        {/* Speed streak accents */}
        <div className="pointer-events-none absolute inset-x-0 top-6 z-10 overflow-hidden">
          <div className="speed-streak top-0 left-0"></div>
          <div className="speed-streak streak-2 top-8 left-16"></div>
          <div className="speed-streak streak-3 top-16 left-32"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary dark:text-fv-gold">Nuestros Servicios</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-fv-gold to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
              Nuestros Servicios
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Repuestos deportivos | Importación directa | Performance real | Planchado y pintura
            </p>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Globe, title: "Importación directa", text: "Originalidad, mejor precio y tiempos claros." },
              { icon: ShieldCheck, title: "Productos originales", text: "Repuestos auténticos y alternativos de marcas internacionales." },
              { icon: Gauge, title: "Performance real", text: "Mejora de respuesta, potencia y estética del vehículo." }
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-fv-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg mb-5">
                  <IconComponent className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.title}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-light">
                  {stat.text}
                </div>
              </motion.div>
            )})}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Services Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Servicios Principales
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Todo lo que necesitas para potenciar tu vehículo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon
              return (
              <motion.div
                key={index}
                variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-800 transition-all duration-500 h-full min-h-[400px]"
              >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                  </div>

                  {/* Modern glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-fv-gold/30 to-primary/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                  
                {/* Service Header */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <div className="mb-auto">
                      <div className="w-16 h-16 mb-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-fv-gold" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-3xl font-black mb-3 text-white">{service.title}</h3>
                      <p className="text-gray-300 text-sm font-light leading-relaxed mb-6">{service.description}</p>
                    </div>

                    {/* Service Features */}
                    <ul className="space-y-3 pt-6 border-t border-white/10">
                      {service.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                            <CheckCircle2 className="text-fv-gold mt-1 flex-shrink-0 w-5 h-5" strokeWidth={2.5} />
                            <span className="text-gray-200 font-light text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Additional Services */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Servicios Especializados
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon
              return (
              <motion.div
                key={index}
                variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-fv-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-fv-gold transition-colors">
                      {service.title}
                    </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              ¿Qué nos diferencia?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Importación directa", text: "Eliminamos intermediarios con tiempos claros y proceso seguro." },
              { icon: ShieldCheck, title: "Productos originales", text: "Repuestos auténticos y alternativos de marcas internacionales." },
              { icon: Gauge, title: "Especialistas en performance", text: "Piezas pensadas para mejorar respuesta, potencia y estética." },
              { icon: Award, title: "Compra segura", text: "Compatibilidad perfecta y respaldo real en cada compra." },
              { icon: Sparkles, title: "Atención humana", text: "Asesoría personalizada, no automática." }
            ].map((item, index) => {
              const IconComponent = item.icon
              return (
              <motion.div
                key={index}
                variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 hover:border-primary/30 dark:hover:border-primary/30 text-center transition-all duration-500"
              >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-fv-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-fv-gold transition-colors">
                  {item.title}
                </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-light">
                  {item.text}
                </p>
              </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

    </div>
  )
}

export default Servicios
