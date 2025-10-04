#!/usr/bin/env node

import { program } from 'commander';
import { createInterface } from 'readline';
import { summarize } from './summarizer/summarizer.js';
import { messagesFor, linkMessagesFor } from './summarizer/prompts.js';
import { Website } from './summarizer/scraper.js';
import { getOpenAIClient, getLlamaClient } from './summarizer/clients.js';

/**
 * Función para obtener input del usuario de forma asíncrona
 * @param {string} question - Pregunta a mostrar al usuario
 * @returns {Promise<string>} Respuesta del usuario
 */
function askQuestion(question) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

/**
 * Función para procesar un sitio web y generar mensajes
 * @param {string} url - URL del sitio web
 * @param {string} modelType - Tipo de modelo ('openai' o 'llama')
 * @param {string} action - Acción a realizar ('summary' o 'links')
 * @returns {Promise<string>} Resultado de la acción
 */
async function processWebsite(url, modelType, action) {
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
    
    // Seleccionar los mensajes según la acción
    let messages;
    if (action === 'summary') {
        messages = messagesFor(website);
    } else if (action === 'links') {
        messages = linkMessagesFor(website);
    } else {
        throw new Error("Acción no soportada. Use 'summary' o 'links'.");
    }
    
    try {
        const response = await client.createChatCompletion({
            model: modelName,
            messages: messages
        });
        
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error al procesar el sitio web:', error.message);
        throw new Error(`Error al procesar el sitio web: ${error.message}`);
    }
}

// Configurar el programa CLI
program
    .name('web-summarizer')
    .description('Herramienta CLI para resumir sitios web y extraer enlaces relevantes')
    .version('1.0.0');

// Comando para resumir sitios web
program
    .command('summary')
    .description('Genera un resumen del contenido de un sitio web')
    .argument('<url>', 'URL del sitio web a resumir')
    .option('-m, --model <type>', 'Modelo a usar (openai o llama)', 'openai')
    .action(async (url, options) => {
        try {
            console.log('🕸️  Web Summarizer - Resumen\n');
            console.log(`URL: ${url}`);
            console.log(`Modelo: ${options.model}`);
            console.log('-'.repeat(60));
            
            const result = await processWebsite(url, options.model, 'summary');
            console.log(result);
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

// Comando para extraer enlaces relevantes
program
    .command('links')
    .description('Extrae enlaces relevantes de un sitio web (About, Careers, etc.)')
    .argument('<url>', 'URL del sitio web a analizar')
    .option('-m, --model <type>', 'Modelo a usar (openai o llama)', 'openai')
    .action(async (url, options) => {
        try {
            console.log('🔗 Web Summarizer - Extracción de Enlaces\n');
            console.log(`URL: ${url}`);
            console.log(`Modelo: ${options.model}`);
            console.log('-'.repeat(60));
            
            const result = await processWebsite(url, options.model, 'links');
            console.log(result);
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

// Comando interactivo (compatibilidad con la versión anterior)
program
    .command('interactive')
    .description('Modo interactivo para resumir sitios web')
    .action(async () => {
        try {
            console.log('🕸️  Web Summarizer - Modo Interactivo\n');
            
            // Solicitar URL
            const url = await askQuestion('Ingresa la URL del sitio web a resumir: ');
            if (!url) {
                console.log('No ingresaste una URL válida.');
                return;
            }
            
            // Solicitar modelo
            console.log('\n¿Qué modelo quieres usar?');
            console.log('1. OpenAI (gpt-4o-mini)');
            console.log('2. Llama (llama3.2)');
            
            let modelType;
            while (true) {
                const choice = await askQuestion('Ingresa tu opción (1 o 2): ');
                if (choice === '1') {
                    modelType = 'openai';
                    break;
                } else if (choice === '2') {
                    modelType = 'llama';
                    break;
                } else {
                    console.log('Opción inválida. Por favor ingresa 1 o 2.');
                }
            }
            
            console.log(`\nResumen de: ${url}`);
            console.log(`Usando modelo: ${modelType}`);
            console.log('-'.repeat(60));
            
            // Generar resumen
            const summary = await processWebsite(url, modelType, 'summary');
            console.log(summary);
            
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

// Parsear argumentos de línea de comandos
program.parse();
