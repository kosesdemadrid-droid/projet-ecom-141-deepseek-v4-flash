/**
 * DONNÉES DE SEED — Thèmes premium, images Unsplash, banques de produits.
 * Toutes les images proviennent d'Unsplash (voir CREDITS.md).
 */
const u = (id, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const IMG = {
  fashion: ['photo-1445205170230-053b83016050', 'photo-1469334031218-e382a71b716b', 'photo-1483985988355-763728e1935b', 'photo-1490481651871-ab68de25d43d', 'photo-1509631179647-0177331693ae', 'photo-1521572163474-6864f9cf17ab', 'photo-1542272604-787c3835535d', 'photo-1595777457583-95e059d581b8', 'photo-1539109136881-3be0616acf4b', 'photo-1487222477894-8943e31ef7b2'].map((i) => u(i)),
  shoes: ['photo-1542291026-7eec264c27ff', 'photo-1560343090-f0409e92791a', 'photo-1549298916-b41d501d3772', 'photo-1543508282-6319a3e2621f', 'photo-1595950653106-6c9ebd614d3a', 'photo-1600185365483-26d7a4cc7519', 'photo-1608231387042-66d1773070a5', 'photo-1571171630858-1bc65f8c1ecb'].map((i) => u(i)),
  bags: ['photo-1548036328-c9fa89d128fa', 'photo-1584917865442-de89df76afd3', 'photo-1590874103328-eac38a683ce7', 'photo-1553062407-98eeb64c6a62', 'photo-1591561954557-26941169b49e'].map((i) => u(i)),
  watches: ['photo-1523275335684-37898b6baf30', 'photo-1547996160-81dfa63595aa', 'photo-1524805444758-089113d48a6d', 'photo-1533139502658-0198f920d8e8', 'photo-1523170335258-f5ed11844a49', 'photo-1542496658-33f6d6a136e7'].map((i) => u(i)),
  jewelry: ['photo-1515562141207-7a88fb7ce338', 'photo-1571993142257-eae0b45cf2b7', 'photo-1599643478518-a784e5dc4c8f', 'photo-1535632066927-ab7c9ab60908', 'photo-1521499086505-25c9f0228762', 'photo-1573408301185-9146fe634ad0', 'photo-1512169692304-fccd36d97e7b'].map((i) => u(i)),
  audio: ['photo-1505740420928-5e560c06d30e', 'photo-1546435770-a3e426bf472b', 'photo-1484704849700-f032a568e944', 'photo-1583394838336-acd977736f90', 'photo-1593642632823-8f785ba67e45'].map((i) => u(i)),
  laptops: ['photo-1496181133206-80ce9b88a853', 'photo-1517336714731-489689fd1ca8', 'photo-1587614382346-4ec70e388b28', 'photo-1593642702821-c8da6771f0c6', 'photo-1498050108023-c5249f4df085'].map((i) => u(i)),
  phones: ['photo-1511707171634-5f897ff02aa9', 'photo-1567581935884-3349723552ca', 'photo-1523206489230-c012c64b2b48', 'photo-1598327105666-5b89351aff97'].map((i) => u(i)),
  cameras: ['photo-1526170375885-4d8ecf77b99f', 'photo-1502920917128-1aa500764cbd', 'photo-1516035069371-29a1b244cc32'].map((i) => u(i)),
  gadgets: ['photo-1553456558-aff63285bdd1', 'photo-1546868871-7041f2a55e12', 'photo-1519389950473-47ba0277781c', 'photo-1508685096489-7aacd43bd3b1', 'photo-1593359677879-a4bb92f829d1', 'photo-1601944179066-29786cb9d32a'].map((i) => u(i)),
  cosmetics: ['photo-1596462502278-27bfdc403348', 'photo-1570172619644-dfd03ed5d881', 'photo-1556228720-195a672e8a03', 'photo-1556228453-efd6c1ff04f6', 'photo-1522335789203-aabd1fc54bc9', 'photo-1585386959984-a4155224a1ad', 'photo-1541643600914-78b084683601', 'photo-1615397349754-cfa2066a298e', 'photo-1526947425960-945c6e72858f'].map((i) => u(i)),
  skincare: ['photo-1516979187457-637abb4f9353', 'photo-1571781926291-c477ebfd024b', 'photo-1570554886111-e80fcca6a029', 'photo-1598440947619-2c35fc9aa908'].map((i) => u(i)),
  furniture: ['photo-1524758631624-e2822e304c36', 'photo-1555041469-a586c61ea9bc', 'photo-1567016432779-094069958ea5', 'photo-1519710164239-da123dc03ef4', 'photo-1505693416388-ac5ce068fe85', 'photo-1586023492125-27b2c045efd7', 'photo-1550581190-9c1c48d21d6c'].map((i) => u(i)),
  deco: ['photo-1567538096630-e0c55bd6374c', 'photo-1513519245088-0e12902e5a38', 'photo-1522252234503-e356532cafd5', 'photo-1526045612212-70caf35c14df', 'photo-1493663284031-b7e3aefcae8e', 'photo-1522708323590-d24dbb6b0267'].map((i) => u(i)),
  food: ['photo-1504674900247-0877df9cc836', 'photo-1565299624946-b28f40a0ae38', 'photo-1546069901-ba9599a7e63c', 'photo-1476224203421-9ac39bcb3327', 'photo-1555939594-58d7b561d162', 'photo-1567620905732-2d1ec7ab7445', 'photo-1540189549336-e6e99c3679fe', 'photo-1498837167922-ddd27525d352', 'photo-1505253716362-afaea1d3d1af', 'photo-1512621776951-a57141f2eefd'].map((i) => u(i)),
  epicerie: ['photo-1509042239860-f550ce710b93', 'photo-1514432324607-a09d9b4aefdd', 'photo-1447933601403-0c6688de566e', 'photo-1481350165307-94629ba2bdb4', 'photo-1541167760496-1628856ab772', 'photo-1528825871115-3581a5387919', 'photo-1587049352846-4a222e784d38'].map((i) => u(i)),
  toys: ['photo-1566150905458-1bf1fc113f0d', 'photo-1515488042361-ee00e0ddd4e4', 'photo-1558060370-d644479cb6f7', 'photo-1596461404969-9ae70f2830c1', 'photo-1566576912321-d58ddd7a6088', 'photo-1587654780291-39c9404d746b'].map((i) => u(i)),
  kids: ['photo-1522771930-78848d9293e8', 'photo-1503919545889-aef636e10ad4', 'photo-1560806887-1e4cd0b6cbd6', 'photo-1519238263530-99bdd11df2ea'].map((i) => u(i)),
  art: ['photo-1541961017774-22349e4a1262', 'photo-1579783902614-a3fb3927b6a5', 'photo-1547826039-bfc35e0f1ea8', 'photo-1554188248-986adbb73be4', 'photo-1536924940846-227afb31e2a5', 'photo-1513364776144-60967b0f800f', 'photo-1499781350541-7783f6c6a0c8', 'photo-1528920304568-7aa5b2f9ca7f'].map((i) => u(i)),
  fitness: ['photo-1571019613454-1cb2f99b2d8b', 'photo-1517836357463-d25dfeac3438', 'photo-1534438327276-14e5300c3a48', 'photo-1583454110551-21f2fa2afe61', 'photo-1544367567-0f2fcb009e0b', 'photo-1518611012118-696072aa579a', 'photo-1526506118085-60ce8714f8c5', 'photo-1584735935682-2f2b69dff9d5'].map((i) => u(i)),
  sportswear: ['photo-1511556820780-d912e51b27d0', 'photo-1485965120184-e220f721d03e', 'photo-1469920783271-0ee50297c0b7', 'photo-1517430816045-df4b7de11d1d', 'photo-1556906781-9a412961c28c', 'photo-1571731956672-f2b94d7dd0cb', 'photo-1508098682722-e99c43a406b2'].map((i) => u(i)),
  sportballs: ['photo-1517649763962-0c623066013b', 'photo-1461896836934-ffe607ba8211', 'photo-1431324155960-28621355b59a', 'photo-1530549387789-4c1017266635'].map((i) => u(i)),
  portraits: ['photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d', 'photo-1500648767791-00dcc994a43e', 'photo-1534528741775-53994a69daeb', 'photo-1519345182560-3f2917c472ef', 'photo-1524504388940-b1c1722653e1'].map((i) => u(i, 300)),
};

export const HERO_IMAGES = {
  sport: u('photo-1517649763962-0c623066013b', 1600),
  tech: u('photo-1519389950473-47ba0277781c', 1600),
  mode: u('photo-1445205170230-053b83016050', 1600),
  beaute: u('photo-1596462502278-27bfdc403348', 1600),
  maison: u('photo-1586023492125-27b2c045efd7', 1600),
  alimentation: u('photo-1555939594-58d7b561d162', 1600),
  enfants: u('photo-1515488042361-ee00e0ddd4e4', 1600),
  bijoux: u('photo-1515562141207-7a88fb7ce338', 1600),
  art: u('photo-1541961017774-22349e4a1262', 1600),
  fitness: u('photo-1571019613454-1cb2f99b2d8b', 1600),
};

export const FONTS = [
  { value: 'Inter', label: 'Inter (moderne)' },
  { value: 'Poppins', label: 'Poppins (arrondi)' },
  { value: 'Playfair Display', label: 'Playfair Display (luxe)' },
  { value: 'Space Grotesk', label: 'Space Grotesk (tech)' },
  { value: 'Lora', label: 'Lora (classique)' },
  { value: 'DM Serif Display', label: 'DM Serif (éditorial)' },
  { value: 'Baloo 2', label: 'Baloo (enfantin)' },
  { value: 'Cormorant Garamond', label: 'Cormorant (bijoux)' },
  { value: 'Barlow Condensed', label: 'Barlow (sport)' },
  { value: 'Fraunces', label: 'Fraunces (art)' },
];

export const THEME_DEFS = [
  {
    key: 'sport',
    name: 'Sport & Performance',
    tagline: 'Équipez-vous comme un champion',
    sector: 'Sport',
    colors: { p: '#ea580c', p2: '#9a3412', p3: '#fbbf24', bg: '#fff7ed' },
    font: 'Barlow Condensed',
    hero: HERO_IMAGES.sport,
    layouts: ['banner', 'split', 'center'],
    categories: [
      { name: 'Vêtements de sport', key: 'sportswear', prices: [12000, 45000], labels: ['T-shirt running', 'Maillot de football', 'Short de training', 'Legging fitness', 'Débardeur respirant', 'Veste de running', 'Survêtement complet', 'Haut de sport'], desc: 'Confectionné pour la performance, tissu respirant et coupe ajustée idéale pour le climat tropical.' },
      { name: 'Chaussures', key: 'shoes', prices: [25000, 90000], labels: ['Baskets running', 'Chaussures de foot', 'Sneakers urbaines', 'Baskets trail', 'Chaussures de basket', 'Sneakers légères'], desc: 'Amorti performant, adhérence optimale sur tous les terrains et design moderne.' },
      { name: 'Accessoires sport', key: 'sportballs', prices: [5000, 35000], labels: ['Ballon de football', 'Ballon de basket', 'Sac de sport', 'Gourde isotherme', 'Serviette microfibre', 'Casquette running', 'Bandoulière de gym'], desc: 'L\'accessoire indispensable pour vos entraînements, à la maison comme au terrain.' },
    ],
  },
  {
    key: 'tech',
    name: 'Tech & High-Tech',
    tagline: 'La technologie de pointe à Abidjan',
    sector: 'Tech & High-Tech',
    colors: { p: '#2563eb', p2: '#1e3a8a', p3: '#06b6d4', bg: '#eff6ff' },
    font: 'Space Grotesk',
    hero: HERO_IMAGES.tech,
    layouts: ['split', 'banner', 'center'],
    categories: [
      { name: 'Smartphones', key: 'phones', prices: [85000, 450000], labels: ['Smartphone 5G 128 Go', 'Smartphone 4G 64 Go', 'Smartphone écran incurvé', 'Smartphone appareil 108 MP', 'Smartphone double SIM', 'Smartphone compact'], desc: 'Écran AMOLED, batterie longue durée et connectivité 5G pour rester connecté à Abidjan.' },
      { name: 'Ordinateurs', key: 'laptops', prices: [185000, 950000], labels: ['PC portable 14 pouces', 'PC portable gaming', 'Ultrabook i5 16 Go', 'PC portable i3 8 Go', 'MacBook 13 pouces', 'PC portable 15 pouces'], desc: 'Performance et mobilité au rendez-vous pour le travail, les études et le gaming.' },
      { name: 'Audio & Gadgets', key: 'audio', prices: [8000, 120000], labels: ['Casque Bluetooth', 'Écouteurs sans fil', 'Enceinte portable', 'Montre connectée', 'Caméra action', 'Chargeur rapide 65W', 'Clavier sans fil'], desc: 'Du son immersif aux gadgets futés, tout pour la tech du quotidien.' },
    ],
  },
  {
    key: 'mode',
    name: 'Mode & Luxe',
    tagline: 'L\'élégance à l\'ivoirienne',
    sector: 'Mode & Luxe',
    colors: { p: '#0f0f0f', p2: '#b45309', p3: '#e7e5e4', bg: '#fafaf9' },
    font: 'Playfair Display',
    hero: HERO_IMAGES.mode,
    layouts: ['center', 'split', 'banner'],
    categories: [
      { name: 'Vêtements', key: 'fashion', prices: [15000, 120000], labels: ['Chemise en lin', 'Robe élégante', 'Costume 2 pièces', 'Jupe chic', 'Pantalon habillé', 'Blouse brodée', 'Veste en jean', 'Ensemble pagne wax'], desc: 'Des coupes impeccables et des matières nobles pour toutes vos occasions.' },
      { name: 'Sacs', key: 'bags', prices: [20000, 85000], labels: ['Sac à main cuir', 'Sacoche homme', 'Sac bandoulière', 'Portefeuille cuir', 'Sac cabas', 'Pochette soirée'], desc: 'Cuir de qualité et finitions soignées, le détail qui fait toute la différence.' },
      { name: 'Montres & Accessoires', key: 'watches', prices: [15000, 150000], labels: ['Montre automatique', 'Montre minimaliste', 'Montre chronographe', 'Montre en cuir', 'Bracelet de montre', 'Lunettes de soleil'], desc: 'Précision horlogère et style intemporel pour affirmer votre personnalité.' },
    ],
  },
  {
    key: 'beaute',
    name: 'Beauté & Bien-être',
    tagline: 'Révélez votre éclat naturel',
    sector: 'Beauté & Bien-être',
    colors: { p: '#db2777', p2: '#9d174d', p3: '#c2410c', bg: '#fdf2f8' },
    font: 'Playfair Display',
    hero: HERO_IMAGES.beaute,
    layouts: ['center', 'banner', 'split'],
    categories: [
      { name: 'Cosmétiques', key: 'cosmetics', prices: [5000, 45000], labels: ['Fond de teint hydratant', 'Rouge à lèvres mat', 'Palette de maquillage', 'Mascara volume', 'Poudre compacte', 'Sérum éclat', 'Huile de coco pure', 'Beurre de karité'], desc: 'Des cosmétiques adaptés aux peaux tropicales, riches en actifs naturels.' },
      { name: 'Parfums', key: 'perfume', prices: [15000, 75000], labels: ['Eau de parfum florale', 'Eau de toilette boisée', 'Parfum oriental', 'Eau de parfum vanillée', 'Déodorant parfumé', 'Coffret découverte'], desc: 'Des fragrances envoûtantes qui laissent un sillage inoubliable.' },
      { name: 'Soins', key: 'skincare', prices: [4000, 30000], labels: ['Crème hydratante visage', 'Gommage corps', 'Masque à l\'argile', 'Huile de douche', 'Crème mains karité', 'Lait corporel coco', 'Soin capillaire naturel'], desc: 'Des soins doux et efficaces pour une peau rayonnante toute l\'année.' },
    ],
  },
  {
    key: 'maison',
    name: 'Maison & Déco',
    tagline: 'Un intérieur qui vous ressemble',
    sector: 'Maison & Déco',
    colors: { p: '#b45309', p2: '#78350f', p3: '#65a30d', bg: '#fffbeb' },
    font: 'Lora',
    hero: HERO_IMAGES.maison,
    layouts: ['banner', 'split', 'center'],
    categories: [
      { name: 'Mobilier', key: 'furniture', prices: [45000, 350000], labels: ['Canapé 3 places', 'Table basse en bois', 'Fauteuil scandinave', 'Bibliothèque', 'Table à manger', 'Lit queen size', 'Chaise design'], desc: 'Des meubles élégants et durables, pensés pour les intérieurs africains modernes.' },
      { name: 'Décoration', key: 'deco', prices: [8000, 60000], labels: ['Lampe d\'ambiance', 'Vase artisanal', 'Cadre doré', 'Miroir mural', 'Tapis berbère', 'Coussin décoratif', 'Bougies parfumées', 'Plante artificielle'], desc: 'La touche déco parfaite pour une maison chaleureuse et personnelle.' },
      { name: 'Ustensiles', key: 'kitchen', prices: [5000, 55000], labels: ['Coffret de couteaux', 'Batterie de cuisine', 'Ustensiles en bois', 'Plaque de cuisson', 'Service de plats', 'Carafe filtrante'], desc: 'Le nécessaire pratique et esthétique pour votre cuisine au quotidien.' },
    ],
  },
  {
    key: 'alimentation',
    name: 'Alimentation & Épicerie fine',
    tagline: 'Le goût authentique de la Côte d\'Ivoire',
    sector: 'Alimentation & Épicerie fine',
    colors: { p: '#dc2626', p2: '#14532d', p3: '#f59e0b', bg: '#fef2f2' },
    font: 'DM Serif Display',
    hero: HERO_IMAGES.alimentation,
    layouts: ['banner', 'center', 'split'],
    categories: [
      { name: 'Produits frais', key: 'food', prices: [1500, 25000], labels: ['Corbeille de fruits', 'Panier de légumes', 'Ananas Victoria', 'Poissons frais', 'Arachides grillées', 'Fruits de saison', 'Légumes verts bio'], desc: 'Fraîcheur garantie, récolté avec soin et livré à votre porte.' },
      { name: 'Épicerie fine', key: 'epicerie', prices: [2000, 35000], labels: ['Café arabica ivoirien', 'Cacao en poudre', 'Miel de forêt', 'Huile de palme artisanale', 'Attiéké premium', 'Épices à sauce', 'Beurre d\'arachide', 'Thé aux épices'], desc: 'Sélection de produits du terroir ivoirien, authentiques et savoureux.' },
      { name: 'Douceurs', key: 'sweet', prices: [2500, 20000], labels: ['Coffret de chocolats', 'Confiseries locales', 'Biscuits au beurre', 'Miel et pollen', 'Pâte de mangue', 'Gâteaux artisanaux'], desc: 'Des douceurs artisanales pour les moments gourmands en famille.' },
    ],
  },
  {
    key: 'enfants',
    name: 'Enfants & Jouets',
    tagline: 'La joie des petits, la confiance des parents',
    sector: 'Enfants & Jouets',
    colors: { p: '#f59e0b', p2: '#b45309', p3: '#3b82f6', bg: '#fffbeb' },
    font: 'Baloo 2',
    hero: HERO_IMAGES.enfants,
    layouts: ['center', 'banner', 'split'],
    categories: [
      { name: 'Jouets', key: 'toys', prices: [5000, 65000], labels: ['Peluche douce', 'Jeu de construction', 'Poupée articulée', 'Voiture télécommandée', 'Puzzle éducatif', 'Dinosaure lumineux', 'Coffret de magie', 'Bâton de pluie'], desc: 'Des jouets sûrs et éducatifs qui éveillent l\'imagination des enfants.' },
      { name: 'Vêtements enfants', key: 'kids', prices: [5000, 25000], labels: ['Ensemble bébé coton', 'Robe de petite fille', 'Short garçon', 'Pyjama douillet', 'Baskets enfants', 'Salopette en jean', 'T-shirt rigolo'], desc: 'Des vêtements doux et colorés, adaptés à la peau fragile des enfants.' },
      { name: 'Éveil & Scolaire', key: 'school', prices: [3000, 30000], labels: ['Cartable enfant', 'Kit de coloriage', 'Boîte à lettres', 'Tableau magnétique', 'Crayons de couleur', 'Sac à dos maternelle'], desc: 'Tout pour l\'école et l\'éveil, dans la bonne humeur.' },
    ],
  },
  {
    key: 'bijoux',
    name: 'Bijoux & Accessoires',
    tagline: 'L\'éclat de la pureté',
    sector: 'Bijoux & Accessoires',
    colors: { p: '#b45309', p2: '#451a03', p3: '#eab308', bg: '#fffbf3' },
    font: 'Cormorant Garamond',
    hero: HERO_IMAGES.bijoux,
    layouts: ['center', 'split', 'banner'],
    categories: [
      { name: 'Colliers', key: 'jewelry', prices: [10000, 90000], labels: ['Collier en or fin', 'Collier perles d\'eau', 'Sautoir moderne', 'Collier pendentif', 'Collier ras-de-cou', 'Collier plaqué or'], desc: 'Des colliers raffinés, alliant éclat doré et finesse artisanale.' },
      { name: 'Bagues & Bracelets', key: 'rings', prices: [8000, 75000], labels: ['Bague solitaire', 'Bracelet chaîne', 'Bracelet perles', 'Bague stacking', 'Bracelet homme', 'Bague émeraude'], desc: 'L\'accessoire qui sublime chaque tenue, du bureau aux grandes occasions.' },
      { name: 'Boucles & Parures', key: 'earrings', prices: [6000, 45000], labels: ['Boucles d\'oreilles pendantes', 'Puces dorées', 'Créoles fines', 'Parure complète', 'Boucles perles', 'Barrettes nacrées'], desc: 'Des boucles d\'oreilles qui captent la lumière et attirent les regards.' },
    ],
  },
  {
    key: 'art',
    name: 'Art & Artisanat',
    tagline: 'L\'art africain dans toute sa splendeur',
    sector: 'Art & Artisanat',
    colors: { p: '#7c3aed', p2: '#4c1d95', p3: '#d97706', bg: '#faf5ff' },
    font: 'Fraunces',
    hero: HERO_IMAGES.art,
    layouts: ['split', 'center', 'banner'],
    categories: [
      { name: 'Tableaux & Peintures', key: 'art', prices: [15000, 250000], labels: ['Tableau abstrait', 'Peinture figurative', 'Toile textile', 'Aquarelle encadrée', 'Composition moderne', 'Tableau mosaïque'], desc: 'Des œuvres uniques d\'artistes africains contemporains, livrées avec certificat.' },
      { name: 'Sculptures', key: 'sculpture', prices: [12000, 120000], labels: ['Sculpture en bois', 'Masque traditionnel', 'Statue en bronze', 'Figurine résine', 'Totem décoratif', 'Buste artisanal'], desc: 'Le savoir-faire ancestral des artisans ivoiriens au service de la décoration.' },
      { name: 'Artisanat', key: 'craft', prices: [5000, 60000], labels: ['Panier tissé', 'Pagne tissé', 'Vannerie traditionnelle', 'Bol en bois sculpté', 'Bijoux artisanaux', 'Tapis en fibre'], desc: 'Des pièces artisanales uniques, faites main avec passion et authenticité.' },
    ],
  },
  {
    key: 'fitness',
    name: 'Santé & Fitness',
    tagline: 'Un corps sain, un esprit vif',
    sector: 'Santé & Fitness',
    colors: { p: '#059669', p2: '#064e3b', p3: '#f97316', bg: '#ecfdf5' },
    font: 'Poppins',
    hero: HERO_IMAGES.fitness,
    layouts: ['split', 'banner', 'center'],
    categories: [
      { name: 'Matériel de fitness', key: 'fitness', prices: [10000, 150000], labels: ['Haltères réglables', 'Tapis de yoga', 'Corde à sauter pro', 'Kettlebell 8 kg', 'Bandes élastiques', 'Vélo d\'appartement', 'Barre de musculation', 'Rouleau de massage'], desc: 'L\'équipement complet pour vous entraîner efficacement à la maison.' },
      { name: 'Sportswear', key: 'sportswear', prices: [8000, 40000], labels: ['T-shirt training', 'Legging compression', 'Bras de yoga', 'Short de course', 'Veste légère', 'Débardeur homme'], desc: 'Des vêtements techniques qui suivent tous vos mouvements.' },
      { name: 'Nutrition & Santé', key: 'nutrition', prices: [5000, 60000], labels: ['Complément protéiné', 'Shaker de sport', 'Infusion détente', 'Barres énergétiques', 'Balance connectée', 'Bouteille 1L'], desc: 'Accompagnez vos efforts avec une nutrition adaptée et du matériel malin.' },
    ],
  },
];

export const DEMO_SHOPS = [
  { slug: 'sportiva', name: 'Sportiva Abidjan', theme: 'sport', tagline: 'Vos équipements sportifs premium à Cocody' },
  { slug: 'technoplus', name: 'TechnoPlus CI', theme: 'tech', tagline: 'La high-tech au meilleur prix à Abidjan' },
  { slug: 'luxemode', name: 'Luxe Mode', theme: 'mode', tagline: 'L\'élégance au cœur de la capitale' },
  { slug: 'beauteafrica', name: 'Beauté Africa', theme: 'beaute', tagline: 'Votre beauté, notre passion' },
  { slug: 'maisonceleste', name: 'Maison Céleste', theme: 'maison', tagline: 'L\'art de vivre à la ivoirienne' },
  { slug: 'epicurienne', name: 'L\'Épicurienne', theme: 'alimentation', tagline: 'Les saveurs du terroir ivoirien' },
  { slug: 'kidozone', name: 'KidoZone', theme: 'enfants', tagline: 'La joie des petits, la confiance des parents' },
  { slug: 'bijouxdor', name: 'Bijoux d\'Or', theme: 'bijoux', tagline: 'L\'éclat du raffinement' },
  { slug: 'artci', name: 'Art & Création CI', theme: 'art', tagline: 'L\'art africain contemporain' },
  { slug: 'vitalfitness', name: 'Vital Fitness', theme: 'fitness', tagline: 'Soyez votre meilleure version' },
];

export const SIZE_VARIANTS = ['S', 'M', 'L', 'XL', 'XXL'];
export const COLORS = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Or', 'Bordeaux'];

export const REVIEW_NAMES = ['Awa K.', 'Jean-Marc D.', 'Fatou C.', 'Koffi A.', 'Mariam T.', 'Yao B.', 'Aminata S.', 'Éric N.', 'Grace K.', 'Ibrahim S.', 'Clarisse M.', 'Serge O.'];

export const REVIEW_COMMENTS = [
  'Produit conforme à la description, livraison rapide à Abidjan. Je recommande !',
  'Très belle qualité, rapport qualité-prix excellent.',
  'Service client au top, je reviendrai sûrement.',
  'Emballage soigné et produit superbe. Merci !',
  'Livré en 24h à Yopougon, je suis ravie de mon achat.',
  'La qualité est au rendez-vous, exactement comme sur les photos.',
  'Excellent produit, ma femme adore !',
  'Bonne communication et livraison ponctuelle.',
];

export const LANDING_DEFAULTS = {
  heroTitle: 'Créez votre boutique en ligne en 5 minutes',
  heroSubtitle: 'La plateforme n°1 en Côte d\'Ivoire pour vendre en ligne : boutique premium, paiement Orange Money, MTN MoMo & Wave, livraison partout dans le pays.',
  features: [
    { icon: 'store', title: 'Boutique premium', text: 'Un site e-commerce magnifique et complet, prêt en quelques clics.' },
    { icon: 'smartphone', title: 'Paiements mobiles', text: 'Orange Money, MTN MoMo et Wave intégrés pour encaisser partout.' },
    { icon: 'palette', title: '10 thèmes premium', text: 'Sport, mode, beauté, high-tech… une maquette adaptée à votre secteur.' },
    { icon: 'truck', title: 'Livraison simplifiée', text: 'Zones Abidjan et intérieur du pays avec calcul automatique des frais.' },
    { icon: 'chart', title: 'Pilotage complet', text: 'Tableau de bord, produits, stocks, commandes et statistiques.' },
    { icon: 'globe', title: 'Sous-domaine offert', text: 'Votre boutique accessible sur votreboutique.laboutique.ci, domaine à brancher ensuite.' },
  ],
  testimonials: [
    { name: 'Aminata Koné', role: 'Boutique de cosmétiques, Abidjan', avatar: IMG.portraits[0], text: 'J\'ai lancé ma boutique de cosmétiques en un après-midi. Les paiements Mobile Money ont doublé mes ventes.' },
    { name: 'Yao Kouassi', role: 'Sport & équipements, Bouaké', avatar: IMG.portraits[1], text: 'Mes clients de l\'intérieur du pays commandent désormais directement en ligne. Une vraie révolution !' },
    { name: 'Fatou Cissé', role: 'Mode & accessoires, Yopougon', avatar: IMG.portraits[2], text: 'Le thème Mode & Luxe est magnifique. Mes clientes adorent l\'expérience, les avis et les partages WhatsApp.' },
  ],
  faq: [
    { q: 'Combien coûte la création de ma boutique ?', a: 'La création est gratuite. Vous choisissez votre formule premium ensuite, avec des frais fixes simples et transparents.' },
    { q: 'Quels moyens de paiement puis-je proposer ?', a: 'Orange Money, MTN Mobile Money et Wave, activables ou désactivables dans vos paramètres, plus le paiement à la livraison.' },
    { q: 'Puis-je utiliser mon propre nom de domaine ?', a: 'Oui ! Chaque boutique reçoit un sous-domaine gratuit (votreboutique.laboutique.ci) et vous pouvez connecter votre propre domaine.' },
    { q: 'Comment sont gérées les livraisons ?', a: 'Vous définissez vos zones (Abidjan, intérieur) et les frais forfaitaires. Le total est calculé automatiquement à la commande.' },
    { q: 'Puis-je commencer avec des produits déjà en place ?', a: 'Bien sûr : choisissez une boutique prête à l\'emploi avec produits, images et bannières, puis personnalisez-la.' },
  ],
};

export const LAYOUT_VARIANTS = {
  banner: { label: 'Bannière large', hint: 'Image de fond plein écran, titre centré' },
  split: { label: 'Image / Texte', hint: 'Bannière à gauche, texte à droite' },
  center: { label: 'Centré minimal', hint: 'Titre centré, ambiance épurée' },
};