"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "es" | "en";

type Translations = {
  [key: string]: { es: string; en: string };
};

export const translations: Translations = {
  title: {
    es: "TERMO-AGENT",
    en: "TERMO-AGENT",
  },
  subtitle: {
    es: "Asistente de Tablas Termodinamicas",
    en: "Thermodynamic Tables Assistant",
  },
  placeholder: {
    es: "Pregunta sobre tablas termodinamicas...",
    en: "Ask about thermodynamic tables...",
  },
  send: {
    es: "Enviar",
    en: "Send",
  },
  welcome: {
    es: "Hola! Soy TERMO-AGENT, tu asistente especializado en tablas termodinamicas. Puedo ayudarte con:",
    en: "Hello! I'm TERMO-AGENT, your assistant specialized in thermodynamic tables. I can help you with:",
  },
  feature1: {
    es: "Tablas de vapor de agua (saturado y sobrecalentado)",
    en: "Steam tables (saturated and superheated)",
  },
  feature2: {
    es: "Propiedades de refrigerantes (R-134a, R-22, etc.)",
    en: "Refrigerant properties (R-134a, R-22, etc.)",
  },
  feature3: {
    es: "Tablas de gas ideal (aire, N2, O2, etc.)",
    en: "Ideal gas tables (air, N2, O2, etc.)",
  },
  feature4: {
    es: "Interpolacion de datos termodinamicos",
    en: "Thermodynamic data interpolation",
  },
  thinking: {
    es: "Pensando...",
    en: "Thinking...",
  },
  settings: {
    es: "Configuracion",
    en: "Settings",
  },
  language: {
    es: "Idioma",
    en: "Language",
  },
  theme: {
    es: "Tema",
    en: "Theme",
  },
  light: {
    es: "Claro",
    en: "Light",
  },
  dark: {
    es: "Oscuro",
    en: "Dark",
  },
  system: {
    es: "Sistema",
    en: "System",
  },
  newChat: {
    es: "Nueva conversacion",
    en: "New conversation",
  },
  suggestedQuestions: {
    es: "Preguntas sugeridas",
    en: "Suggested questions",
  },
  suggestion1: {
    es: "Cual es la entalpia del agua a 100°C y 101.325 kPa?",
    en: "What is the enthalpy of water at 100°C and 101.325 kPa?",
  },
  suggestion2: {
    es: "Propiedades del R-134a saturado a -20°C",
    en: "Properties of saturated R-134a at -20°C",
  },
  suggestion3: {
    es: "Interpola la entropia del vapor a 350 kPa y 200°C",
    en: "Interpolate the entropy of steam at 350 kPa and 200°C",
  },
  suggestion4: {
    es: "Energia interna del aire a 500 K",
    en: "Internal energy of air at 500 K",
  },
  onlyThermo: {
    es: "Solo respondo preguntas relacionadas con tablas termodinamicas.",
    en: "I only answer questions related to thermodynamic tables.",
  },
  author: {
    es: "Concepto Diseñado por Sara Sofia Vargas Sanabria",
    en: "Make by Sara Sofia Vargas Sanabria",
  },
  university: {
    es: "Universidad Industrial de Santander (UIS)",
    en: "Universidad Industrial de Santander (UIS)",
  },
  greeting: {
    es: "Hola! Soy TERMO-AGENT, tu asistente especializado en tablas termodinamicas. Fui desarrollada por Sara Sofia Vargas Sanabria para la Universidad Industrial de Santander (UIS). Estoy aqui para ayudarte con consultas de propiedades termodinamicas. Que necesitas saber?",
    en: "Hello! I'm TERMO-AGENT, your assistant specialized in thermodynamic tables. I was developed by Sara Sofia Vargas Sanabria for Universidad Industrial de Santander (UIS). I'm here to help you with thermodynamic property lookups. What do you need to know?",
  },
  disclaimer: {
    es: "TERMO-AGENT puede presentar errores. Verifica la informacion con tus fuentes oficiales.",
    en: "TERMO-AGENT may present errors. Verify information with your official sources.",
  },
  copied: {
    es: "Copiado!",
    en: "Copied!",
  },
  settingsTitle: {
    es: "Configuracion",
    en: "Settings",
  },
  close: {
    es: "Cerrar",
    en: "Close",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
