/** Formatage des prix en FCFA */
export const formatFCFA = (n) =>
  `${new Intl.NumberFormat('fr-FR').format(Math.round(Number(n) || 0))} FCFA`;

export const formatFCFACompact = (n) =>
  `${new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(Number(n) || 0)} F`;

export const priceAfter = (p) => {
  if (!p.oldPrice || !p.oldPrice > p.price) return p.price;
  return p.price;
};

export const discountPct = (p) =>
  p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;