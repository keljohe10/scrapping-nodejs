import { getOpenAIClient, getLlamaClient } from './clients.js';
import { messagesFor, linkMessagesFor } from './prompts.js';
import { Website } from './scraper.js';

/**
 * Resumir el contenido de un sitio web usando OpenAI o Llama
 * @param {string} url - URL del sitio web a resumir
 * @param {string} modelType - Tipo de modelo a usar ('openai' o 'llama')
 * @returns {Promise<string>} Resumen del contenido del sitio web
 */
export async function summarize(url, modelType = "openai") {
    const website = new Website(url);
    
    // Extraer el contenido del sitio web
    await website.scrape();
    
    // Configurar el cliente según el tipo de modelo
    let client;
    let modelName;
    
    if (modelType === "openai") {
        client = getOpenAIClient();
        modelName = "gpt-4o-mini";
    } else if (modelType === "llama") {
        client = getLlamaClient();
        modelName = "llama3.2";
    } else {
        throw new Error("Modelo no soportado. Use 'openai' o 'llama'.");
    }
    
    try {
        const response = await client.createChatCompletion({
            model: modelName,
            messages: linkMessagesFor(website)
        });
        
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error al generar el resumen:', error.message);
        throw new Error(`Error al generar el resumen: ${error.message}`);
    }
}
