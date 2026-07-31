import './globals.css';

export const metadata = {
  title: {
    default: 'LaBoutique.ci — Créez votre boutique en ligne en 5 minutes',
    template: '%s | LaBoutique.ci',
  },
  description:
    'Plateforme SaaS e-commerce en Côte d\'Ivoire : boutique premium en 5 minutes, paiement Orange Money, MTN MoMo & Wave, livraison dans tout le pays.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=DM+Serif+Display&family=Baloo+2:wght@500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Barlow+Condensed:wght@400;500;600;700&family=Fraunces:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛍️</text></svg>" />
      </head>
      <body className="min-h-screen antialiased text-gray-900">{children}</body>
    </html>
  );
}