const yaml = require('C:/Users/ponch/OneDrive/Documents/rpg/D&D/compendium/dnd5e-6.0.x/node_modules/js-yaml');
const fs = require('fs');
const path = require('path');

function processDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.yml')) {
      if (entry.name.startsWith('_')) {
        // Supprimer les _folder.yml sans les convertir
        fs.unlinkSync(fullPath);
        return;
      }
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const data = yaml.load(content);
        if (data && data._id) {
          const jsonPath = fullPath.replace('.yml', '.json');
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
          fs.unlinkSync(fullPath);
          console.log('OK:', data.name || entry.name);
        } else {
          console.log('Ignoré (pas de _id):', entry.name);
          fs.unlinkSync(fullPath);
        }
      } catch(e) {
        console.error('Erreur:', entry.name, e.message);
      }
    }
  }
}

const srcBase = path.resolve('packs/_source');
const packs = fs.readdirSync(srcBase, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name);

for (const pack of packs) {
  console.log(`\n=== Pack: ${pack} ===`);
  processDir(path.join(srcBase, pack));
}

console.log('\nConversion terminée.');
