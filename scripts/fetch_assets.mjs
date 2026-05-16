import fs from 'fs';
import path from 'path';

const PLAYERS = [
    "Vinícius Júnior", "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappé", 
    "Neymar Jr", "Kevin De Bruyne", "Erling Haaland", "Mohamed Salah",
    "Robert Lewandowski", "Luka Modric", "Harry Kane", "Son Heung-min",
    "Alisson Becker", "Virgil van Dijk", "Casemiro", "Bruno Fernandes",
    "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Pedri"
];

async function getPlayerImage(name) {
    try {
        // 1. Search for the Wikipedia page
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl).then(r => r.json());
        
        if (!searchRes.query.search.length) return null;
        
        const pageTitle = searchRes.query.search[0].title;
        
        // 2. Get the main image from the page
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
        const imgRes = await fetch(imgUrl).then(r => r.json());
        
        const pages = imgRes.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pages[pageId].thumbnail) {
            return pages[pageId].thumbnail.source;
        }
        
        return null;
    } catch (e) {
        console.error(`Error fetching ${name}:`, e);
        return null;
    }
}

async function main() {
    const outputDir = './public/players';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    console.log("🚀 Iniciando captura de imagens dos jogadores...");

    const results = {};

    for (const player of PLAYERS) {
        process.stdout.write(`Fetching ${player}... `);
        const imageUrl = await getPlayerImage(player);
        
        if (imageUrl) {
            const fileName = `${player.toLowerCase().replace(/\s+/g, '_')}.jpg`;
            const filePath = path.join(outputDir, fileName);
            
            try {
                const res = await fetch(imageUrl);
                const arrayBuffer = await res.arrayBuffer();
                fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
                console.log("✅");
                results[player] = `/players/${fileName}`;
            } catch (err) {
                console.log("❌ (Download error)");
            }
        } else {
            console.log("❌ (Not found)");
        }
    }

    console.log("\n📦 Processo concluído!");
    console.log("Resultados para atualizar no mock-data:");
    console.log(JSON.stringify(results, null, 2));
}

main();
