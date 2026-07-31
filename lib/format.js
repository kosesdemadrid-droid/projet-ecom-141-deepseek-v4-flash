/** Helpers de formatage sans dépendances Node (utilisables côté client) */
export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });