import { createInterface } from 'readline';
import { summarize } from './summarizer/summarizer.js';

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
 * Función principal del programa
 */
async function main() {
    try {
        console.log('🕸️  Web Summarizer - Versión JavaScript\n');
        
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
        const summary = await summarize(url, modelType);
        console.log(summary);
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar el programa
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
