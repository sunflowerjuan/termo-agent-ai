"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Thermometer, User, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

function renderMarkdown(text: string) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let tableRows: string[][] = []
  let inTable = false
  let tableStartIndex = 0

  function flushTable(key: number) {
    if (tableRows.length < 2) return null
    const headers = tableRows[0]
    const dataRows = tableRows.slice(1).filter(
      (row) => !row.every((cell) => /^[-|:\s]+$/.test(cell))
    )
    return (
      <div key={`table-${key}`} className="overflow-x-auto my-2 -mx-1">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-2 py-1.5 text-left font-semibold border-b-2 border-border bg-secondary/50 whitespace-nowrap"
                >
                  {formatInlineMarkdown(h.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "" : "bg-secondary/30"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-2 py-1.5 border-b border-border/50 whitespace-nowrap">
                    {formatInlineMarkdown(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      if (!inTable) {
        inTable = true
        tableStartIndex = i
        tableRows = []
      }
      const cells = line.split("|").slice(1, -1).map((c) => c.trim())
      tableRows.push(cells)
      continue
    }

    if (inTable) {
      const tableEl = flushTable(tableStartIndex)
      if (tableEl) elements.push(tableEl)
      tableRows = []
      inTable = false
    }

    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />)
      continue
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="ml-4 list-disc">
          {formatInlineMarkdown(line.slice(2))}
        </li>
      )
      continue
    }

    elements.push(
      <p key={i} className="leading-relaxed">
        {formatInlineMarkdown(line)}
      </p>
    )
  }

  if (inTable) {
    const tableEl = flushTable(tableStartIndex)
    if (tableEl) elements.push(tableEl)
  }

  return elements
}

function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <strong key={match.index} className="font-semibold">
        {match[1]}
      </strong>
    )
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const { t } = useLanguage()
  const [showCopied, setShowCopied] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 1500)
    } catch {
      // fallback
      const el = document.createElement("textarea")
      el.value = message.content
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 1500)
    }
  }, [message.content])

  const handleTouchStart = useCallback(() => {
    isLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true
      handleCopy()
    }, 500)
  }, [handleCopy])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return (
    <div className={cn("flex gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 border border-primary/20 shrink-0 mt-1">
          <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
        </div>
      )}

      <div className="relative">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          className={cn(
            "max-w-[80vw] sm:max-w-[520px] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm select-text",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-card border border-border text-card-foreground rounded-bl-md"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="space-y-0.5">{renderMarkdown(message.content)}</div>
          )}
        </div>

        {showCopied && (
          <div className={cn(
            "absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-foreground text-background shadow-md animate-in fade-in zoom-in-95 duration-150",
          )}>
            <Check className="w-3 h-3" />
            {t("copied")}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-secondary border border-border shrink-0 mt-1">
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
