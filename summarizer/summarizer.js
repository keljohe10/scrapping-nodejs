import { getAIClient } from './clients.js';
import { messagesFor, linkMessagesFor, brochureMessagesFor } from './prompts.js';
import { Website } from './scraper.js';

/**
 * Configura el cliente y modelo según el tipo especificado
 * @param {string} modelType - Tipo de modelo ('openai' o 'llama')
 * @returns {Object} Objeto con client y modelName
 */
function getClientAndModel(modelType) {
    const modelName = modelType === "llama" ? "llama3.2" : "gpt-4o-mini";
    const baseUrl = modelType === "llama" ? "http://localhost:11434/v1" : undefined;
    const client = getAIClient(baseUrl);
    return { client, modelName };
}

/**
 * Función común para procesar un sitio web con IA
 * @param {string} url - URL del sitio web
 * @param {string} modelType - Tipo de modelo a usar
 * @param {Function} messageFunction - Función para generar mensajes
 * @param {string} operationName - Nombre de la operación para mensajes de error
 * @returns {Promise<string>} Resultado del procesamiento
 */
async function processWebsiteWithAI(url, modelType, messageFunction, operationName) {
    // Crear instancia con scraper automático (similar a __init__ de Python)
    const website = await Website.create(url);

    // Configurar el cliente según el tipo de modelo
    const { client, modelName } = getClientAndModel(modelType);

    try {
        const response = await client.chat.completions.create({
            model: modelName,
            messages: messageFunction(website)
        });
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error(`Error al ${operationName}:`, error.message);
        throw new Error(`Error al ${operationName}: ${error.message}`);
    }
}

/**
 * Resumir el contenido de un sitio web usando OpenAI o Llama
 * @param {string} url - URL del sitio web a resumir
 * @param {string} modelType - Tipo de modelo a usar ('openai' o 'llama')
 * @returns {Promise<string>} Resumen del contenido del sitio web
 */
export async function summarize(url, modelType = "openai") {
    return processWebsiteWithAI(url, modelType, messagesFor, "generar el resumen");
}

/**
 * Extraer enlaces relevantes de un sitio web usando OpenAI o Llama
 * @param {string} url - URL del sitio web a analizar
 * @param {string} modelType - Tipo de modelo a usar ('openai' o 'llama')
 * @returns {Promise<string>} Enlaces relevantes del sitio web
 */
export async function extractLinks(url, modelType = "openai") {
    return processWebsiteWithAI(url, modelType, linkMessagesFor, "extraer enlaces");
}

/**
 * Procesa enlaces encontrados y agrega su contenido al prompt
 * @param {Array} links - Array de enlaces encontrados
 * @param {string} userPrompt - Prompt base
 * @returns {string} Prompt actualizado con contenido de enlaces
 */
async function processLinks(links, userPrompt) {
    for (const link of links.links) {
        try {
            const linkedSite = await Website.create(link.url);
            userPrompt += `\n\n${link.type}\n`;
            userPrompt += linkedSite.getContent();
        } catch (error) {
            // Silenciosamente continuar si no se puede acceder al enlace
        }
    }
    return userPrompt;
}

/**
 * Genera el folleto usando streaming para OpenAI o método normal para otros modelos
 * @param {Object} client - Cliente de IA
 * @param {string} modelName - Nombre del modelo
 * @param {string} modelType - Tipo de modelo (openai/llama)
 * @param {string} companyName - Nombre de la empresa
 * @param {string} truncatedPrompt - Prompt truncado
 * @returns {string} Contenido del folleto generado
 */
async function generateBrochure(client, modelName, modelType, companyName, truncatedPrompt) {
    const messages = brochureMessagesFor(companyName, truncatedPrompt);
    
    if (modelType === "openai") {
        // Streaming real para OpenAI
        const stream = await client.chat.completions.create({
            model: modelName,
            messages: messages,
            stream: true
        });

        let result = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                result += content;
                process.stdout.write(content);
            }
        }
        return result;
    } else {
        // Método normal para otros modelos
        const response = await client.chat.completions.create({
            model: modelName,
            messages: messages
        });
        return response.choices[0].message.content;
    }
}

export async function createBrochure(url, companyName, modelType = "openai") {
    console.log(`\n📝 Creando folleto para ${companyName} usando ${modelType}...\n`);
    
    // Crear instancia con scraper automático (similar a __init__ de Python)
    const website = await Website.create(url);
    const { client, modelName } = getClientAndModel(modelType);

    try {
        // Construir prompt base con página principal
        let userPrompt = 'Landing page:\n';
        userPrompt += website.getContent();

        // Extraer y procesar enlaces relevantes
        const jsonString = await processWebsiteWithAI(url, modelType, linkMessagesFor, "extraer enlaces");
        
        const jsonStart = jsonString.indexOf('{');
        const jsonEnd = jsonString.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
            throw new Error('No se encontró JSON válido en la respuesta de enlaces');
        }
        
        const jsonStr = jsonString.substring(jsonStart, jsonEnd + 1);
        const links = JSON.parse(jsonStr);

        // Procesar enlaces y agregar contenido al prompt
        userPrompt = await processLinks(links, userPrompt);

        // Truncar el prompt si es muy largo para evitar errores de tokens
        const truncatedPrompt = userPrompt.length > 3000 ? userPrompt.slice(0, 3000) + '...' : userPrompt;

        // Generar folleto usando la función unificada
        return await generateBrochure(client, modelName, modelType, companyName, truncatedPrompt);
        
    } catch (error) {
        console.error(`\n❌ Error al crear el folleto:`, error.message);
        throw new Error(`Error al crear el folleto: ${error.message}`);
    }
}
