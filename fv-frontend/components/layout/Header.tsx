"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, Menu, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { productService } from "@/services/api"
import { IMAGE_BASE_URL } from "@/config/constants"
import { motion, AnimatePresence } from "framer-motion"
import CartDropdown from "@/components/layout/CartDropdown"

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

interface Product {
  id: number;
  name: string;
  imagen?: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [adminClickCount, setAdminClickCount] = useState(0)
  const [showAdminNotification, setShowAdminNotification] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const router = useRouter()
  const pathname = usePathname()
  // Note: useSearchParams removed - not needed for header functionality

  // Detectar scroll para efecto glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Ocultar header al bajar y mostrar al subir
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current
      const shouldHide = currentY > 140 && delta > 8
      const shouldShow = delta < -6 || currentY < 40

      if (shouldHide && !isHidden) {
        setIsHidden(true)
      } else if (shouldShow && isHidden) {
        setIsHidden(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHidden])

  // Cerrar menú móvil al cambiar de ubicación
  useEffect(() => {
    setIsMenuOpen(false)
    setShowSuggestions(false)
  }, [pathname])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Cargar productos para autocompletado
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        const productsData = response.data.data || response.data || [];
        setProducts(productsData);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, [])

  // Filtrar productos según la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setFilteredProducts([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products])

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const computeCartCount = () => {
    try {
      const saved = localStorage.getItem('catalogo_cart_items')
      if (!saved) {
        setCartCount(0)
        return
      }
      const arr = JSON.parse(saved) as Array<{ quantity: number }>
      const total = arr.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)
      setCartCount(total)
    } catch {
      setCartCount(0)
    }
  }

  useEffect(() => {
    computeCartCount()
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === 'catalogo_cart_items') computeCartCount()
    }
    const onFocus = () => computeCartCount()
    const onCustom = () => computeCartCount()

    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    window.addEventListener('catalogo_cart_items_updated', onCustom as EventListener)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('catalogo_cart_items_updated', onCustom as EventListener)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const navigationItems = [
    { name: "Inicio", to: "/" },
    { name: "Acerca de", to: "/acerca-de" },
    { name: "Catálogo", to: "/catalogo" },
    { name: "Servicios", to: "/servicios" },
    { name: "Importación y Seguimiento", to: "/solicitud-importacion" },
    { name: "Testimonios", to: "/social" },
    { name: "Contacto", to: "/contacto" },
  ]

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ y: -120 }}
        animate={{ y: isHidden ? -120 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-500 relative header-racing-surface ${
          scrolled
            ? "bg-white/90 dark:bg-fv-black/95 backdrop-blur-2xl shadow-2xl"
            : "bg-white/95 dark:bg-fv-black/98 backdrop-blur-xl shadow-xl"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Accent rails */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* NIVEL 1: Logo + Búsqueda + User/Cart - TODO EN UNA LÍNEA */}
          <div className="flex items-center justify-between gap-3 py-3 lg:py-4 relative">

            {/* Mobile: Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all border border-primary/20"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5 text-primary" />
                  ) : (
                    <Menu className="h-5 w-5 text-primary" />
                  )}
                </motion.div>
              </motion.button>
            </div>

            {/* LOGO - Grande pero compacto */}
            <Link href="/" className="flex-shrink-0 group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-fv-gold/30 to-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>

                <img
                  src="/logo.png"
                  alt="FV Auto Importaciones"
                  className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto relative z-10 transition-all duration-300 drop-shadow-[0_0_20px_rgba(201,169,97,0.25)] group-hover:drop-shadow-[0_0_30px_rgba(201,169,97,0.4)]"
                />

                {/* Racing dot animation */}
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </Link>

            {/* BUSCADOR - Centrado y compacto (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-6">
              <motion.div
                className="relative w-full"
                ref={searchRef}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Buscar piezas, marcas, accesorios..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
                        setShowSuggestions(false);
                      }
                    }}
                    className="w-full pl-11 pr-12 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50/80 dark:bg-fv-gray/80 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all shadow-sm hover:shadow-md font-medium text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-fv-gold hover:from-primary/90 hover:to-fv-gold/90 rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
                        setShowSuggestions(false);
                      }
                    }}
                  >
                    <Search className="h-3.5 w-3.5 text-white" />
                  </motion.button>
                </div>

                {/* Sugerencias */}
                <AnimatePresence>
                  {showSuggestions && filteredProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-full mt-2 bg-white/98 dark:bg-fv-gray/98 backdrop-blur-xl border-2 border-primary/20 dark:border-primary/30 rounded-xl shadow-2xl max-h-80 overflow-auto"
                    >
                      <div className="p-1.5">
                        {filteredProducts.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <Link
                              href={`/producto/${product.id}`}
                              className="flex items-center px-3 py-2.5 hover:bg-gradient-to-r hover:from-primary/10 hover:to-fv-gold/10 rounded-lg transition-all group border-b border-gray-100 dark:border-gray-800 last:border-0"
                              onClick={() => {
                                setSearchQuery(product.name);
                                setShowSuggestions(false);
                              }}
                            >
                              {product.imagen && (
                                <div className="w-10 h-10 mr-2.5 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 ring-1 ring-primary/10">
                                  <img
                                    src={buildImageUrl(product.imagen)}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "/LogoFVImport.png"
                                    }}
                                  />
                                </div>
                              )}
                              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{product.name}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* USER & CART - Derecha (Desktop) */}
            <motion.div
              className="hidden md:flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-lg bg-gray-100 dark:bg-fv-gray hover:bg-primary/10 dark:hover:bg-primary/20 transition-all border border-gray-200 dark:border-gray-700 hover:border-primary/30"
                  onClick={() => {
                    if (adminClickCount === 0) {
                      setShowAdminNotification(true);
                      setAdminClickCount(1);
                      setTimeout(() => setShowAdminNotification(false), 3000);
                    } else {
                      const token = localStorage.getItem('auth_token');
                      if (token) {
                        router.push('/admin');
                      } else {
                        router.push('/login');
                      }
                    }
                  }}
                >
                  <User className="h-4.5 w-4.5 text-gray-700 dark:text-gray-300" />
                </motion.button>
                <AnimatePresence>
                  {showAdminNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute top-full mt-2 right-0 bg-white dark:bg-fv-gray border-2 border-primary/30 rounded-lg shadow-2xl p-2.5 z-50 w-36 text-center whitespace-nowrap"
                    >
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">Solo para admin</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <CartDropdown cartCount={cartCount} onCartUpdate={computeCartCount} />
            </motion.div>

            {/* Mobile: Cart */}
            <div className="md:hidden">
              <CartDropdown cartCount={cartCount} onCartUpdate={computeCartCount} />
            </div>
          </div>

          {/* NIVEL 2: Navegación - Compacta */}
          <div className="hidden md:block border-t border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
            <nav className="flex items-center justify-center gap-1 py-2.5">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                >
                  <Link
                    href={item.to}
                    className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-300 relative group uppercase ${
                      pathname === item.to
                        ? "text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {pathname === item.to && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-fv-gold/10 to-primary/10 rounded-lg border border-primary/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-fv-gold group-hover:w-3/4 transition-all duration-300 rounded-full" />
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white/98 dark:bg-fv-black/98 backdrop-blur-2xl shadow-2xl border-r-2 border-primary/30"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <img src="/logo.png" alt="FV Auto Importaciones" className="h-12 w-auto drop-shadow-md" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-primary/20"
                >
                  <X className="h-5 w-5 text-primary" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Buscar piezas..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
                        setIsMenuOpen(false);
                        setShowSuggestions(false);
                      }
                    }}
                    className="w-full pl-10 pr-11 py-2.5 border-2 border-primary/20 dark:border-primary/30 rounded-full bg-gray-50 dark:bg-fv-gray font-medium text-sm"
                  />
                  <button
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-fv-gold rounded-full p-1.5"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        setIsMenuOpen(false);
                        router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
                        setShowSuggestions(false);
                      }
                    }}
                  >
                    <Search className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      href={item.to}
                      className={`flex items-center justify-between py-3 px-4 rounded-lg transition-all font-bold uppercase tracking-wide text-sm ${
                        pathname === item.to
                          ? "bg-gradient-to-r from-primary/20 to-fv-gold/20 text-primary shadow-sm border border-primary/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <button
                  onClick={() => {
                    if (adminClickCount === 0) {
                      setShowAdminNotification(true);
                      setAdminClickCount(1);
                      setTimeout(() => setShowAdminNotification(false), 3000);
                    } else {
                      const token = localStorage.getItem('auth_token');
                      if (token) {
                        router.push('/admin');
                      } else {
                        router.push('/login');
                      }
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-primary/10 to-fv-gold/10 hover:from-primary/20 hover:to-fv-gold/20 rounded-lg transition-all border border-primary/30 font-bold text-sm"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-gray-700 dark:text-gray-300 uppercase tracking-wide">Mi Cuenta</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
