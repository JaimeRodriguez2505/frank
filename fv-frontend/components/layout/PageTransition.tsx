import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wrapper para transiciones entre páginas
 * Aplica animaciones suaves al cambiar de ruta
 *
 * Características:
 * - Fade + slide sutil en entrada/salida
 * - AnimatePresence para transiciones suaves
 * - Detecta cambios de ruta automáticamente
 * - Easing curve tipo Apple
 * - Respeta prefers-reduced-motion
 *
 * @example
 * // En App.tsx o router principal
 * <PageTransition>
 *   <Routes>
 *     <Route path="/" element={<Home />} />
 *   </Routes>
 * </PageTransition>
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="relative"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
