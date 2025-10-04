import { Website } from './summarizer/scraper.js';

async function testScraper() {
    console.log('🧪 Probando el scraper...');
    
    try {
        const website = new Website('https://example.com');
        await website.scrape();
        
        console.log('✅ Scraper funcionando correctamente');
        console.log('Título:', website.title);
        console.log('Texto (primeros 200 caracteres):', website.text.substring(0, 200) + '...');
        
    } catch (error) {
        console.error('❌ Error en el scraper:', error.message);
    }
}

testScraper();
