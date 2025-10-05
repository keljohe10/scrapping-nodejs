import { getOpenAIClient, getLlamaClient } from './clients.js';
import { messagesFor, linkMessagesFor, brochureMessagesFor } from './prompts.js';
import { Website } from './scraper.js';

/**
 * Configura el cliente y modelo según el tipo especificado
 * @param {string} modelType - Tipo de modelo ('openai' o 'llama')
 * @returns {Object} Objeto con client y modelName
 */
function getClientAndModel(modelType) {
    if (modelType === "openai") {
        return {
            client: getOpenAIClient(),
            modelName: "gpt-4o-mini"
        };
    } else if (modelType === "llama") {
        return {
            client: getLlamaClient(),
            modelName: "llama3.2"
        };
    } else {
        throw new Error("Modelo no soportado. Use 'openai' o 'llama'.");
    }
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
        const response = await client.createChatCompletion({
            model: modelName,
            messages: messageFunction(website)
        });

        return response.data.choices[0].message.content;
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

export async function createBrochure(url, companyName, modelType = "openai") {
    // Crear instancia con scraper automático (similar a __init__ de Python)
    const website = await Website.create(url);

    // Configurar el cliente según el tipo de modelo
    const { client, modelName } = getClientAndModel(modelType);

    try {
        let userPrompt = 'Landing page:\n';

        const site = website;
        userPrompt += site.getContent();

        const jsonString = await processWebsiteWithAI(url, modelType, linkMessagesFor, "extraer enlaces");
        
        // Extraer solo la parte JSON de la respuesta
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No se encontró JSON válido en la respuesta de enlaces');
        }
        
        const links = JSON.parse(jsonMatch[0]);
        
        for (const link of links.links) {
            try {
                const linkedSite = await Website.create(link.url);
                userPrompt += `\n\n${link.type}\n`;
                userPrompt += linkedSite.getContent();
            } catch (error) {
                console.warn(`⚠️  No se pudo procesar ${link.type} (${link.url}): ${error.message}`);
                // Continuar con el siguiente enlace en lugar de fallar completamente
                userPrompt += `\n\n${link.type}\n`;
                userPrompt += `[Error: No se pudo acceder a esta página - ${link.url}]\n`;
            }
        }

        // Truncar el prompt si es muy largo para evitar errores de tokens
        const truncatedPrompt = userPrompt.length > 3000 ? userPrompt.slice(0, 3000) + '...' : userPrompt;
        
        const response = await client.createChatCompletion({
            model: modelName,
            messages: brochureMessagesFor(companyName, truncatedPrompt)
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(`Error al crear el folleto:`, error.message);
        throw new Error(`Error al crear el folleto: ${error.message}`);
    }
}

