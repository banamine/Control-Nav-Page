// scripts/crawler.ts
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { parse } from 'node-html-parser'; // Run: npm install node-html-parser

function computeSHA256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function generateManifests() {
  const contentDir = './public'; // Or your local HTML source directory
  const outputDir = './dist/manifests';
  await fs.mkdir(outputDir, { recursive: true });

  // Example scanning logic for categories (News, Movies, etc.)
  const categories = ['news', 'movies', 'series', 'radio', 'general'];
  const allSources = [];

  for (const cat of categories) {
    const items = [
      {
        id: `item-sample-${cat}`,
        url: `https://www.liberty-express.org/sample.html`,
        title: `Sample ${cat.toUpperCase()} Page`,
        domain: cat,
        type: cat,
        lastModified: new Date().toISOString(),
        checksum: computeSHA256('sample-content')
      }
    ];

    const subManifest = {
      manifestId: `${cat}-manifest`,
      category: cat,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      items
    };

    const fileName = `${cat}.json`;
    await fs.writeFile(path.join(outputDir, fileName), JSON.stringify(subManifest, null, 2));
    
    allSources.push({
      id: `${cat}-manifest`,
      subManifestUrl: `https://www.liberty-express.org/manifests/${fileName}`,
      category: cat
    });
  }

  // Generate Root Manifest
  const rootManifest = {
    version: '1.0.0',
    title: 'Liberty Express Master Manifest',
    lastUpdated: new Date().toISOString(),
    sources: allSources
  };

  await fs.writeFile(path.join(outputDir, 'root-manifest.json'), JSON.stringify(rootManifest, null, 2));
  console.log('Manifests successfully generated!');
}

generateManifests();
