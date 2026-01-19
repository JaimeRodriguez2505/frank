import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa"
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "#",
      color: "hover:text-fv-gold"
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      url: "#",
      color: "hover:text-fv-gold"
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: "https://wa.me/51XXXXXXXXX?text=Hola%2C%20me%20gustar%C3%ADa%20consultar%20sobre%20piezas%20y%20accesorios",
      color: "hover:text-green-500"
    }
  ]

  const quickLinks = [
    { name: "Inicio", to: "/" },
    { name: "Catálogo", to: "/catalogo" },
    { name: "Acerca de", to: "/acerca-de" },
    { name: "Libro de reclamaciones", to: "/libro-reclamaciones" },
    { name: "Testimonios", to: "/social" }
  ]

  const categories = [
    { name: "Repuestos", to: "/catalogo?categoria=repuestos" },
    { name: "Tunning", to: "/catalogo?categoria=tunning" },
    { name: "Accesorios", to: "/catalogo?categoria=accesorios" },
    { name: "Racing", to: "/catalogo?categoria=racing" }
  ]

  const contactInfo = [
    { icon: MdPhone, text: "+51 XXX XXX XXX", href: "tel:+51XXXXXXXXX", color: "text-primary" },
    { icon: MdEmail, text: "contacto@fvautoimportaciones.com", href: "mailto:contacto@fvautoimportaciones.com", color: "text-primary" },
    { icon: MdLocationOn, text: "Lima, Perú", href: null, color: "text-primary" }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black border-t border-gray-200 dark:border-gray-800 mt-auto w-full overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-fv-black rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fv-gold rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Logo & Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center mb-5">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src="/logo.png"
                  alt="FV Auto Importaciones"
                  className="h-20 w-auto object-contain filter drop-shadow-lg"
                />
              </motion.div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Piezas de alto rendimiento para tu pasión automotriz 🏁
            </p>

            {/* Social Media Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 500, damping: 20 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 ${social.color} transition-all shadow-sm hover:shadow-md`}
                  aria-label={social.name}
                >
                  <social.icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 relative inline-block">
              Enlaces Rápidos
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-fv-gold to-fv-gold transform scale-x-50 origin-left"></span>
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    href={link.to}
                    className={`block text-sm font-medium transition-all hover:translate-x-2 ${
                      pathname === link.to
                        ? "text-primary font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 relative inline-block">
              Categorías
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-fv-gold to-fv-gold transform scale-x-50 origin-left"></span>
            </h3>
            <nav className="space-y-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    href={category.to}
                    className={`block text-sm font-medium transition-all hover:translate-x-2 ${
                      pathname === category.to || pathname.startsWith(category.to.split('?')[0])
                        ? "text-primary font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                    }`}
                  >
                    {category.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 relative inline-block">
              Contacto
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-fv-gold to-fv-gold transform scale-x-50 origin-left"></span>
            </h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-start group"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-fv-gold/10 to-fv-gold/10 flex items-center justify-center ${info.color} group-hover:scale-110 transition-transform`}>
                    <info.icon className="text-lg" />
                  </div>
                  <div className="ml-3">
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                      >
                        {info.text}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-400">{info.text}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white dark:bg-gray-900 px-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="h-5 w-5 text-primary fill-current" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} FV Auto Importaciones. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Desarrollado con <span className="text-primary">❤</span> por Tukituki Solutions SAC
          </p>
        </motion.div>
      </div>

      {/* Decorative wave at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-fv-gold via-fv-gold to-fv-gold"></div>
    </footer>
  )
}

export default Footer
