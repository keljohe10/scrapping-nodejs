# 🕸️ Web Summarizer - JavaScript/Node.js

Este proyecto en JavaScript/Node.js te permite extraer y resumir el contenido de cualquier página web utilizando la API de OpenAI. Ideal para periodistas, analistas, investigadores o cualquier persona que quiera obtener resúmenes rápidos de sitios web.

---

## 🚀 Características

- Scraping básico del contenido visible de una página web (sin scripts, estilos ni imágenes).
- Generación de resumen utilizando `gpt-4o-mini` (o el modelo que prefieras).
- Soporte para OpenAI y Ollama (Llama).
- Limpio y modular: fácil de mantener y escalar.
- Completamente asíncrono con async/await.

---

## 📁 Estructura del proyecto

```bash
web-summarizer-js/
├── .env                 # Tu clave API de OpenAI (nunca la subas a GitHub)
├── .gitignore           # Archivos y carpetas excluidos del repositorio
├── package.json         # Dependencias y configuración del proyecto
├── README.md            # Este archivo
├── main.js              # Punto de entrada del programa
└── summarizer/          # Lógica del proyecto
    ├── clients.js       # Clientes de OpenAI y Ollama
    ├── scraper.js       # Extracción de contenido web
    ├── prompts.js       # Prompts para la IA
    └── summarizer.js    # Lógica principal de resumen
```

---

## ⚙️ Requisitos

- Node.js 18.0.0 o superior
- Cuenta de OpenAI con una clave API válida (para OpenAI)
- Ollama instalado y ejecutándose (para Llama)

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/keljohe10/web_summarizer.git
cd web-summarizer-js
```

2. Instala las dependencias:

```bash
npm install
```

---

## 🔐 Configura tu clave API

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Nunca subas tu `.env` al repositorio.** Ya está listado en `.gitignore`.

---

## 🧪 Uso

### Interfaz de Línea de Comandos (CLI)

El proyecto ahora incluye una interfaz CLI completa con Commander.js que te permite ejecutar diferentes acciones:

#### 1. Resumir un sitio web
```bash
# Usando npm scripts específicos por modelo
npm run summary:openai https://anthropic.com
npm run summary:llama https://anthropic.com

# Usando npm script genérico
npm run summary https://anthropic.com

# O directamente con node
node cli.js summary https://anthropic.com

# Especificar modelo manualmente
node cli.js summary https://anthropic.com --model llama
```

#### 2. Extraer enlaces relevantes
```bash
# Usando npm scripts específicos por modelo
npm run links:openai https://anthropic.com
npm run links:llama https://anthropic.com

# Usando npm script genérico
npm run links https://anthropic.com

# O directamente con node
node cli.js links https://anthropic.com

# Especificar modelo manualmente
node cli.js links https://anthropic.com --model openai
```

#### 3. Modo interactivo (compatibilidad con versión anterior)
```bash
# Usando npm script
npm run interactive

# O directamente con node
node cli.js interactive
```

#### 4. Ver ayuda
```bash
node cli.js --help
node cli.js summary --help
node cli.js links --help
```

### Uso tradicional (modo interactivo)

Si prefieres el modo interactivo original:

```bash
npm start
```

O directamente con Node.js:

```bash
node main.js
```

Ingresa una URL cuando se te solicite, por ejemplo:

```
Ingresa la URL del sitio web a resumir: https://anthropic.com
```

Y verás un resumen generado directamente en la terminal 🎯

---

## 🤖 Modelos compatibles

Este proyecto soporta:

### OpenAI
- `gpt-4o-mini` (por defecto)
- `gpt-3.5-turbo`
- Cualquier modelo disponible en tu cuenta de OpenAI

### Ollama (Llama)
- `llama3.2` (por defecto)
- Cualquier modelo de Llama disponible en tu instalación de Ollama

---

## 🛠️ Dependencias

- **openai**: Cliente oficial de OpenAI para Node.js
- **axios**: Cliente HTTP para realizar peticiones web
- **cheerio**: Parser HTML del lado del servidor (similar a jQuery)
- **dotenv**: Carga variables de entorno desde archivo .env
- **readline**: Interfaz para leer input del usuario

---

## 🔧 Desarrollo

Para ejecutar en modo desarrollo:

```bash
npm run dev
```

---

## 📝 Diferencias con la versión Python

- **Asíncrono**: Todo el código utiliza async/await para operaciones asíncronas
- **ES Modules**: Utiliza la sintaxis moderna de import/export
- **Manejo de errores**: Mejor manejo de errores con try/catch
- **TypeScript ready**: Fácil de migrar a TypeScript si es necesario

---

## 📝 Licencia

MIT License
