"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useLanguage } from "@/lib/language-context"
import { ChatHeader } from "./chat-header"
import { WelcomePanel } from "./welcome-panel"
import { MessageBubble, type Message } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { ChatInput } from "./chat-input"
import { ScrollArea } from "@/components/ui/scroll-area"

const THERMO_RESPONSES_ES: Record<string, string> = {
  entalpia: `A 100°C y 101.325 kPa (presion atmosferica), el agua se encuentra en estado de saturacion:

**Propiedades del agua saturada a 100°C:**
- Temperatura: T = 100°C
- Presion: P = 101.325 kPa
- Entalpia liquido saturado: hf = 419.04 kJ/kg
- Entalpia vapor saturado: hg = 2676.1 kJ/kg
- Entalpia de vaporizacion: hfg = 2257.0 kJ/kg

Fuente: Tabla A-4, Agua saturada (tabla de temperaturas)`,

  "r-134a": `**Propiedades del R-134a saturado a -20°C:**

| Propiedad | Liquido (f) | Vapor (g) |
|-----------|-------------|-----------|
| Presion | 132.73 kPa | 132.73 kPa |
| Volumen esp. | 0.0007362 m³/kg | 0.14739 m³/kg |
| Entalpia | 25.49 kJ/kg | 238.41 kJ/kg |
| Entropia | 0.1030 kJ/(kg·K) | 0.9370 kJ/(kg·K) |

Fuente: Tabla A-11, R-134a saturado`,

  entropia: `**Interpolacion de la entropia del vapor sobrecalentado a 350 kPa y 200°C:**

Datos de la tabla A-6 (Vapor de agua sobrecalentado):
- A 300 kPa, 200°C: s = 7.3115 kJ/(kg·K)
- A 400 kPa, 200°C: s = 7.1706 kJ/(kg·K)

Interpolacion lineal a 350 kPa:
s = 7.3115 + (350 - 300)/(400 - 300) × (7.1706 - 7.3115)
s = 7.3115 + 0.5 × (-0.1409)
**s = 7.2411 kJ/(kg·K)**

Fuente: Tabla A-6, Vapor de agua sobrecalentado`,

  energia: `**Energia interna del aire como gas ideal a 500 K:**

De la Tabla A-17 (Propiedades del aire como gas ideal):
- Temperatura: T = 500 K
- Energia interna: **u = 359.49 kJ/kg**
- Entalpia: h = 503.02 kJ/kg
- Presion relativa: Pr = 8.411
- Volumen relativo: vr = 170.6

Fuente: Tabla A-17, Propiedades del aire como gas ideal`,
}

const THERMO_RESPONSES_EN: Record<string, string> = {
  enthalpy: `At 100°C and 101.325 kPa (atmospheric pressure), water is in a saturation state:

**Saturated water properties at 100°C:**
- Temperature: T = 100°C
- Pressure: P = 101.325 kPa
- Saturated liquid enthalpy: hf = 419.04 kJ/kg
- Saturated vapor enthalpy: hg = 2676.1 kJ/kg
- Enthalpy of vaporization: hfg = 2257.0 kJ/kg

Source: Table A-4, Saturated water (temperature table)`,

  "r-134a": `**Saturated R-134a properties at -20°C:**

| Property | Liquid (f) | Vapor (g) |
|----------|------------|-----------|
| Pressure | 132.73 kPa | 132.73 kPa |
| Specific vol. | 0.0007362 m³/kg | 0.14739 m³/kg |
| Enthalpy | 25.49 kJ/kg | 238.41 kJ/kg |
| Entropy | 0.1030 kJ/(kg·K) | 0.9370 kJ/(kg·K) |

Source: Table A-11, Saturated R-134a`,

  entropy: `**Interpolation of superheated steam entropy at 350 kPa and 200°C:**

Data from Table A-6 (Superheated water vapor):
- At 300 kPa, 200°C: s = 7.3115 kJ/(kg·K)
- At 400 kPa, 200°C: s = 7.1706 kJ/(kg·K)

Linear interpolation at 350 kPa:
s = 7.3115 + (350 - 300)/(400 - 300) × (7.1706 - 7.3115)
s = 7.3115 + 0.5 × (-0.1409)
**s = 7.2411 kJ/(kg·K)**

Source: Table A-6, Superheated water vapor`,

  energy: `**Internal energy of air as an ideal gas at 500 K:**

From Table A-17 (Ideal gas properties of air):
- Temperature: T = 500 K
- Internal energy: **u = 359.49 kJ/kg**
- Enthalpy: h = 503.02 kJ/kg
- Relative pressure: Pr = 8.411
- Relative volume: vr = 170.6

Source: Table A-17, Ideal gas properties of air`,
}

const GREETING_PATTERNS = [
  "hola", "hello", "hi", "hey", "buenos dias", "buenas tardes", "buenas noches",
  "good morning", "good afternoon", "good evening", "saludos", "que tal",
  "como estas", "how are you", "greetings", "sup", "yo", "ey", "buenas",
]

