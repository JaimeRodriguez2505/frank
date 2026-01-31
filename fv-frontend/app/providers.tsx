'use client'

import { ThemeProvider } from "@/contexts/ThemeContext"
import { StyledComponentsRegistry } from "./registry"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ScrollProgress } from "@/components/ui/ScrollProgress"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <ScrollProgress />
        {children}
        <ToastContainer position="bottom-right" theme="colored" />
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}
