"use client"

import Link from "next/link"

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl space-y-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Error al cargar el producto</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{error?.message || "Error desconocido"}</p>
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold"
          >
            Reintentar
          </button>
          <Link
            href="/catalogo"
            className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-semibold"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