function getResponse(message: string, lang: "es" | "en", t: (key: string) => string): string {
  const lower = message.toLowerCase()

  if (GREETING_PATTERNS.some((g) => lower.includes(g))) {
    return t("greeting")
  }

  if (lang === "es") {
    if (lower.includes("entalpia") || lower.includes("100")) return THERMO_RESPONSES_ES.entalpia
    if (lower.includes("r-134a") || lower.includes("refrigerante")) return THERMO_RESPONSES_ES["r-134a"]
    if (lower.includes("entropia") || lower.includes("interpola")) return THERMO_RESPONSES_ES.entropia
    if (lower.includes("energia") || lower.includes("500 k") || lower.includes("aire")) return THERMO_RESPONSES_ES.energia

    if (
      lower.includes("vapor") || lower.includes("agua") || lower.includes("presion") ||
      lower.includes("temperatura") || lower.includes("termodinam") || lower.includes("tabla") ||
      lower.includes("saturad") || lower.includes("sobrecalentado") || lower.includes("gas ideal") ||
      lower.includes("volumen") || lower.includes("calor") || lower.includes("kpa") ||
      lower.includes("mpa") || lower.includes("kj") || lower.includes("°c") || lower.includes("kelvin")
    ) {
      return `Para responder tu pregunta con precision, necesitaria que me proporciones los datos especificos (temperatura, presion, sustancia) para que pueda consultar la tabla termodinamica correspondiente.

Las tablas disponibles incluyen:
- **Tabla A-4/A-5**: Agua saturada (por temperatura y presion)
- **Tabla A-6**: Vapor de agua sobrecalentado
- **Tabla A-7**: Agua comprimida
- **Tabla A-11/A-12**: R-134a saturado
- **Tabla A-13**: R-134a sobrecalentado
- **Tabla A-17**: Propiedades del aire como gas ideal

Por favor, especifica la sustancia y las condiciones de estado.`
    }

    return `Lo siento, solo puedo responder preguntas relacionadas con **tablas termodinamicas**. Puedo ayudarte con:

- Tablas de vapor de agua (saturado y sobrecalentado)
- Propiedades de refrigerantes (R-134a, R-22)
- Tablas de gas ideal (aire, N2, O2)
- Interpolacion de datos termodinamicos

Por favor, reformula tu pregunta en el contexto de tablas termodinamicas.`
  }

  // English
  if (lower.includes("enthalpy") || lower.includes("100°c") || lower.includes("100 c")) return THERMO_RESPONSES_EN.enthalpy
  if (lower.includes("r-134a") || lower.includes("refrigerant")) return THERMO_RESPONSES_EN["r-134a"]
  if (lower.includes("entropy") || lower.includes("interpolat")) return THERMO_RESPONSES_EN.entropy
  if (lower.includes("energy") || lower.includes("500 k") || lower.includes("air")) return THERMO_RESPONSES_EN.energy

  if (
    lower.includes("steam") || lower.includes("water") || lower.includes("pressure") ||
    lower.includes("temperature") || lower.includes("thermodyn") || lower.includes("table") ||
    lower.includes("saturated") || lower.includes("superheated") || lower.includes("ideal gas") ||
    lower.includes("volume") || lower.includes("heat") || lower.includes("kpa") ||
    lower.includes("mpa") || lower.includes("kj") || lower.includes("°c") || lower.includes("kelvin")
  ) {
    return `To answer your question precisely, I would need you to provide the specific data (temperature, pressure, substance) so I can look up the corresponding thermodynamic table.

Available tables include:
- **Table A-4/A-5**: Saturated water (by temperature and pressure)
- **Table A-6**: Superheated water vapor
- **Table A-7**: Compressed liquid water
- **Table A-11/A-12**: Saturated R-134a
- **Table A-13**: Superheated R-134a
- **Table A-17**: Ideal gas properties of air

Please specify the substance and state conditions.`
  }

  return `I'm sorry, I can only answer questions related to **thermodynamic tables**. I can help you with:

- Steam tables (saturated and superheated)
- Refrigerant properties (R-134a, R-22)
- Ideal gas tables (air, N2, O2)
- Thermodynamic data interpolation

Please rephrase your question in the context of thermodynamic tables.`
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const { language, t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSend = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const response = getResponse(content, language, t)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1200 + Math.random() * 800)
  }, [language, t])

  const handleNewChat = useCallback(() => {
    setMessages([])
    setIsTyping(false)
  }, [])

  return (
    <div className="flex flex-col h-dvh bg-background">
      <ChatHeader onNewChat={handleNewChat} />

      <div className="flex-1 min-h-0">
        {messages.length === 0 ? (
          <ScrollArea className="h-full">
            <WelcomePanel onSuggestionClick={handleSend} />
          </ScrollArea>
        ) : (
          <ScrollArea ref={scrollRef} className="h-full">
            <div className="py-3 sm:py-4 space-y-0.5 sm:space-y-1 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}
