#!/usr/bin/env node

import { program } from 'commander';
import { summarize, extractLinks, createBrochure } from './summarizer/summarizer.js';

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
            
            const result = await summarize(url, options.model);
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
            
            const result = await extractLinks(url, options.model);
            console.log(result);
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program
    .command('brochure')
    .description('Crea un folleto corto sobre la empresa basado en su sitio web y páginas relevantes')
    .argument('<url>', 'URL del sitio web de la empresa')
    .argument('<companyName>', 'Nombre de la empresa')
    .option('-m, --model <type>', 'Modelo a usar (openai o llama)', 'openai')
    .action(async (url, companyName, options) => {
        try {
            console.log('📄 Web Summarizer - Creación de Folleto\n');
            console.log(`URL: ${url}`);
            console.log(`Nombre de la empresa: ${companyName}`);
            console.log(`Modelo: ${options.model}`);
            console.log('-'.repeat(60));

            const result = await createBrochure(url, companyName, options.model);
            console.log(result);
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

// Parsear argumentos de línea de comandos
program.parse();