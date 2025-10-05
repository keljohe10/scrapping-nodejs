# 🕸️ Web Summarizer CLI - JavaScript/Node.js

Herramienta CLI para extraer y resumir contenido de sitios web utilizando OpenAI o Llama. Ideal para periodistas, analistas, investigadores o cualquier persona que quiera obtener resúmenes rápidos de sitios web.

---

## 🚀 Características

- **Scraping automático** del contenido visible de páginas web
- **Resúmenes inteligentes** usando OpenAI (gpt-4o-mini) o Llama (llama3.2)
- **Extracción de enlaces relevantes** (About, Careers, etc.)
- **Interfaz CLI moderna** con Commander.js
- **Scraper automático** al instanciar (similar a `__init__` de Python)
- **Completamente asíncrono** con async/await
- **Streaming real** para OpenAI (contenido en tiempo real)
- **Multi-shot prompting** para brochures de alta calidad
- **Código de calidad** con ESLint y Prettier

---

## 🛠️ Herramientas de Desarrollo

### ESLint

Configurado con estándares de calidad de código para Node.js:

```bash
npm run lint          # Verificar errores de código
npm run lint:fix      # Corregir errores automáticamente
npm run lint:check    # Verificar sin warnings
```

### Prettier

Formateador de código para mantener consistencia:

```bash
npm run format        # Formatear todo el código
npm run format:check  # Verificar formato
npm run format:lint   # Formatear y lint en una sola ejecución
```

### Scripts Disponibles

```bash
# Comandos principales
npm run summary:openai <url>     # Resumen con OpenAI
npm run summary:llama <url>      # Resumen con Llama
npm run links:openai <url>       # Extraer enlaces con OpenAI
npm run links:llama <url>        # Extraer enlaces con Llama
npm run brochure:openai <url> <company>  # Folleto con OpenAI
npm run brochure:llama <url> <company>   # Folleto con Llama

# Herramientas de desarrollo
npm run lint                      # Verificar código
npm run format                    # Formatear código
```

---

## 🎯 Multi-Shot Prompting para Brochures

El comando `brochure` utiliza **multi-shot prompting** para generar brochures de alta calidad. Esto significa que el modelo recibe ejemplos de brochures bien estructurados antes de generar el brochure solicitado.

### Características del Multi-Shot Prompting:

- **3 ejemplos de brochures** de diferentes industrias (Tech, Green Energy, Data Analytics)
- **Estructura consistente** con secciones estándar:
  - About (Descripción de la empresa)
  - Company Culture (Cultura y valores)
  - Our Customers (Clientes objetivo)
  - Careers (Oportunidades laborales)
  - Get in Touch (Información de contacto)
- **Formato profesional** con markdown y bullet points
- **Lenguaje persuasivo** y orientado a resultados

### Beneficios:

✅ **Calidad consistente**: Todos los brochures siguen el mismo formato profesional
✅ **Mejor estructura**: Secciones organizadas y fáciles de leer
✅ **Lenguaje persuasivo**: Contenido orientado a atraer clientes y talento
✅ **Adaptabilidad**: Funciona con cualquier tipo de empresa o industria

---

## 📁 Estructura del proyecto

```bash
web-summarizer-js/
├── .env                 # Tu clave API de OpenAI (nunca la subas a GitHub)
├── .gitignore           # Archivos y carpetas excluidos del repositorio
├── package.json         # Dependencias y configuración del proyecto
├── README.md            # Este archivo
├── cli.js               # Interfaz CLI principal
└── summarizer/          # Lógica del proyecto
    ├── clients.js       # Clientes de OpenAI y Llama
    ├── scraper.js       # Extracción de contenido web
    ├── prompts.js       # Prompts para la IA
    └── summarizer.js    # Funciones principales
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

## 🔐 Configuración

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Nunca subas tu `.env` al repositorio.** Ya está listado en `.gitignore`.

---

## 🧪 Uso

### Comandos Principales

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

### Scripts NPM Disponibles

| Script                   | Descripción        | Ejemplo                                      |
| ------------------------ | ------------------ | -------------------------------------------- |
| `npm run summary:openai` | Resumen con OpenAI | `npm run summary:openai https://example.com` |
| `npm run summary:llama`  | Resumen con Llama  | `npm run summary:llama https://example.com`  |
| `npm run links:openai`   | Enlaces con OpenAI | `npm run links:openai https://example.com`   |
| `npm run links:llama`    | Enlaces con Llama  | `npm run links:llama https://example.com`    |

### Ayuda

```bash
# Ver ayuda general
node cli.js --help

# Ver ayuda de comandos específicos
node cli.js summary --help
node cli.js links --help
```

---

## 🤖 Modelos compatibles

### OpenAI

- `gpt-4o-mini` (por defecto)
- `gpt-3.5-turbo`
- Cualquier modelo disponible en tu cuenta de OpenAI

### Ollama (Llama)

- `llama3.2` (por defecto)
- Cualquier modelo de Llama disponible en tu instalación de Ollama

---

## 🛠️ Dependencias

- **commander**: Interfaz CLI moderna
- **openai**: Cliente oficial de OpenAI para Node.js
- **axios**: Cliente HTTP para realizar peticiones web
- **cheerio**: Parser HTML del lado del servidor (similar a jQuery)
- **dotenv**: Carga variables de entorno desde archivo .env

---

## 🔧 Desarrollo

### Estructura del código

```javascript
// Crear instancia con scraper automático (similar a __init__ de Python)
const website = await Website.create('https://example.com');

// Generar resumen
const summary = await summarize('https://example.com', 'openai');

// Extraer enlaces
const links = await extractLinks('https://example.com', 'llama');
```

### Características técnicas

- **ES Modules**: Utiliza la sintaxis moderna de import/export
- **Asíncrono**: Todo el código utiliza async/await
- **Scraper automático**: Se ejecuta al instanciar la clase Website
- **Manejo de errores**: Mejor manejo de errores con try/catch

---

## 📝 Licencia

MIT License

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request si tienes alguna mejora.

---

## 📞 Soporte

Si tienes problemas o preguntas, por favor abre un issue en el repositorio.
