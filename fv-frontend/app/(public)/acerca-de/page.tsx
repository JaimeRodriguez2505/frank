"use client"

import { motion } from "framer-motion"
import { 
  CarFront, 
  Gauge, 
  Wrench, 
  MapPin, 
  Mail, 
  Award,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from "lucide-react"
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa6"
const acercaImage = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop"
import { useParallax } from "@/hooks/useParallax"
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter"
import {
  fadeInUp,
  staggerContainer
} from "@/config/animationVariants"

// Componente para stats counter animado
const AnimatedStat = ({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) => {
  const count = useAnimatedCounter(value, 2)

  return (
    <motion.div
      variants={fadeInUp}
      className="text-center group"
    >
      <motion.div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary via-fv-gold to-primary bg-clip-text text-transparent bg-[length:200%_auto] group-hover:animate-shimmer">
        <motion.span>{count}</motion.span>
        {suffix}
      </motion.div>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-3 font-medium tracking-wide">
        {label}
      </p>
    </motion.div>
  )
}

const AcercaDe = () => {
  const { ref: parallaxRef, y: parallaxY } = useParallax(150)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Modern decorative background elements - 2025 style */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/15 to-transparent rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-fv-gold/15 to-transparent rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/8 via-transparent to-transparent rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 dark:opacity-20"></div>

      {/* Speed streak accents */}
      <div className="pointer-events-none absolute inset-x-0 top-10 z-10 overflow-hidden">
        <div className="speed-streak top-0 left-0"></div>
        <div className="speed-streak streak-2 top-8 left-16"></div>
        <div className="speed-streak streak-3 top-16 left-32"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Header - Modern 2025 style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary dark:text-fv-gold">Nuestra Historia</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
            Acerca de{" "}
            <span className="bg-gradient-to-r from-primary via-fv-gold to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
              FV Auto Importaciones
            </span>
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
            Especialistas en importación de piezas automotrices de alto rendimiento y calidad
          </p>
        </motion.div>

        {/* Main Content - History and Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-800/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 space-y-6"
          >
            {/* Subtle glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-fv-gold/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <CarFront className="text-white w-6 h-6" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-fv-gold rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary via-fv-gold to-primary bg-clip-text text-transparent bg-[length:200%_auto]">
                Nuestra Historia
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg font-light">
                FV Auto Importaciones nació de la pasión por el automovilismo y el deseo de ofrecer piezas de la más alta calidad al mercado peruano.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg font-light">
                Iniciamos como importadores especializados en piezas de alto rendimiento, enfocados en brindar soluciones automotrices que combinan calidad, performance y confiabilidad.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg font-light">
                Cada pieza que importamos es seleccionada cuidadosamente, garantizando su autenticidad y rendimiento óptimo para tu vehículo.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg font-light">
                En FV Auto Importaciones, no solo vendemos piezas, transformamos tu experiencia de conducción con productos de primer nivel y asesoría técnica especializada.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg font-light">
                Continuamos expandiéndonos, innovando y trayendo las mejores marcas del mercado internacional para satisfacer las necesidades de los entusiastas automotrices más exigentes.
              </p>
            </div>
          </motion.div>

          <motion.div
            ref={parallaxRef}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800/50 h-[500px] lg:h-auto hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500"
          >
            <div className="relative h-full overflow-hidden">
              {/* Modern gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 dark:to-black/70 z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
              />
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>
              <motion.img
                style={{ y: parallaxY }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                src={acercaImage}
                alt="FV Auto Importaciones"
                className="w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats Section - Modern 2025 design */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-20 relative"
        >
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-10 md:p-16 shadow-2xl border border-gray-200/50 dark:border-gray-800/50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tl from-fv-gold/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
              <AnimatedStat value={150} suffix="+" label="Clientes Satisfechos" />
              <AnimatedStat value={500} suffix="+" label="Piezas Importadas" />
              <AnimatedStat value={15} suffix="+" label="Marcas Premium" />
              <AnimatedStat value={100} suffix="%" label="Garantía de Calidad" />
            </div>
          </div>
        </motion.section>

        {/* Values Section - Modern card design */}
        <motion.section className="mb-20">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary dark:text-fv-gold">Nuestros Valores</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              Nuestros{" "}
              <span className="bg-gradient-to-r from-primary via-fv-gold to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                Valores
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 text-center overflow-hidden transition-all duration-500 hover:border-primary/50 dark:hover:border-primary/50"
            >
              {/* Modern glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-fv-gold/30 to-primary/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              
              <div className="relative z-10">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <ShieldCheck className="text-white w-8 h-8" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-fv-gold transition-colors">
                  Calidad Garantizada
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-light">
                  Importación directa de piezas originales con certificados de autenticidad y garantía de fábrica.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 text-center overflow-hidden transition-all duration-500 hover:border-primary/50 dark:hover:border-primary/50"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-fv-gold/30 to-primary/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>

              <div className="relative z-10">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Wrench className="text-white w-8 h-8" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-fv-gold transition-colors">
                  Asesoría Técnica
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-light">
                  Equipo especializado que te guía en la selección de las piezas ideales para tu proyecto automotriz.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 text-center overflow-hidden transition-all duration-500 hover:border-primary/50 dark:hover:border-primary/50"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-fv-gold/30 to-primary/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>

              <div className="relative z-10">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Gauge className="text-white w-8 h-8" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-fv-gold transition-colors">
                  Alto Rendimiento
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-light">
                  Piezas diseñadas para maximizar el performance, la seguridad y la experiencia de manejo.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 text-center overflow-hidden transition-all duration-500 hover:border-primary/50 dark:hover:border-primary/50"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-fv-gold/30 to-primary/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>

              <div className="relative z-10">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <TrendingUp className="text-white w-8 h-8" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-fv-gold transition-colors">
                  Pasión Automotriz
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-light">
                  Compartimos tu pasión por los autos y te ofrecemos productos que transforman tu vehículo.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Contact Section - Modern 2025 design */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary dark:text-fv-gold">Contáctanos</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary via-fv-gold to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                Contáctanos
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 text-center transition-all duration-500 hover:border-primary/50 dark:hover:border-primary/50"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-fv-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <MapPin className="text-white w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-fv-gold transition-colors">Ubicación</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light">Lima, Perú</p>
            </motion.div>

            <motion.a
              href={`https://wa.me/51940226938?text=${encodeURIComponent('Hola, me gustaría consultar sobre piezas y accesorios automotrices.')}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 text-center no-underline transition-all duration-500 hover:border-green-500/50"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <FaWhatsapp className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light">940 226 938</p>
            </motion.a>

            <motion.a
              href={`mailto:contacto@fvautoimportaciones.com?subject=${encodeURIComponent('Consulta FV Auto Importaciones')}&body=${encodeURIComponent('Hola, me gustaría obtener información sobre piezas y accesorios automotrices.')}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 text-center no-underline transition-all duration-500 hover:border-primary/50 dark:hover:border-primary/50"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-fv-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-fv-gold flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Mail className="text-white w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-fv-gold transition-colors">Email</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light text-sm break-all">contacto@fvautoimportaciones.com</p>
            </motion.a>
          </div>

          {/* Social Media Links - Modern design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <motion.a
              href="https://www.facebook.com/fvautoimportaciones"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-16 h-16 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-800/50 flex items-center justify-center text-2xl text-primary dark:text-fv-gold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10"></div>
              <FaFacebook />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/fvautoimportaciones/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-16 h-16 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-800/50 flex items-center justify-center text-2xl text-primary dark:text-fv-gold hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-orange-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10"></div>
              <FaInstagram />
            </motion.a>
            <motion.a
              href="https://www.tiktok.com/@fvautoimportaciones"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-16 h-16 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-800/50 flex items-center justify-center text-2xl text-primary dark:text-fv-gold hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-800/30 to-black/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10"></div>
              <FaTiktok />
            </motion.a>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}

export default AcercaDe
