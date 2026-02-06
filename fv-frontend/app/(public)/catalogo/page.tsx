"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaFilter,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
  FaEye,
  FaWhatsapp,
  FaTag,
  FaCheckCircle,
  FaDollarSign,
  FaShoppingCart,
  FaThLarge,
  FaListUl,
  FaLayerGroup,
  FaHome,
  FaChevronLeft,
  FaHeart,
  FaExpand,
  FaImage,
  FaCheck,
  FaBox,
  FaCar
} from "react-icons/fa"
import { categoryService, productService } from "@/services/api"
import { IMAGE_BASE_URL } from "@/config/constants"
import {
  cardLift,
  checkboxVariants
} from "@/config/animationVariants"

// Helper para construir URLs de imagen
const buildImageUrl = (path?: string) => {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  if (path.startsWith("/") && !path.startsWith("/storage/")) return path
  const clean = path.replace(/^\/+/, "")
  return clean.startsWith("storage/")
    ? `${IMAGE_BASE_URL}/${clean}`
    : `${IMAGE_BASE_URL}/storage/${clean}`
}

// ==================== INTERFACES ====================

interface Category {
  id: number
  name: string
}

interface ProductImage {
  id: number
  image_path: string
  order: number
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  precio_de_oferta?: number
  stock: number
  imagen?: string
  images?: ProductImage[]
  category_id: number
  category?: {
    id: number
    name: string
  }
  SKU?: string
  // Nuevos campos
  compatibilidad?: string
  origen?: string
  marca?: string
  peso?: number
  condicion?: 'nuevo_original' | 'alternativo' | 'usado'
  disponibilidad?: 'en_stock' | 'en_oferta' | 'solo_pedido'
}

// ==================== COMPONENTE DE CARRUSEL ====================

interface ProductImageCarouselProps {
  images: string[]
  productName: string
  onImageClick: () => void
}

