"use client"

import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { LanguageProvider } from "@/lib/language-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  )
}
