import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/117.0.0.0 Safari/537.36"
    )
};

/**
 * Clase para extraer contenido de sitios web
 */
export class Website {
    /**
     * Constructor de la clase Website
     * @param {string} url - URL del sitio web a analizar
     */
    constructor(url) {
        this.url = url;
        this.title = "No title found";
        this.text = "";
        this.links = [];
    }

    /**
     * Extrae el contenido del sitio web
     * @returns {Promise<void>}
     */
    async scrape() {
        try {
            const response = await axios.get(this.url, { headers: HEADERS });
            this.body = response.data;
            const $ = cheerio.load(this.body);


            // Extract title
            this.title = $('title').text() || 'No title found';


            // Clean up unwanted elements
            $('script, style, img, input').remove();


            // Extract visible text
            this.text = $('body').text().replace(/\s+/g, ' ').trim();


            // Extract links
            this.links = [];
            $('a').each((_, el) => {
                const href = $(el).attr('href');
                if (href) this.links.push(href);
            });


        } catch (error) {
            console.error('Error al extraer el contenido del sitio web:', error.message);
            throw new Error(`No se pudo acceder a la URL: ${this.url}`);
        }
    }
}
