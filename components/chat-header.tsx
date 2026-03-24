"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/language-context";
import {
  RotateCcw,
  Thermometer,
  X,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
export function ChatHeader({ onNewChat }: { onNewChat: () => void }) {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [settingsOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <header className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 border-b border-border bg-card z-20 relative">
        <button
          type="button"
          onClick={() => setSettingsOpen((prev) => !prev)}
          className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer hover:opacity-80 active:scale-[0.98] transition-all"
          aria-label={t("settings")}
        >
          <div className="flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="TERMO-AGENT" width={50} height={50} />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1">
              <h1 className="text-sm sm:text-base font-semibold text-card-foreground tracking-tight font-mono truncate">
                {t("title")}
              </h1>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-muted-foreground transition-transform",
                  settingsOpen && "rotate-180",
                )}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed truncate">
              {t("subtitle")}{" "}
              <span className="hidden sm:inline">
                {"·"} {t("university")}
              </span>
            </p>
          </div>
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className="text-muted-foreground hover:text-card-foreground shrink-0"
          aria-label={t("newChat")}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </header>

      {/* Settings Panel */}
      <div
        className={cn(
          "absolute left-0 right-0 top-full z-30 bg-card border-b border-border shadow-lg transition-all duration-200 ease-out overflow-hidden",
          settingsOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="px-4 py-4 space-y-5">
          {/* Close button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("settingsTitle")}
            </span>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={t("close")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              {t("language")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={cn(
                  "flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border",
                  language === "es"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary text-secondary-foreground border-border hover:bg-accent",
                )}
              >
                {"ES - Espanol"}
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border",
                  language === "en"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary text-secondary-foreground border-border hover:bg-accent",
                )}
              >
                EN - English
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              {t("theme")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border",
                  theme === "light"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary text-secondary-foreground border-border hover:bg-accent",
                )}
              >
                <Sun className="w-4 h-4" />
                {t("light")}
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border",
                  theme === "dark"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary text-secondary-foreground border-border hover:bg-accent",
                )}
              >
                <Moon className="w-4 h-4" />
                {t("dark")}
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border",
                  theme === "system"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary text-secondary-foreground border-border hover:bg-accent",
                )}
              >
                <Monitor className="w-4 h-4" />
                {t("system")}
              </button>
            </div>
          </div>

          {/* Author info */}
          <div className="pt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
              {t("author")} {" · "} {t("university")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
