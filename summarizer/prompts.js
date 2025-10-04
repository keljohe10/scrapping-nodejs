/**
 * Genera el prompt del sistema para el resumen
 * @returns {string} Prompt del sistema
 */
function systemPrompt() {
    return (
        "You are an assistant that analyzes the contents of a website " +
        "and provides a short summary, ignoring text that might be navigation related. " +
        "Respond in plain text."
    );
}

/**
 * Genera el prompt del usuario para un sitio web específico
 * @param {Website} website - Objeto Website con el contenido extraído
 * @returns {string} Prompt del usuario
 */
function userPromptFor(website) {
    return (
        `You are looking at a website titled ${website.title}\n` +
        "The contents of this website is as follows; " +
        "please provide a short summary of this website. " +
        `and list the links at the end from ${website.links.join(", ")}\n` +
        "If it includes news or announcements, then summarize these too.\n\n" +
        website.text
    );
}

const linkSystemPrompt = () => {
    return (
        `You are provided with a list of links found on a webpage.
You are able to decide which of the links would be most relevant to include in a brochure about the company,
such as links to an About page, or a Company page, or Careers/Jobs pages.
You should respond in JSON as in this example:
{
    "links": [
        {"type": "about page", "url": "https://full.url/goes/here/about"},
        {"type": "careers page", "url": "https://another.full.url/careers"}
    ]
}
`
    );
}

const linkUserPrompt = (website) => {
    return (
        `Here is the list of links on the website of ${website.url}\n` +
        "please decide which of these are relevant web links for a brochure about the company, respond with the full https URL in JSON format. \
Do not include Terms of Service, Privacy, email links.\n" +
        "please provide a short summary of this website. " +
        `Links (some might be relative links):\n` +
        "" + website.links.join("\n") + "\n"
    );
}

/**
 * Genera los mensajes para la API de OpenAI
 * @param {Website} website - Objeto Website con el contenido extraído
 * @returns {Array} Array de mensajes para la API
 */
export function messagesFor(website) {
    return [
        { role: "system", content: systemPrompt() },
        { role: "user", content: userPromptFor(website) }
    ];
}

export const linkMessagesFor = (website) => {
    return [
        { role: "system", content: linkSystemPrompt() },
        { role: "user", content: linkUserPrompt(website) }
    ];
}
