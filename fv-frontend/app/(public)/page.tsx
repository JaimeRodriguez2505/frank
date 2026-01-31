"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  FaArrowRight,
  FaCar,
  FaTachometerAlt,
  FaTools,
  FaCog,
  FaEye,
  FaExpand,
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaTimes,
  FaCheckCircle,
  FaLayerGroup,
  FaHeart,
  FaBox,
  FaTag,
} from "react-icons/fa"
import api, { productService, brandLogoService } from "@/services/api"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { IMAGE_BASE_URL } from "@/config/constants"

import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton"
import { fadeInUp, staggerContainer, cardLift, slideVariants } from "@/config/animationVariants"

const buildImageUrl = (path?: string) => {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  if (path.startsWith("/") && !path.startsWith("/storage/")) return path
  const clean = path.replace(/^\/+/, "")
  return clean.startsWith("storage/") ? `${IMAGE_BASE_URL}/${clean}` : `${IMAGE_BASE_URL}/storage/${clean}`
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  precio_de_oferta?: number
  stock: number
  imagen?: string
  subCategory?: {
    id: number
    name: string
  }
}

const ProductCardSkeleton = () => (
  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
    <ShimmerSkeleton className="h-64 w-full" />
    <div className="p-5 space-y-3">
      <ShimmerSkeleton className="h-4 w-1/3 rounded" />
      <ShimmerSkeleton className="h-6 w-full rounded" />
      <ShimmerSkeleton className="h-6 w-2/3 rounded" />
      <div className="flex gap-2">
        <ShimmerSkeleton className="h-10 flex-1 rounded-xl" />
        <ShimmerSkeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  </div>
)

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
}

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
}

