import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Inicializa y retorna el cliente de OpenAI con la API key.
 * @param {string} baseUrl - URL base para el cliente (opcional)
 * @returns {OpenAI} Cliente de OpenAI configurado
 */
export function getAIClient(baseUrl) {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: baseUrl || undefined
    });
}

