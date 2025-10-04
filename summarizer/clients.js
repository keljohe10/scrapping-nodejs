import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Inicializa y retorna el cliente de OpenAI con la API key.
 * @returns {OpenAIApi} Cliente de OpenAI configurado
 */
export function getOpenAIClient() {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    return new OpenAIApi(configuration);
}

/**
 * Inicializa y retorna el cliente de OpenAI configurado para Ollama.
 * @returns {OpenAIApi} Cliente de OpenAI configurado para Ollama
 */
export function getLlamaClient() {
    const configuration = new Configuration({
        basePath: 'http://localhost:11434/v1',
        apiKey: 'ollama'
    });
    return new OpenAIApi(configuration);
}
