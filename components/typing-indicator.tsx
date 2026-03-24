"use client"

import { useLanguage } from "@/lib/language-context"
import { Thermometer } from "lucide-react"

export function TypingIndicator() {
  const { t } = useLanguage()

  return (
    <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2">
      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
        <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-xs text-muted-foreground ml-1">{t("thinking")}</span>
        </div>
      </div>
    </div>
  )
}
