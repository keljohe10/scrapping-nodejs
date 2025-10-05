import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Inicializa y retorna el cliente de OpenAI con la API key.
 * @param {string} baseUrl - URL base para el cliente (opcional)
 * @returns {OpenAI} Cliente de OpenAI configurado
 */
function getAIClient(baseUrl) {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: baseUrl || undefined
    });
}

export function getClientAndModel(modelType) {
    const modelName = modelType === "llama" ? "llama3.2" : "gpt-4o-mini";
    const baseUrl = modelType === "llama" ? "http://localhost:11434/v1" : undefined;
    const client = getAIClient(baseUrl);
    return { client, modelName };
}
