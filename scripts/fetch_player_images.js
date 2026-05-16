/**
 * SCRIPT PARA BUSCAR IMAGENS DE JOGADORES (WIKIPEDIA API)
 * 🎯 Objetivo: Buscar imagens de placeholder para o Copa Album 2026.
 * 
 * Como usar:
 * 1. Instale as dependências: npm install axios
 * 2. Execute: node scripts/fetch_player_images.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const JOGADORES = [
  'Vinícius Júnior',
  'Kylian Mbappé',
  'Lionel Messi',
  'Jude Bellingham',
  'Lamine Yamal',
  'Alisson Becker',
  'Rodri',
  'Kevin De Bruyne'
];

const OUTPUT_DIR = path.join(__dirname, '../public/images/players');

// Criar diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchWikipediaImage(playerName) {
  try {
    console.log(`🔍 Buscando imagem para: ${playerName}...`);
    
    // 1. Buscar a página da Wikipedia pelo nome do jogador
    const searchUrl = `https://pt.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(playerName)}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
    
    const response = await axios.get(searchUrl);
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId === '-1' || !pages[pageId].thumbnail) {
      console.warn(`⚠️ Nenhuma imagem encontrada na Wikipedia para ${playerName}.`);
      return null;
    }
    
    const imageUrl = pages[pageId].thumbnail.source;
    const extension = imageUrl.split('.').pop().toLowerCase();
    const fileName = `${playerName.toLowerCase().replace(/ /g, '_')}_placeholder.${extension}`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    
    // 2. Baixar a imagem
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    
    imageResponse.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Imagem salva: ${fileName}`);
        resolve(fileName);
      });
      writer.on('error', reject);
    });
    
  } catch (error) {
    console.error(`❌ Erro ao buscar imagem para ${playerName}:`, error.message);
    return null;
  }
}

async function start() {
  console.log('🚀 Iniciando script de busca de imagens...\n');
  
  for (const jogador of JOGADORES) {
    await fetchWikipediaImage(jogador);
    // Pequeno delay para evitar bloqueio
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✨ Script finalizado!');
}

start();
