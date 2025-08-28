#!/usr/bin/env node

/**
 * Script pour générer les favicons PNG à partir du SVG
 * Nécessite Node.js et le package 'sharp' installé
 * 
 * Installation : npm install sharp
 * Usage : node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');

// Vérifier si sharp est installé
try {
  require('sharp');
} catch (error) {
  console.log('❌ Package "sharp" non trouvé');
  console.log('📦 Installez-le avec : npm install sharp');
  console.log('🔧 Ou utilisez un outil en ligne comme favicon.io');
  process.exit(1);
}

const sharp = require('sharp');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 }
];

async function generateFavicons() {
  const svgPath = path.join(__dirname, '../public/favicon.svg');
  const outputDir = path.join(__dirname, '../public');

  // Vérifier que le SVG existe
  if (!fs.existsSync(svgPath)) {
    console.log('❌ Fichier favicon.svg non trouvé dans public/');
    return;
  }

  console.log('🎨 Génération des favicons PNG...');

  try {
    for (const { name, size } of sizes) {
      const outputPath = path.join(outputDir, name);
      
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ ${name} (${size}x${size}) généré`);
    }

    console.log('\n🎉 Tous les favicons ont été générés avec succès !');
    console.log('📁 Fichiers créés dans le dossier public/');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération :', error.message);
  }
}

// Exécuter le script
generateFavicons();
