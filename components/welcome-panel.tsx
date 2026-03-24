"use client";

import { useLanguage } from "@/lib/language-context";
import { Thermometer, FlaskConical, Gauge, Table2 } from "lucide-react";
import Image from "next/image";

export function WelcomePanel({
  onSuggestionClick,
}: {
  onSuggestionClick: (q: string) => void;
}) {
  const { t } = useLanguage();

  const features = [
    { icon: Gauge, text: t("feature1") },
    { icon: FlaskConical, text: t("feature2") },
    { icon: Table2, text: t("feature3") },
    { icon: Thermometer, text: t("feature4") },
  ];

  const suggestions = [
    t("suggestion1"),
    t("suggestion2"),
    t("suggestion3"),
    t("suggestion4"),
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-3 py-6 sm:px-4 sm:py-8">
      <div className="w-full max-w-lg space-y-5 sm:space-y-6">
        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
          <div className="flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="TERMO-AGENT" width={70} height={70} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground font-mono tracking-tight">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-md">
              {t("welcome")}
            </p>
            <div className="mt-2 flex flex-col items-center gap-0.5">
              <p className="text-xs text-muted-foreground/80 font-medium">
                {t("author")}
              </p>
              <p className="text-xs text-primary/70 font-medium">
                {t("university")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-card border border-border"
            >
              <feature.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-xs sm:text-sm text-card-foreground leading-relaxed">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {t("suggestedQuestions")}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick(suggestion)}
                className="text-left text-xs sm:text-sm px-3 py-2 sm:py-2.5 rounded-lg border border-border bg-card text-card-foreground hover:bg-secondary hover:border-primary/30 active:scale-[0.98] transition-all leading-relaxed cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
