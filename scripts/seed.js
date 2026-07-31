/* Bootstrap de la base de données (db.json) */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

(async () => {
  const { seedDatabase } = await import(pathToFileURL(path.join(process.cwd(), 'lib', 'seed.js')).href);
  const db = await seedDatabase();
  const out = path.join(process.cwd(), 'data', 'db.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(db, null, 2), 'utf8');
  console.log(`\u2705 Base de données générée : ${out}`);
  console.log(`   - ${db.users.length} utilisateurs (admin@laboutique.ci / admin123, demo@laboutique.ci / demo123)`);
  console.log(`   - ${db.themes.length} thèmes premium`);
  console.log(`   - ${db.shops.length} boutiques de démonstration (${db.shops.reduce((s, sh) => s + sh.products.length, 0)} produits)`);
})().catch((e) => { console.error(e); process.exit(1); });