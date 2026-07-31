/** Simulation d'envoi d'email (log console + onglet réseau local) */
export function sendMail({ to, subject, html }) {
  const line = `\n\u2709 EMAIL SIMULÉ → ${to}  |  ${subject}\n${html}\n`;
  // eslint-disable-next-line no-console
  console.log(line);
  return { ok: true, to, subject };
}

export const mailTemplates = {
  welcome: (name) => ({
    subject: 'Bienvenue sur LaBoutique.ci 🎉',
    html: `Bonjour <b>${name}</b>,<br/>Votre compte a été créé avec succès. Connectez-vous et créez votre boutique dès maintenant !`,
  }),
  orderConfirmed: (ref) => ({
    subject: `Confirmation de commande ${ref}`,
    html: `Votre commande <b>${ref}</b> a été confirmée. Nous vous remercions !`,
  }),
  orderPaid: (ref) => ({
    subject: `Paiement reçu pour ${ref}`,
    html: `Le paiement de la commande <b>${ref}</b> a bien été reçu. Bonne attente de votre livraison !`,
  }),
  reset: (link) => ({
    subject: 'Réinitialisation de votre mot de passe',
    html: `Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${link}">${link}</a> (valable 1 heure).`,
  }),
  newOrder: (shop, ref) => ({
    subject: `Nouvelle commande ${ref} 🛒`,
    html: `Votre boutique <b>${shop}</b> a reçu une nouvelle commande <b>${ref}</b>.`,
  }),
};