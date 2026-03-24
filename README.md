# TERMO-AGENT — Thermodynamic Tables AI Assistant

![logo](public/logo.png)

TERMO-AGENT es un agente de inteligencia artificial especializado en **tablas termodinámicas**, capaz de responder consultas técnicas con precisión, utilizando datos provenientes de tablas reales y citando las fuentes correspondientes.

## Características

- Consultas sobre tablas termodinámicas
- Interpolación automática de datos
- Respuestas con cita de fuente
- Interfaz moderna tipo chat
- Multi-idioma (Español / Inglés)
- Tema claro y oscuro

## Stack Tecnológico

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- DeepSeek API
- LangChain (próximamente)
- RAG (Retrieval Augmented Generation)

## Arquitectura

```
┌─────────────────────────────┐
│        Next.js Frontend     │
│ (Chat UI - React + Tailwind)│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        API Routes (Next.js) │
│         /api/chat           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        Agent Layer          │
│      (LangChain Agent)      │
└───────┬─────────┬───────────┘
        │         │
        │         │
        ▼         ▼
┌─────────────┐ ┌──────────────────┐
│ DeepSeek LLM│ │  RAG Retriever   │
│             │ │                  │
└──────┬──────┘ └────────┬─────────┘
       │                 │
       │                 ▼
       │        ┌──────────────────┐
       │        │ Vector Database  │
       │        │ (Chroma / Local) │
       │        └────────┬─────────┘
       │                 │
       ▼                 ▼
┌────────────────────────────────┐
│   PDF Tablas Termodinámicas    │
│ (Vapor, Refrigerantes, Gas)    │
└────────────────────────────────┘
```

## Estructura del Proyecto

```
app/
components/
lib/
public/
styles/
```

## Instalación

Clonar repositorio:

```
git clone https://github.com/tu-usuario/termo-agent.git
```

Entrar al proyecto:

```
cd termo-agent
```

Instalar dependencias:

```
npm install
```

Crear archivo `.env.local`

```
DEEPSEEK_API_KEY=tu_api_key
```

Ejecutar proyecto:

```
npm run dev
```

## Roadmap

- Integración DeepSeek
- Implementación RAG
- Soporte para múltiples PDFs
- Interpolación automática
- Soporte multi-modelo
- Exportación de resultados

## Autor

Juan Sebastian Barajas
Ingeniería de Sistemas

## Licencia

MIT