const ProductImageCarousel = ({ images, productName, onImageClick }: ProductImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <button
        onClick={onImageClick}
        className="relative w-full h-full cursor-pointer group/image"
        title="Click para vista rápida"
      >
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={buildImageUrl(images[currentImageIndex])}
          alt={`${productName} - Imagen ${currentImageIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay de vista rápida */}
        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <FaExpand className="text-gray-700 dark:text-gray-300 text-lg" />
          </div>
        </div>
      </button>

      {/* Navigation Arrows - Only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <FaChevronLeft className="text-gray-700 dark:text-gray-300 text-sm" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <FaChevronRight className="text-gray-700 dark:text-gray-300 text-sm" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

// ==================== ANIMACIONES MEJORADAS ====================

const filterPanelVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
}

// ==================== SKELETON LOADER ====================

const ProductCardSkeleton = () => (
  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 animate-pulse">
    <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="flex gap-2">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
)

// ==================== QUICK VIEW MODAL ====================

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
  getWhatsAppLink: (product: Product) => string
}

const QuickViewModal = ({ product, onClose, onAddToCart, getWhatsAppLink }: QuickViewModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!product) return null

  const discount = product.precio_de_oferta
    ? Math.round(((Number(product.price) - Number(product.precio_de_oferta)) / Number(product.price)) * 100)
    : 0

  // Build array of all images
  const allImages = [
    product.imagen || "/LogoFVImport.png",
    ...(product.images?.sort((a, b) => a.order - b.order).map(img => img.image_path) || [])
  ]

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
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
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <FaTimes className="text-xl text-gray-700 dark:text-gray-300" />
          </button>

          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
            {/* Image Gallery section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden group">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={buildImageUrl(allImages[selectedImageIndex])}
                  alt={`${product.name} - Imagen ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.precio_de_oferta && (
                    <div className="bg-gradient-to-r from-red-500 to-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      -{discount}% OFF
                    </div>
                  )}
                  {product.disponibilidad === 'solo_pedido' && (
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Solo para Pedido
                    </div>
                  )}
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ¡Solo {product.stock} disponibles!
                  </div>
                )}

                {/* Navigation Arrows - Only show if multiple images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
                    >
                      <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
                    </button>

                    <button
                      onClick={goToNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
                    >
                      <FaChevronRight className="text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm font-semibold rounded-full shadow-lg">
                      {selectedImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((imagePath, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary/50"
                          : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={buildImageUrl(imagePath)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-primary/20" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info section */}
            <div className="flex flex-col">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                  {product.category?.name || "Sin categoría"}
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {product.description || "Sin descripción disponible"}
                </p>

                {/* Specifications */}
                {(product.compatibilidad || product.origen || product.marca || product.peso || product.condicion) && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 mb-6 space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
                      Especificaciones
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {product.compatibilidad && (
                        <div className="col-span-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                            Compatibilidad
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {product.compatibilidad}
                          </span>
                        </div>
                      )}
                      {product.marca && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                            Marca
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white font-semibold">
                            {product.marca}
                          </span>
                        </div>
                      )}
                      {product.SKU && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                            SKU
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white font-semibold">
                            {product.SKU}
                          </span>
                        </div>
                      )}
                      {product.origen && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                            Origen
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {product.origen}
                          </span>
                        </div>
                      )}
                      {product.peso && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                            Peso
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {product.peso} kg
                          </span>
                        </div>
                      )}
                      {product.disponibilidad && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                            Disponibilidad
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {product.disponibilidad === 'en_stock'
                              ? 'En stock'
                              : product.disponibilidad === 'en_oferta'
                              ? 'En oferta'
                              : 'Solo pedido'}
                          </span>
                        </div>
                      )}
                      {product.condicion && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                            Condición
                          </span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            product.condicion === 'nuevo_original' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            product.condicion === 'alternativo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {product.condicion === 'nuevo_original' ? 'Nuevo Original' :
                             product.condicion === 'alternativo' ? 'Alternativo' : 'Usado'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/5 rounded-2xl p-6 mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    {product.precio_de_oferta ? (
                      <>
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent">
                          S/ {Number(product.precio_de_oferta).toFixed(2)}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          S/ {Number(product.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent">
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

                {/* Stock status */}
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
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        Agotado
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    onAddToCart(product)
                    onClose()
                  }}
                  disabled={product.stock === 0}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-primary to-fv-gold text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                >
                  <FaShoppingCart className="text-xl" />
                  Agregar al carrito
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={getWhatsAppLink(product)}
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

// ==================== COMPONENTE PRINCIPAL ====================

const Catalogo = () => {
  const searchParams = useSearchParams()

  // Estados principales
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Estados UI
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const productsPerPage = 12

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [sortOption, setSortOption] = useState("default")
  const [offerOnly, setOfferOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  // Nuevos filtros
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCondiciones, setSelectedCondiciones] = useState<string[]>([])
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([])
  const [selectedDisponibilidades, setSelectedDisponibilidades] = useState<string[]>([])
  const [orderOnly, setOrderOnly] = useState(false)
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 0])
  const [brandQuery, setBrandQuery] = useState("")
  const [originQuery, setOriginQuery] = useState("")
  const [compatQuery, setCompatQuery] = useState("")
  const [skuQuery, setSkuQuery] = useState("")

  // Secciones expandidas
  const [showCategoryFilter, setShowCategoryFilter] = useState(true)
  const [showAvailabilityFilter, setShowAvailabilityFilter] = useState(true)
  const [showPriceFilter, setShowPriceFilter] = useState(true)
  const [showBrandFilter, setShowBrandFilter] = useState(true)
  const [showConditionFilter, setShowConditionFilter] = useState(true)
  const [showOriginFilter, setShowOriginFilter] = useState(true)
  const [showWeightFilter, setShowWeightFilter] = useState(true)
  const [showCompatibilityFilter, setShowCompatibilityFilter] = useState(true)
  const [showSkuFilter, setShowSkuFilter] = useState(true)

  // ==================== CARGAR DATOS ====================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [catRes, prodRes] = await Promise.all([
          categoryService.getAll(),
          productService.getAll()
        ])

        const categoriesData = catRes.data.data || catRes.data || []
        const productsData = prodRes.data.data || prodRes.data || []

        setCategories(categoriesData)
        setProducts(productsData)
      } catch (error) {
        console.error("Error al cargar catálogo:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Procesar parámetro de búsqueda desde URL
  useEffect(() => {
    const searchParam = searchParams.get("search")
    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [searchParams])

  useEffect(() => {
    const offerParam = searchParams.get("offerOnly")
    if (offerParam !== null) {
      setOfferOnly(offerParam === "true" || offerParam === "1")
    }
  }, [searchParams])

  // Scroll suave hacia arriba cuando cambie la página
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [currentPage])

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // ==================== CÁLCULOS ====================

  // Calcular rango de precios disponible
  const [computedMinPrice, computedMaxPrice] = useMemo(() => {
    if (products.length === 0) return [0, 0]
    const prices = products.map(p => p.precio_de_oferta ?? p.price)
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
  }, [products])

  // Extraer marcas únicas de productos
  const uniqueBrands = useMemo(() => {
    const brands = products
      .map(p => p.marca)
      .filter((marca): marca is string => !!marca)
    return Array.from(new Set(brands)).sort()
  }, [products])

  const uniqueOrigins = useMemo(() => {
    const origins = products
      .map(p => p.origen)
      .filter((origen): origen is string => !!origen)
    return Array.from(new Set(origins)).sort()
  }, [products])

  const [computedMinWeight, computedMaxWeight] = useMemo(() => {
    const weights = products.map(p => p.peso).filter((peso): peso is number => typeof peso === "number")
    if (weights.length === 0) return [0, 0]
    return [Math.floor(Math.min(...weights)), Math.ceil(Math.max(...weights))]
  }, [products])

  // Inicializar rango de precios
  useEffect(() => {
    if (products.length > 0 && priceRange[0] === 0 && priceRange[1] === 0) {
      setPriceRange([computedMinPrice, computedMaxPrice])
    }
  }, [products, computedMinPrice, computedMaxPrice, priceRange])

  useEffect(() => {
    if (computedMaxWeight > 0 && weightRange[0] === 0 && weightRange[1] === 0) {
      setWeightRange([computedMinWeight, computedMaxWeight])
    }
  }, [computedMinWeight, computedMaxWeight, weightRange])

  // ==================== FILTRADO DE PRODUCTOS ====================

  useEffect(() => {
    let filtered = [...products]

    // Filtrar por categoría
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedCategories.includes(product.category_id)
      })
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.marca?.toLowerCase().includes(searchLower) ||
          product.origen?.toLowerCase().includes(searchLower) ||
          product.compatibilidad?.toLowerCase().includes(searchLower) ||
          product.SKU?.toLowerCase().includes(searchLower)
      )
    }

    // Filtrar por compatibilidad específica
    if (compatQuery) {
      const compatLower = compatQuery.toLowerCase()
      filtered = filtered.filter((product) =>
        product.compatibilidad?.toLowerCase().includes(compatLower)
      )
    }

    // Filtrar por SKU
    if (skuQuery) {
      const skuLower = skuQuery.toLowerCase()
      filtered = filtered.filter((product) =>
        product.SKU?.toLowerCase().includes(skuLower)
      )
    }

    // Filtrar por oferta
    if (offerOnly) {
      filtered = filtered.filter(p => !!p.precio_de_oferta)
    }

    // Filtrar por stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0)
    }

    // Filtrar por rango de precio
    if (priceRange[0] > 0 || priceRange[1] > 0) {
      filtered = filtered.filter(p => {
        const price = p.precio_de_oferta ?? p.price
        return price >= priceRange[0] && price <= priceRange[1]
      })
    }

    // Filtrar por marca
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => p.marca && selectedBrands.includes(p.marca))
    }

    // Filtrar por condición
    if (selectedCondiciones.length > 0) {
      filtered = filtered.filter(p => p.condicion && selectedCondiciones.includes(p.condicion))
    }

    if (selectedOrigins.length > 0) {
      filtered = filtered.filter(p => p.origen && selectedOrigins.includes(p.origen))
    }

    if (selectedDisponibilidades.length > 0) {
      filtered = filtered.filter(p => p.disponibilidad && selectedDisponibilidades.includes(p.disponibilidad))
    }

    // Filtrar "solo para pedido"
    if (orderOnly) {
      filtered = filtered.filter(p => p.disponibilidad === 'solo_pedido')
    }

    if (weightRange[0] > 0 || weightRange[1] > 0) {
      filtered = filtered.filter(p => {
        if (typeof p.peso !== "number") return false
        return p.peso >= weightRange[0] && p.peso <= weightRange[1]
      })
    }

    // Ordenar
    switch (sortOption) {
      case "price_asc":
        filtered.sort((a, b) => (a.precio_de_oferta ?? a.price) - (b.precio_de_oferta ?? b.price))
        break
      case "price_desc":
        filtered.sort((a, b) => (b.precio_de_oferta ?? b.price) - (a.precio_de_oferta ?? a.price))
        break
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        // Por defecto: Más recientes primero (ID descendente)
        filtered.sort((a, b) => b.id - a.id)
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [
    products,
    selectedCategories,
    searchTerm,
    sortOption,
    offerOnly,
    inStockOnly,
    priceRange,
    selectedBrands,
    selectedCondiciones,
    selectedOrigins,
    selectedDisponibilidades,
    orderOnly,
    weightRange,
    compatQuery,
    skuQuery
  ])

  // ==================== MANEJADORES ====================

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const handleCondicionToggle = (condicion: string) => {
    setSelectedCondiciones(prev =>
      prev.includes(condicion)
        ? prev.filter(c => c !== condicion)
        : [...prev, condicion]
    )
  }

  const handleOriginToggle = (origin: string) => {
    setSelectedOrigins(prev =>
      prev.includes(origin)
        ? prev.filter(o => o !== origin)
        : [...prev, origin]
    )
  }

  const handleDisponibilidadToggle = (value: string) => {
    setSelectedDisponibilidades(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSearchTerm("")
    setSortOption("default")
    setOfferOnly(false)
    setInStockOnly(false)
    setPriceRange([computedMinPrice, computedMaxPrice])
    setSelectedBrands([])
    setSelectedCondiciones([])
    setSelectedOrigins([])
    setSelectedDisponibilidades([])
    setOrderOnly(false)
    setWeightRange([computedMinWeight, computedMaxWeight])
    setBrandQuery("")
    setOriginQuery("")
    setCompatQuery("")
    setSkuQuery("")
    setCurrentPage(1)
  }

  const addToCart = (product: Product) => {
    try {
      const unitPrice = product.precio_de_oferta ?? product.price
      const saved = localStorage.getItem("catalogo_cart_items")
      const currentCart = saved ? JSON.parse(saved) : []

      const existing = currentCart.find((item: any) => item.productId === product.id)
      const updatedCart = existing
        ? currentCart.map((item: any) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...currentCart,
            {
              productId: product.id,
              name: product.name,
              price: unitPrice,
              imagen: product.imagen,
              quantity: 1
            }
          ]

      localStorage.setItem("catalogo_cart_items", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event("catalogo_cart_items_updated"))
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const getWhatsAppLink = (product: Product) => {
    const message = `Hola, quiero información sobre: ${product.name} - Precio: S/ ${product.precio_de_oferta ?? product.price}`
    return `https://wa.me/5154221478?text=${encodeURIComponent(message)}`
  }

  // ==================== HELPERS ====================

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    !!searchTerm ||
    offerOnly ||
    inStockOnly ||
    (priceRange[0] > computedMinPrice || priceRange[1] < computedMaxPrice) ||
    selectedBrands.length > 0 ||
    selectedCondiciones.length > 0 ||
    selectedOrigins.length > 0 ||
    selectedDisponibilidades.length > 0 ||
    orderOnly ||
    (computedMaxWeight > 0 && (weightRange[0] > computedMinWeight || weightRange[1] < computedMaxWeight)) ||
    !!compatQuery ||
    !!skuQuery

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const activeFiltersCount =
    selectedCategories.length +
    (searchTerm ? 1 : 0) +
    (offerOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > computedMinPrice || priceRange[1] < computedMaxPrice ? 1 : 0) +
    selectedBrands.length +
    selectedCondiciones.length +
    selectedOrigins.length +
    selectedDisponibilidades.length +
    (orderOnly ? 1 : 0) +
    (computedMaxWeight > 0 && (weightRange[0] > computedMinWeight || weightRange[1] < computedMaxWeight) ? 1 : 0) +
    (compatQuery ? 1 : 0) +
    (skuQuery ? 1 : 0)

  const hasPriceRange = computedMaxPrice > computedMinPrice
  const priceRangeSpan = Math.max(computedMaxPrice - computedMinPrice, 1)
  const priceMinPercent = hasPriceRange ? ((priceRange[0] - computedMinPrice) / priceRangeSpan) * 100 : 0
  const priceMaxPercent = hasPriceRange ? ((priceRange[1] - computedMinPrice) / priceRangeSpan) * 100 : 100

  const hasWeightRange = computedMaxWeight > computedMinWeight
  const weightRangeSpan = Math.max(computedMaxWeight - computedMinWeight, 1)
  const weightMinPercent = hasWeightRange ? ((weightRange[0] - computedMinWeight) / weightRangeSpan) * 100 : 0
  const weightMaxPercent = hasWeightRange ? ((weightRange[1] - computedMinWeight) / weightRangeSpan) * 100 : 100

  const filteredBrands = uniqueBrands.filter((brand) =>
    brand.toLowerCase().includes(brandQuery.toLowerCase())
  )

  const filteredOrigins = uniqueOrigins.filter((origin) =>
    origin.toLowerCase().includes(originQuery.toLowerCase())
  )

  // ==================== RENDER ====================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_circle_at_10%_-20%,rgba(177,26,26,0.16),transparent_55%),radial-gradient(900px_circle_at_90%_-10%,rgba(240,109,91,0.18),transparent_55%),linear-gradient(135deg,rgba(248,249,251,0.9),rgba(255,255,255,0.7),rgba(245,246,248,0.9))] dark:bg-[radial-gradient(900px_circle_at_12%_-20%,rgba(224,74,58,0.25),transparent_60%),radial-gradient(800px_circle_at_88%_-10%,rgba(177,26,26,0.25),transparent_55%),linear-gradient(135deg,rgba(12,12,14,0.96),rgba(18,18,22,0.92),rgba(10,10,12,0.98))]">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-0 w-[640px] h-[640px] bg-gradient-to-br from-primary/20 via-fv-gold/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 left-0 w-[520px] h-[520px] bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Speed streak accents */}
        <div className="pointer-events-none absolute inset-x-0 top-10 z-10 overflow-hidden">
          <div className="speed-streak top-0 left-0"></div>
          <div className="speed-streak streak-2 top-8 left-16"></div>
          <div className="speed-streak streak-3 top-16 left-32"></div>
        </div>
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm mb-6"
        >
          <Link href="/" className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <FaHome />
            <span>Inicio</span>
          </Link>
          <FaChevronRight className="text-gray-400 text-xs" />
          <span className="text-primary font-medium">Catálogo</span>
        </motion.nav>

        {/* Header mejorado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="racing-hero-card relative overflow-hidden bg-white/95 dark:bg-gray-950/80 backdrop-blur-2xl rounded-[32px] p-6 md:p-8 shadow-[0_30px_80px_rgba(15,15,15,0.12)] border border-gray-200/60 dark:border-gray-800/60">
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-25 dark:opacity-30"
                style={{ backgroundImage: "url('/catalogo.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent dark:from-gray-900/85 dark:via-gray-950/55" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-fv-gold/20 rounded-2xl ring-1 ring-primary/20">
                    <FaLayerGroup className="text-3xl text-primary dark:text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-fv-gold dark:from-primary dark:via-primary dark:to-fv-gold bg-clip-text text-transparent">
                      Catálogo de Productos
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Explora nuestra colección completa
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOfferOnly(!offerOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    offerOnly
                      ? "bg-gradient-to-r from-primary to-fv-gold text-white shadow-lg scale-105"
                      : "bg-white/90 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/80 hover:border-primary"
                  }`}
                >
                  <FaTag className="text-sm" />
                  <span className="text-sm">Ofertas</span>
                </button>
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    inStockOnly
                      ? "bg-gradient-to-r from-primary to-fv-gold text-white shadow-lg scale-105"
                      : "bg-white/90 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/80 hover:border-primary"
                  }`}
                >
                  <FaCheckCircle className="text-sm" />
                  <span className="text-sm">En Stock</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Backdrop móvil */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

          {/* Sidebar de filtros mejorado */}
          <AnimatePresence>
            {(isFilterOpen || isDesktop) && (
              <motion.aside
                variants={filterPanelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed lg:sticky top-0 left-0 h-screen lg:h-fit w-[280px] bg-white/95 dark:bg-gray-950/85 backdrop-blur-2xl rounded-[28px] shadow-[0_25px_60px_rgba(15,15,15,0.18)] border border-gray-200/60 dark:border-gray-800/60 z-50 lg:z-auto overflow-hidden flex flex-col"
              >
                {/* Header filtros */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200/70 dark:border-gray-800/70">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/20">
                      <FaFilter className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtros</h2>
                      {activeFiltersCount > 0 && (
                        <span className="text-xs text-gray-500">{activeFiltersCount} activos</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>

                {/* Filtros con scroll */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Limpiar filtros */}
                  {hasActiveFilters && (
                    <motion.button
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onClick={clearFilters}
                      className="w-full py-3 px-4 bg-gradient-to-r from-primary to-fv-gold text-white rounded-xl font-medium hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      Limpiar todos los filtros
                    </motion.button>
                  )}

                  {/* Categorías */}
                  <div>
                    <button
                      onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaLayerGroup className="text-primary group-hover:scale-110 transition-transform" />
                        Categorías
                      </span>
                      <FaChevronDown
                        className={`transition-transform text-gray-400 ${showCategoryFilter ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showCategoryFilter && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-1 overflow-hidden"
                        >
                          {categories.map((category) => {
                            const isSelected = selectedCategories.includes(category.id)

                            return (
                              <motion.div
                                key={category.id}
                                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                onClick={() => handleCategoryToggle(category.id)}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                {/* Custom animated checkbox */}
                                <div className="relative w-5 h-5 flex-shrink-0">
                                  <motion.div
                                    className="absolute inset-0 border-2 rounded"
                                    animate={{
                                      borderColor: isSelected ? "var(--primary)" : "rgb(209, 213, 219)"
                                    }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  <motion.div
                                    className="absolute inset-0 bg-primary rounded flex items-center justify-center"
                                    variants={checkboxVariants}
                                    initial="unchecked"
                                    animate={isSelected ? "checked" : "unchecked"}
                                  >
                                    <FaCheck className="text-white text-xs" />
                                  </motion.div>
                                </div>
                                <div
                                  className={`flex-1 text-sm ${
                                    isSelected ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {category.name}
                                </div>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Disponibilidad */}
                  <div>
                    <button
                      onClick={() => setShowAvailabilityFilter(!showAvailabilityFilter)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCheckCircle className="text-primary group-hover:scale-110 transition-transform" />
                        Disponibilidad
                      </span>
                      <FaChevronDown
                        className={`transition-transform text-gray-400 ${showAvailabilityFilter ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showAvailabilityFilter && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-2 overflow-hidden"
                        >
                          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group transition-colors">
                            <input
                              type="checkbox"
                              checked={offerOnly}
                              onChange={(e) => setOfferOnly(e.target.checked)}
                              className="w-4 h-4 accent-primary rounded"
                            />
                            <div className="flex-1 flex items-center gap-2">
                              <div className="p-1.5 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                                <FaTag className="text-primary text-xs" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                Solo en oferta
                              </span>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group transition-colors">
                            <input
                              type="checkbox"
                              checked={inStockOnly}
                              onChange={(e) => setInStockOnly(e.target.checked)}
                              className="w-4 h-4 accent-primary rounded"
                            />
                            <div className="flex-1 flex items-center gap-2">
                              <div className="p-1.5 bg-green-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                <FaCheckCircle className="text-green-500 text-xs" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                Solo con stock
                              </span>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group transition-colors">
                            <input
                              type="checkbox"
                              checked={orderOnly}
                              onChange={(e) => setOrderOnly(e.target.checked)}
                              className="w-4 h-4 accent-primary rounded"
                            />
                            <div className="flex-1 flex items-center gap-2">
                              <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                <FaBox className="text-blue-500 text-xs" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                Solo para pedido
                              </span>
                            </div>
                          </label>

                          <div className="pt-3 border-t border-gray-200/70 dark:border-gray-800/70">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                              Tipo de disponibilidad
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                { value: "en_stock", label: "En stock" },
                                { value: "en_oferta", label: "En oferta" },
                                { value: "solo_pedido", label: "Solo pedido" }
                              ].map((item) => {
                                const active = selectedDisponibilidades.includes(item.value)
                                return (
                                  <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => handleDisponibilidadToggle(item.value)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-sm ${
                                      active
                                        ? "bg-primary/10 border-primary text-primary font-semibold"
                                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary/60"
                                    }`}
                                  >
                                    <span>{item.label}</span>
                                    {active && <FaCheck className="text-xs" />}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Precio */}
                  <div>
                    <button
                      onClick={() => setShowPriceFilter(!showPriceFilter)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaDollarSign className="text-primary group-hover:scale-110 transition-transform" />
                        Rango de precio
                      </span>
                      <FaChevronDown
                        className={`transition-transform text-gray-400 ${showPriceFilter ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showPriceFilter && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-4 overflow-hidden"
                        >
                          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/70 p-4">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                              <span>S/ {computedMinPrice}</span>
                              <span>S/ {computedMaxPrice}</span>
                            </div>

                            <div className="range-slider relative h-8">
                              <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
                              <div
                                className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-primary to-fv-gold rounded-full"
                                style={{
                                  left: `${priceMinPercent}%`,
                                  right: `${100 - priceMaxPercent}%`
                                }}
                              />
                              <input
                                type="range"
                                min={computedMinPrice}
                                max={computedMaxPrice}
                                value={priceRange[0]}
                                disabled={!hasPriceRange}
                                onChange={(e) => {
                                  const value = Math.min(Number(e.target.value), priceRange[1])
                                  setPriceRange([value, priceRange[1]])
                                }}
                                className="absolute inset-0 w-full h-8 appearance-none bg-transparent"
                              />
                              <input
                                type="range"
                                min={computedMinPrice}
                                max={computedMaxPrice}
                                value={priceRange[1]}
                                disabled={!hasPriceRange}
                                onChange={(e) => {
                                  const value = Math.max(Number(e.target.value), priceRange[0])
                                  setPriceRange([priceRange[0], value])
                                }}
                                className="absolute inset-0 w-full h-8 appearance-none bg-transparent"
                              />
                            </div>

                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Min</span>
                              <span>Max</span>
                            </div>
                            {!hasPriceRange && (
                              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                                {computedMaxPrice === 0 ? "Sin precios disponibles aún" : "Rango único disponible"}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2 font-medium">
                                Mínimo
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                                <input
                                  type="number"
                                  value={priceRange[0]}
                                  disabled={!hasPriceRange}
                                  onChange={(e) =>
                                    setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])
                                  }
                                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2 font-medium">
                                Máximo
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                                <input
                                  type="number"
                                  value={priceRange[1]}
                                  disabled={!hasPriceRange}
                                  onChange={(e) =>
                                    setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])
                                  }
                                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setPriceRange([computedMinPrice, computedMaxPrice])}
                            className="w-full text-sm text-primary hover:text-fv-gold font-medium hover:underline transition-colors"
                          >
                            Restablecer rango de precio
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Peso */}
                  {computedMaxWeight > 0 && (
                    <div>
                      <button
                        onClick={() => setShowWeightFilter(!showWeightFilter)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FaBox className="text-primary group-hover:scale-110 transition-transform" />
                          Peso (kg)
                        </span>
                        <FaChevronDown
                          className={`transition-transform text-gray-400 ${showWeightFilter ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {showWeightFilter && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 space-y-4 overflow-hidden"
                          >
                            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/70 p-4">
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                                <span>{computedMinWeight} kg</span>
                                <span>{computedMaxWeight} kg</span>
                              </div>

                              <div className="range-slider relative h-8">
                                <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-primary to-fv-gold rounded-full"
                                  style={{
                                    left: `${weightMinPercent}%`,
                                    right: `${100 - weightMaxPercent}%`
                                  }}
                                />
                                <input
                                  type="range"
                                  min={computedMinWeight}
                                  max={computedMaxWeight}
                                  value={weightRange[0]}
                                  onChange={(e) => {
                                    const value = Math.min(Number(e.target.value), weightRange[1])
                                    setWeightRange([value, weightRange[1]])
                                  }}
                                  className="absolute inset-0 w-full h-8 appearance-none bg-transparent"
                                />
                                <input
                                  type="range"
                                  min={computedMinWeight}
                                  max={computedMaxWeight}
                                  value={weightRange[1]}
                                  onChange={(e) => {
                                    const value = Math.max(Number(e.target.value), weightRange[0])
                                    setWeightRange([weightRange[0], value])
                                  }}
                                  className="absolute inset-0 w-full h-8 appearance-none bg-transparent"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2 font-medium">
                                  Mínimo
                                </label>
                                <input
                                  type="number"
                                  value={weightRange[0]}
                                  onChange={(e) =>
                                    setWeightRange([Math.min(Number(e.target.value), weightRange[1]), weightRange[1]])
                                  }
                                  className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2 font-medium">
                                  Máximo
                                </label>
                                <input
                                  type="number"
                                  value={weightRange[1]}
                                  onChange={(e) =>
                                    setWeightRange([weightRange[0], Math.max(Number(e.target.value), weightRange[0])])
                                  }
                                  className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => setWeightRange([computedMinWeight, computedMaxWeight])}
                              className="w-full text-sm text-primary hover:text-fv-gold font-medium hover:underline transition-colors"
                            >
                              Restablecer peso
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Marca */}
                  {uniqueBrands.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowBrandFilter(!showBrandFilter)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FaTag className="text-primary group-hover:scale-110 transition-transform" />
                          Marca
                        </span>
                        <FaChevronDown
                          className={`transition-transform text-gray-400 ${showBrandFilter ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {showBrandFilter && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 space-y-3 overflow-hidden"
                          >
                            <div className="relative">
                              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                              <input
                                type="text"
                                value={brandQuery}
                                onChange={(e) => setBrandQuery(e.target.value)}
                                placeholder="Buscar marca..."
                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-1">
                            {filteredBrands.map((brand) => {
                              const isSelected = selectedBrands.includes(brand)

                              return (
                                <motion.div
                                  key={brand}
                                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                  onClick={() => handleBrandToggle(brand)}
                                  whileHover={{ x: 4 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="relative w-5 h-5 flex-shrink-0">
                                    <motion.div
                                      className="absolute inset-0 border-2 rounded"
                                      animate={{
                                        borderColor: isSelected ? "var(--primary)" : "rgb(209, 213, 219)"
                                      }}
                                      transition={{ duration: 0.2 }}
                                    />
                                    <motion.div
                                      className="absolute inset-0 bg-primary rounded flex items-center justify-center"
                                      variants={checkboxVariants}
                                      initial="unchecked"
                                      animate={isSelected ? "checked" : "unchecked"}
                                    >
                                      <FaCheck className="text-white text-xs" />
                                    </motion.div>
                                  </div>
                                  <div
                                    className={`flex-1 text-sm ${
                                      isSelected ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {brand}
                                  </div>
                                </motion.div>
                              )
                            })}
                            {filteredBrands.length === 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 py-2 text-center">
                                No hay marcas con ese nombre
                              </div>
                            )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Origen */}
                  {uniqueOrigins.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowOriginFilter(!showOriginFilter)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FaHome className="text-primary group-hover:scale-110 transition-transform" />
                          Origen
                        </span>
                        <FaChevronDown
                          className={`transition-transform text-gray-400 ${showOriginFilter ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {showOriginFilter && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 space-y-3 overflow-hidden"
                          >
                            <div className="relative">
                              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                              <input
                                type="text"
                                value={originQuery}
                                onChange={(e) => setOriginQuery(e.target.value)}
                                placeholder="Buscar origen..."
                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-1">
                              {filteredOrigins.map((origin) => {
                                const isSelected = selectedOrigins.includes(origin)

                                return (
                                  <motion.div
                                    key={origin}
                                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                    onClick={() => handleOriginToggle(origin)}
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="relative w-5 h-5 flex-shrink-0">
                                      <motion.div
                                        className="absolute inset-0 border-2 rounded"
                                        animate={{
                                          borderColor: isSelected ? "var(--primary)" : "rgb(209, 213, 219)"
                                        }}
                                        transition={{ duration: 0.2 }}
                                      />
                                      <motion.div
                                        className="absolute inset-0 bg-primary rounded flex items-center justify-center"
                                        variants={checkboxVariants}
                                        initial="unchecked"
                                        animate={isSelected ? "checked" : "unchecked"}
                                      >
                                        <FaCheck className="text-white text-xs" />
                                      </motion.div>
                                    </div>
                                    <div
                                      className={`flex-1 text-sm ${
                                        isSelected ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      {origin}
                                    </div>
                                  </motion.div>
                                )
                              })}
                              {filteredOrigins.length === 0 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 py-2 text-center">
                                  No hay orígenes con ese nombre
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Compatibilidad */}
                  <div>
                    <button
                      onClick={() => setShowCompatibilityFilter(!showCompatibilityFilter)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCar className="text-primary group-hover:scale-110 transition-transform" />
                        Compatibilidad
                      </span>
                      <FaChevronDown
                        className={`transition-transform text-gray-400 ${showCompatibilityFilter ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showCompatibilityFilter && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                              type="text"
                              value={compatQuery}
                              onChange={(e) => setCompatQuery(e.target.value)}
                              placeholder="Buscar compatibilidad..."
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Ej: Toyota Corolla 2010, Hilux 2.8, etc.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* SKU */}
                  <div>
                    <button
                      onClick={() => setShowSkuFilter(!showSkuFilter)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaTag className="text-primary group-hover:scale-110 transition-transform" />
                        SKU
                      </span>
                      <FaChevronDown
                        className={`transition-transform text-gray-400 ${showSkuFilter ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showSkuFilter && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                              type="text"
                              value={skuQuery}
                              onChange={(e) => setSkuQuery(e.target.value)}
                              placeholder="Buscar SKU..."
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Condición */}
                  <div>
                    <button
                      onClick={() => setShowConditionFilter(!showConditionFilter)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCheckCircle className="text-primary group-hover:scale-110 transition-transform" />
                        Estado
                      </span>
                      <FaChevronDown
                        className={`transition-transform text-gray-400 ${showConditionFilter ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showConditionFilter && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-1 overflow-hidden"
                        >
                          {[
                            { value: 'nuevo_original', label: 'Nuevo Original' },
                            { value: 'alternativo', label: 'Alternativo' },
                            { value: 'usado', label: 'Usado' }
                          ].map(({ value, label }) => {
                            const isSelected = selectedCondiciones.includes(value)

                            return (
                              <motion.div
                                key={value}
                                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                onClick={() => handleCondicionToggle(value)}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="relative w-5 h-5 flex-shrink-0">
                                  <motion.div
                                    className="absolute inset-0 border-2 rounded"
                                    animate={{
                                      borderColor: isSelected ? "var(--primary)" : "rgb(209, 213, 219)"
                                    }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  <motion.div
                                    className="absolute inset-0 bg-primary rounded flex items-center justify-center"
                                    variants={checkboxVariants}
                                    initial="unchecked"
                                    animate={isSelected ? "checked" : "unchecked"}
                                  >
                                    <FaCheck className="text-white text-xs" />
                                  </motion.div>
                                </div>
                                <div
                                  className={`flex-1 text-sm ${
                                    isSelected ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {label}
                                </div>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Contenido principal */}
          <div className="space-y-6">
            {/* Barra de herramientas mejorada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 dark:bg-gray-950/80 backdrop-blur-2xl rounded-[28px] p-4 md:p-6 shadow-[0_20px_50px_rgba(15,15,15,0.12)] border border-gray-200/60 dark:border-gray-800/60"
            >
              <div className="flex flex-col gap-4">
                {/* Primera fila: Filtros móvil + Búsqueda + Ordenar + Vista */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Botón filtros móvil */}
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-fv-gold text-white rounded-xl font-medium hover:shadow-xl transition-all"
                  >
                    <FaFilter />
                    <span>Filtros</span>
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Búsqueda */}
                  <div className="flex-1 min-w-[200px] relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-10 py-2.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>

                  {/* Ordenar */}
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-4 py-2.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm shadow-sm"
                  >
                    <option value="default">Más recientes primero</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="name_asc">Nombre: A-Z</option>
                    <option value="name_desc">Nombre: Z-A</option>
                  </select>

                  {/* Vista */}
                  <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-primary to-fv-gold text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      title="Vista en cuadrícula"
                    >
                      <FaThLarge />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-gradient-to-r from-primary to-fv-gold text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      title="Vista en lista"
                    >
                      <FaListUl />
                    </button>
                  </div>
                </div>

                {/* Segunda fila: Filtros activos */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Filtros activos:
                    </span>
                    {searchTerm && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaSearch className="text-xs" />
                        {searchTerm}
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </motion.span>
                    )}
                    {offerOnly && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaTag className="text-xs" />
                        Ofertas
                      </motion.span>
                    )}
                    {inStockOnly && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium"
                      >
                        <FaCheckCircle className="text-xs" />
                        Con stock
                      </motion.span>
                    )}
                    {orderOnly && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
                      >
                        <FaBox className="text-xs" />
                        Solo pedido
                      </motion.span>
                    )}
                    {(priceRange[0] > computedMinPrice || priceRange[1] < computedMaxPrice) && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaDollarSign className="text-xs" />
                        S/ {priceRange[0]} - {priceRange[1]}
                      </motion.span>
                    )}
                    {(computedMaxWeight > 0 && (weightRange[0] > computedMinWeight || weightRange[1] < computedMaxWeight)) && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaBox className="text-xs" />
                        {weightRange[0]}-{weightRange[1]} kg
                      </motion.span>
                    )}
                    {selectedBrands.map((brand) => (
                      <motion.span
                        key={brand}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaTag className="text-xs" />
                        {brand}
                      </motion.span>
                    ))}
                    {selectedOrigins.map((origin) => (
                      <motion.span
                        key={origin}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaHome className="text-xs" />
                        {origin}
                      </motion.span>
                    ))}
                    {compatQuery && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaCar className="text-xs" />
                        Compat: {compatQuery}
                      </motion.span>
                    )}
                    {skuQuery && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaTag className="text-xs" />
                        SKU: {skuQuery}
                      </motion.span>
                    )}
                    {selectedCondiciones.map((cond) => (
                      <motion.span
                        key={cond}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaCheckCircle className="text-xs" />
                        {cond === "nuevo_original" ? "Nuevo Original" : cond === "alternativo" ? "Alternativo" : "Usado"}
                      </motion.span>
                    ))}
                    {selectedDisponibilidades.map((disp) => (
                      <motion.span
                        key={disp}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <FaCheckCircle className="text-xs" />
                        {disp === "en_stock" ? "En stock" : disp === "en_oferta" ? "En oferta" : "Solo pedido"}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Tercera fila: Contador de productos */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Mostrando</span>{" "}
                    <span className="font-bold text-primary">
                      {filteredProducts.length}
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {filteredProducts.length === 1 ? "producto" : "productos"}
                    </span>
                  </div>
                  {totalPages > 1 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Página <span className="font-bold text-primary">{currentPage}</span> de{" "}
                      <span className="font-bold">{totalPages}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Grid de productos mejorado */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-white/95 dark:bg-gray-950/80 backdrop-blur-2xl rounded-[28px] p-8 shadow-[0_25px_70px_rgba(15,15,15,0.12)] border border-gray-200/60 dark:border-gray-800/60"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/20 rounded-3xl flex items-center justify-center">
                  <FaSearch className="text-4xl text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  No hay productos que coincidan con los filtros seleccionados. Intenta ajustar tu búsqueda.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-fv-gold text-white rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
                  >
                    <FaTimes />
                    Limpiar todos los filtros
                  </button>
                )}
              </motion.div>
            ) : (
              <>
                <div className="relative">
                <AnimatePresence mode="wait">
                  {viewMode === "grid" ? (
                    <motion.div
                      key="catalog-grid"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {paginatedProducts.map((product) => {
                        const discount = product.precio_de_oferta
                          ? Math.round(((Number(product.price) - Number(product.precio_de_oferta)) / Number(product.price)) * 100)
                          : 0

                        return (
                          <motion.div
                            key={product.id}
                            variants={cardLift}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover="hover"
                            transition={{
                              opacity: { duration: 0.3 },
                              scale: { duration: 0.3 }
                            }}
                            className="group bg-white/95 dark:bg-gray-950/85 backdrop-blur-2xl rounded-[24px] overflow-hidden shadow-[0_18px_40px_rgba(15,15,15,0.12)] border border-gray-200/60 dark:border-gray-800/60 transition-transform hover:-translate-y-1"
                          >
                            <div className="relative h-64 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <ProductImageCarousel
                                images={[
                                  product.imagen || "/LogoFVImport.png",
                                  ...(product.images?.sort((a, b) => a.order - b.order).map(img => img.image_path) || [])
                                ]}
                                productName={product.name}
                                onImageClick={() => setQuickViewProduct(product)}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 pointer-events-none" />

                              <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {product.precio_de_oferta && (
                                  <div className="bg-gradient-to-r from-red-500 to-fv-gold text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                    -{discount}% OFF
                                  </div>
                                )}
                                {product.stock <= 5 && product.stock > 0 && (
                                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    ¡Últimas {product.stock}!
                                  </div>
                                )}
                                {product.stock === 0 && (
                                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    Agotado
                                  </div>
                                )}
                              </div>

                              <button
                                className="absolute top-3 right-3 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full opacity-0 group-hover:opacity-100 hover:text-red-500 hover:scale-110 transition-all shadow-lg"
                                title="Agregar a favoritos"
                              >
                                <FaHeart className="text-sm" />
                              </button>
                            </div>

                            <div className="p-5">
                              <div className="text-xs text-primary font-semibold mb-2 flex items-center gap-1">
                                <FaLayerGroup className="text-xs" />
                                {product.category?.name || "Sin categoría"}
                              </div>

                              <Link href={`/producto/${product.id}`}>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                  {product.name}
                                </h3>
                              </Link>

                              <div className="flex items-baseline gap-2 mb-4">
                                {product.precio_de_oferta ? (
                                  <>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent">
                                      S/ {Number(product.precio_de_oferta).toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      S/ {Number(product.price).toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent">
                                    S/ {Number(product.price).toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {(product.marca || product.condicion || product.disponibilidad) && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {product.marca && (
                                    <span className="px-2 py-1 text-[10px] font-semibold rounded-full bg-primary/10 text-primary">
                                      Marca: {product.marca}
                                    </span>
                                  )}
                                  {product.condicion && (
                                    <span
                                      className={`px-2 py-1 text-[10px] font-semibold rounded-full ${
                                        product.condicion === "nuevo_original"
                                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                          : product.condicion === "alternativo"
                                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                      }`}
                                    >
                                      {product.condicion === "nuevo_original"
                                        ? "Nuevo Original"
                                        : product.condicion === "alternativo"
                                        ? "Alternativo"
                                        : "Usado"}
                                    </span>
                                  )}
                                  {product.disponibilidad && (
                                    <span className="px-2 py-1 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                      {product.disponibilidad === "en_stock"
                                        ? "En stock"
                                        : product.disponibilidad === "en_oferta"
                                        ? "En oferta"
                                        : "Solo pedido"}
                                    </span>
                                  )}
                                </div>
                              )}

                              {product.stock > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        product.stock > 10
                                          ? "bg-green-500"
                                          : product.stock > 5
                                          ? "bg-yellow-500"
                                          : "bg-orange-500"
                                      }`}
                                      style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {product.stock > 10 ? "Stock alto" : "Stock bajo"}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-4 pt-0 flex gap-2">
                              <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-fv-gold text-white rounded-xl font-medium hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                              >
                                <FaShoppingCart />
                                <span className="text-sm">Agregar</span>
                              </button>
                              <a
                                href={getWhatsAppLink(product)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 hover:scale-110 transition-all"
                                title="Consultar por WhatsApp"
                              >
                                <FaWhatsapp className="text-xl" />
                              </a>
                              <button
                                onClick={() => setQuickViewProduct(product)}
                                className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110 transition-all"
                                title="Vista rápida"
                              >
                                <FaEye className="text-xl" />
                              </button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="catalog-list"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {paginatedProducts.map((product) => {
                        const discount = product.precio_de_oferta
                          ? Math.round(((Number(product.price) - Number(product.precio_de_oferta)) / Number(product.price)) * 100)
                          : 0

                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            whileHover={{ scale: 1.01, boxShadow: "0 20px 30px rgba(0,0,0,0.15)" }}
                            transition={{
                              opacity: { duration: 0.3 },
                              x: { duration: 0.3 }
                            }}
                            className="flex flex-col sm:flex-row gap-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-800/50 group"
                          >
                            <div className="flex-shrink-0">
                              <button
                                onClick={() => setQuickViewProduct(product)}
                                className="relative w-full sm:w-40 h-40 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer group/image"
                                title="Click para vista rápida"
                              >
                                <img
                                  src={buildImageUrl(product.imagen) || "/LogoFVImport.png"}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                  <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                                    <FaExpand className="text-gray-700 dark:text-gray-300 text-base" />
                                  </div>
                                </div>
                                {product.precio_de_oferta && (
                                  <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-fv-gold text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                    -{discount}%
                                  </div>
                                )}
                                {product.images && product.images.length > 0 && (
                                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                                    <FaImage className="text-xs" />
                                    {product.images.length + 1}
                                  </div>
                                )}
                              </button>
                            </div>

                            <div className="flex-1 flex flex-col">
                              <div className="flex-1">
                                <div className="text-xs text-primary font-medium mb-1 flex items-center gap-1">
                                  <FaLayerGroup className="text-xs" />
                                  {product.category?.name || "Sin categoría"}
                                </div>
                                <Link href={`/producto/${product.id}`}>
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors">
                                    {product.name}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                  {product.description || "Sin descripción disponible"}
                                </p>
                                {(product.marca || product.origen || product.condicion || product.disponibilidad || product.peso || product.SKU) && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                                    {product.marca && (
                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">Marca:</span>
                                        <span className="font-medium">{product.marca}</span>
                                      </div>
                                    )}
                                    {product.origen && (
                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">Origen:</span>
                                        <span className="font-medium">{product.origen}</span>
                                      </div>
                                    )}
                                    {product.condicion && (
                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">Condición:</span>
                                        <span className="font-medium">
                                          {product.condicion === "nuevo_original"
                                            ? "Nuevo Original"
                                            : product.condicion === "alternativo"
                                            ? "Alternativo"
                                            : "Usado"}
                                        </span>
                                      </div>
                                    )}
                                    {product.disponibilidad && (
                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">Disponibilidad:</span>
                                        <span className="font-medium">
                                          {product.disponibilidad === "en_stock"
                                            ? "En stock"
                                            : product.disponibilidad === "en_oferta"
                                            ? "En oferta"
                                            : "Solo pedido"}
                                        </span>
                                      </div>
                                    )}
                                    {product.peso && (
                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">Peso:</span>
                                        <span className="font-medium">{product.peso} kg</span>
                                      </div>
                                    )}
                                    {product.compatibilidad && (
                                      <div className="sm:col-span-2 text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">Compatibilidad:</span>{" "}
                                        <span className="font-medium">{product.compatibilidad}</span>
                                      </div>
                                    )}
                                    {product.SKU && (
                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">SKU:</span>
                                        <span className="font-medium">{product.SKU}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="flex items-baseline gap-2 mb-3">
                                  {product.precio_de_oferta ? (
                                    <>
                                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent">
                                        S/ {Number(product.precio_de_oferta).toFixed(2)}
                                      </span>
                                      <span className="text-sm text-gray-500 line-through">
                                        S/ {Number(product.price).toFixed(2)}
                                      </span>
                                      <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded">
                                        ¡AHORRA S/ {(Number(product.price) - Number(product.precio_de_oferta)).toFixed(2)}!
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-fv-gold bg-clip-text text-transparent">
                                      S/ {Number(product.price).toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                {product.stock > 0 ? (
                                  <div className="flex items-center gap-2 text-sm">
                                    <FaCheckCircle className="text-green-500" />
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                      En stock ({product.stock} disponibles)
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-sm">
                                    <FaTimes className="text-red-500" />
                                    <span className="text-red-600 dark:text-red-400 font-medium">
                                      Agotado
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 mt-4">
                                <button
                                  onClick={() => addToCart(product)}
                                  disabled={product.stock === 0}
                                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-fv-gold text-white rounded-xl font-medium hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all text-sm"
                                >
                                  <FaShoppingCart />
                                  Agregar al carrito
                                </button>
                                <a
                                  href={getWhatsAppLink(product)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors text-sm"
                                >
                                  <FaWhatsapp />
                                  WhatsApp
                                </a>
                                <button
                                  onClick={() => setQuickViewProduct(product)}
                                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                                >
                                  <FaEye />
                                  Vista rápida
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
                {/* Paginación mejorada */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
                  >
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:scale-105 transition-all font-medium"
                    >
                      <FaChevronLeft className="text-sm" />
                      <span>Anterior</span>
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page
                        if (totalPages <= 5) {
                          page = i + 1
                        } else if (currentPage <= 3) {
                          page = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i
                        } else {
                          page = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-11 h-11 rounded-xl font-bold transition-all ${
                              currentPage === page
                                ? "bg-gradient-to-r from-primary to-fv-gold text-white shadow-xl scale-110"
                                : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary hover:scale-105"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:scale-105 transition-all font-medium"
                    >
                      <span>Siguiente</span>
                      <FaChevronRight className="text-sm" />
                    </button>
                  </motion.div>
                )}

                <div className="mt-10">
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
                        href="https://wa.me/5154221478"
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          getWhatsAppLink={getWhatsAppLink}
        />
      )}
    </div>
  )
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <Catalogo />
    </Suspense>
  )
}