const QuickViewModal = ({ product, onClose, onAddToCart }: QuickViewModalProps) => {
  if (!product) return null

  const discount = product.precio_de_oferta
    ? Math.round(((Number(product.price) - Number(product.precio_de_oferta)) / Number(product.price)) * 100)
    : 0

  const getWhatsAppLink = () => {
    const message = `Hola, quiero información sobre: ${product.name} - Precio: S/ ${product.precio_de_oferta ?? product.price}`
    return `https://wa.me/51940226938?text=${encodeURIComponent(message)}`
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <FaTimes className="text-xl text-gray-700 dark:text-gray-300" />
          </button>

          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden group">
                <img
                  src={buildImageUrl(product.imagen) || "/LogoFVImport.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.precio_de_oferta && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-gradient-to-r from-red-500 to-accent text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      -{discount}% OFF
                    </div>
                  </div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ¡Solo {product.stock} disponibles!
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                  {product.subCategory?.name || "General"}
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {product.description || "Sin descripción disponible"}
                </p>

                <div className="bg-gradient-to-br from-primary/5 to-primary/5 rounded-2xl p-6 mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    {product.precio_de_oferta ? (
                      <>
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          S/ {Number(product.precio_de_oferta).toFixed(2)}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          S/ {Number(product.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        S/ {Number(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.precio_de_oferta && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ¡Ahorras S/ {(Number(product.price) - Number(product.precio_de_oferta)).toFixed(2)}!
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                  {product.stock > 0 ? (
                    <>
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        En stock ({product.stock} unidades)
                      </span>
                    </>
                  ) : (
                    <>
                      <FaTimes className="text-red-500" />
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">Agotado</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    onAddToCart(product)
                    onClose()
                  }}
                  disabled={product.stock === 0}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                >
                  <FaShoppingCart className="text-xl" />
                  Agregar al carrito
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp className="text-xl" />
                    WhatsApp
                  </a>
                  <Link
                    href={`/producto/${product.id}`}
                    className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FaEye className="text-xl" />
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

interface BrandLogo {
  id: number
  name?: string | null
  image_path: string
  sort_order: number
  active: boolean
}

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [brandLogos, setBrandLogos] = useState<BrandLogo[]>([])

  interface Banner {
    image: string
    title: string
    subtitle?: string
  }

  const fallbackBanners: Banner[] = [
    { image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop", title: "Importación de Vehículos Exclusivos" },
    { image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop", title: "Repuestos de Alto Rendimiento" },
    { image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop", title: "Tuning y Personalización" },
    { image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2000&auto=format&fit=crop", title: "Asesoría Especializada" },
    { image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2000&auto=format&fit=crop", title: "La Mejor Experiencia Racing" },
  ]

  const [banners, setBanners] = useState<Banner[]>([])

  const normalizeProduct = (p: unknown): Product => {
    const obj = p as Record<string, unknown>

    const priceRaw = obj.price as number | string | undefined
    const price = typeof priceRaw === "string" ? Number(priceRaw) : typeof priceRaw === "number" ? priceRaw : 0

    const offerRaw = obj.precio_de_oferta as number | string | null | undefined
    const offer =
      offerRaw == null
        ? undefined
        : typeof offerRaw === "string"
          ? Number(offerRaw)
          : typeof offerRaw === "number"
            ? offerRaw
            : undefined

    const idRaw = obj.id as number | string | undefined
    const id = typeof idRaw === "string" ? Number(idRaw) : typeof idRaw === "number" ? idRaw : 0

    const name = String(obj.name ?? "")
    const description = String(obj.description ?? "")

    const stockRaw = obj.stock as number | string | undefined
    const stock = typeof stockRaw === "string" ? Number(stockRaw) : typeof stockRaw === "number" ? stockRaw : 0

    const imagen = obj.imagen as string | undefined

    const sc = obj.subCategory as { id?: number | string; name?: unknown } | undefined
    const subCategory =
      sc && typeof sc === "object"
        ? {
            id: typeof sc.id === "string" ? Number(sc.id) : typeof sc.id === "number" ? sc.id : 0,
            name: String(sc.name ?? "General"),
          }
        : undefined

    return {
      id,
      name,
      description,
      price: Number.isNaN(price) ? 0 : price,
      precio_de_oferta: offer !== undefined && Number.isNaN(offer as number) ? undefined : (offer as number | undefined),
      stock,
      imagen,
      subCategory,
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productService.getFeaturedProducts()
        const productsData = response?.data?.data || response?.data || []
        const normalized = productsData.map((item: unknown) => normalizeProduct(item))
        setFeaturedProducts(normalized.slice(0, 4))
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get(`/banners`)
        const bannersData = res?.data?.data || res?.data || []
        const raw = bannersData as Array<{ image?: string; active?: boolean; title?: string }>
        const items = raw
          .filter((b) => Boolean(b?.image) && Boolean(b?.active))
          .map((b) => ({
            image: buildImageUrl(b.image),
            title: b?.title ?? "Promoción Especial",
          })) as Banner[]
        setBanners(items)
        setCurrentSlide(0)
      } catch (error) {
        console.error("Error fetching banners:", error)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    const fetchBrandLogos = async () => {
      try {
        const res = await brandLogoService.getAll(true)
        const data = res?.data?.data || res?.data || []
        setBrandLogos(data)
      } catch (error) {
        console.error("Error fetching brand logos:", error)
      }
    }

    fetchBrandLogos()
  }, [])

  const displayBanners = banners.length > 0 ? banners : fallbackBanners

  useEffect(() => {
    if (displayBanners.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [displayBanners.length])

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1))
  }

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const addToCart = (product: Product) => {
    try {
      const unitPrice = product.precio_de_oferta ?? product.price
      const saved = localStorage.getItem("catalogo_cart_items")
      const currentCart = saved ? JSON.parse(saved) : []

      const existing = currentCart.find((item: any) => item.productId === product.id)
      const updatedCart = existing
        ? currentCart.map((item: any) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [
            ...currentCart,
            {
              productId: product.id,
              name: product.name,
              price: unitPrice,
              imagen: product.imagen,
              quantity: 1,
            },
          ]

      localStorage.setItem("catalogo_cart_items", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event("catalogo_cart_items_updated"))
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  return (
    <div className="relative w-full bg-gradient-to-b from-background via-background to-secondary/60">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 right-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl"></div>
      </div>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[75vh] flex items-center justify-center text-center text-foreground overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${displayBanners[currentSlide]?.image})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        {/* Speed streak accents */}
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div className="speed-streak top-12 left-0"></div>
          <div className="speed-streak streak-2 top-1/3 left-10"></div>
          <div className="speed-streak streak-3 bottom-16 left-20"></div>
        </div>

        {/* Vertical brand logo carousel */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-20">
          <div className="vertical-marquee h-[420px] w-56 rounded-3xl bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl border border-white/40 dark:border-gray-800/60 shadow-2xl p-4">
            <div className="vertical-marquee-track">
              {brandLogos.map((logo) => (
                <div
                  key={logo.id}
                  className="group rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/90 px-3 py-3 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                >
                  <img
                    src={buildImageUrl(logo.image_path)}
                    alt={logo.name || "logo"}
                    className="h-10 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>
              ))}
              {brandLogos.length === 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center px-3 py-2">
                  Carga logos en Admin &rarr; Logos
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
          <motion.h1
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
          >
            {displayBanners[currentSlide]?.title}
          </motion.h1>
          {displayBanners[currentSlide]?.subtitle && (
            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-2xl text-white/90 mb-8 drop-shadow-lg max-w-3xl mx-auto"
            >
              {displayBanners[currentSlide].subtitle}
            </motion.p>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              href="/catalogo"
              className="px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-xl ring-2 ring-white/70 font-semibold flex items-center gap-3 whitespace-nowrap hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart className="text-xl" />
              <span className="text-sm md:text-base">Ver Catálogo</span>
            </motion.a>

            <motion.a
              href="/solicitud-importacion"
              className="px-6 md:px-8 py-3.5 md:py-4 bg-white/10 backdrop-blur-md text-white rounded-full shadow-xl ring-2 ring-white/50 font-semibold flex items-center gap-3 whitespace-nowrap hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBox className="text-xl" />
              <span className="text-sm md:text-base">Importar Repuesto</span>
            </motion.a>

            <motion.a
              href="/catalogo?offerOnly=true"
              className="px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-xl ring-2 ring-white/70 font-semibold flex items-center gap-3 whitespace-nowrap hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTag className="text-xl" />
              <span className="text-sm md:text-base">Promociones</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Carousel Controls */}
        <motion.button
          className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary p-4 rounded-full z-20 shadow-xl"
          onClick={prevSlide}
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaChevronLeft />
        </motion.button>
        <motion.button
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary p-4 rounded-full z-20 shadow-xl"
          onClick={nextSlide}
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaChevronRight />
        </motion.button>

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {displayBanners.map((_, index) => (
            <motion.button
              key={index}
              className={`rounded-full transition-all ${
                index === currentSlide ? "bg-primary" : "bg-white/50 dark:bg-gray-600/50"
              }`}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1)
                setCurrentSlide(index)
              }}
              animate={{
                scale: index === currentSlide ? 1.5 : 1,
                opacity: index === currentSlide ? 1 : 0.6,
              }}
              whileHover={{ scale: index === currentSlide ? 1.5 : 1.2, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{ width: index === currentSlide ? "32px" : "12px", height: "12px" }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-background via-white to-secondary/70 overflow-x-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 relative z-10 text-foreground"
        >
          Por qué elegir <span className="text-primary">FV Auto Importaciones</span>
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        >
          {[
            { icon: FaCar, title: "Piezas Originales", desc: "Importación directa de piezas de las mejores marcas" },
            { icon: FaTachometerAlt, title: "Alto Rendimiento", desc: "Piezas diseñadas para maximizar performance" },
            { icon: FaTools, title: "Asesoría Especializada", desc: "Te guiamos en la selección perfecta" },
            { icon: FaCog, title: "Garantía y Soporte", desc: "Respaldo completo con garantía post-venta" },
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all"
              >
                <div className="text-4xl text-primary mb-4">
                  <Icon />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-20 relative bg-gradient-to-b from-white via-background/90 to-secondary/70 dark:bg-gray-950 overflow-hidden">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 relative z-10 dark:text-white"
        >
          Productos <span className="text-primary">Destacados</span>
        </motion.h2>

        <LayoutGroup>
          <motion.div
            layout
            className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
          >
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, index) => <ProductCardSkeleton key={index} />)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => {
                const discount = product.precio_de_oferta
                  ? Math.round(
                      ((Number(product.price) - Number(product.precio_de_oferta)) / Number(product.price)) * 100,
                    )
                  : 0

                return (
                  <motion.div
                    key={product.id}
                    layout
                    layoutId={`product-${product.id}`}
                    variants={cardLift}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover="hover"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.4, delay: index * 0.1 },
                      scale: { duration: 0.4, delay: index * 0.1 },
                    }}
                    className="group bg-white/95 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200/60 dark:border-gray-800/60 hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-64 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <Link href={`/producto/${product.id}`}>
                        <img
                          src={buildImageUrl(product.imagen) || "/LogoFVImport.png"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </Link>

                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.precio_de_oferta && (
                          <div className="bg-gradient-to-r from-red-500 to-accent text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            -{discount}% OFF
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ¡Últimas {product.stock}!
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => openProductModal(product)}
                        className="absolute top-3 right-3 p-3 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-lg"
                      >
                        <FaExpand className="text-sm" />
                      </button>

                      <button className="absolute bottom-3 right-3 p-3 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-full opacity-0 group-hover:opacity-100 hover:text-red-500 hover:scale-110 transition-all shadow-lg">
                        <FaHeart className="text-sm" />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="text-xs text-primary font-medium mb-2 flex items-center gap-1">
                        <FaLayerGroup className="text-xs" />
                        {product.subCategory?.name || "General"}
                      </div>

                      <Link href={`/producto/${product.id}`}>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-baseline gap-2 mb-4">
                        {product.precio_de_oferta ? (
                          <>
                            <span className="text-2xl font-bold text-primary">
                              S/ {Number(product.precio_de_oferta).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              S/ {Number(product.price).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-primary">S/ {Number(product.price).toFixed(2)}</span>
                        )}
                      </div>

                      {product.stock > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                product.stock > 10 ? "bg-green-500" : product.stock > 5 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                              style={{
                                transformOrigin: "left",
                                width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{product.stock > 10 ? "Alto" : "Bajo"}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 pt-0 flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                      >
                        <FaShoppingCart className="text-sm" />
                        <span className="text-sm">Agregar</span>
                      </button>
                      <a
                        href={`https://wa.me/51940226938?text=Hola,%20estoy%20interesado%20en:%20${product.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 hover:scale-110 transition-all"
                      >
                        <FaWhatsapp className="text-lg" />
                      </a>
                      <button
                        onClick={() => openProductModal(product)}
                        className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110 transition-all"
                      >
                        <FaEye className="text-lg" />
                      </button>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles</p>
              </div>
            )}
          </motion.div>
        </LayoutGroup>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center relative z-10"
        >
          <Link href="/catalogo">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2">
              Ver todos los productos
              <FaArrowRight className="text-sm" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Benefits Strip */}
      <section className="py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white/95 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-6">
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-primary" />
                  <span>Importación directa</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-primary" />
                  <span>Repuestos deportivos</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-primary" />
                  <span>Atención por WhatsApp</span>
                </div>
              </div>
              <a
                href="https://wa.me/51940226938"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-full font-semibold shadow-md hover:bg-green-600 hover:shadow-lg transition-all"
              >
                <FaWhatsapp className="text-lg" />
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} onClose={closeProductModal} onAddToCart={addToCart} />
    </div>
  )
}

export default Home
