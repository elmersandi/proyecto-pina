import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Cambia esta URL por el dominio real del ingeniero cuando lo tengan
  const urlBase = 'https://www.proyectopina.com';

  return {
    rules: {
      userAgent: '*', // Le permite la entrada a todos los buscadores (Google, Bing, etc.)
      allow: '/', // Les permite leer toda la web pública
      disallow: ['/admin/', '/sistema-interno-2026-xyz/'], // Prohíbe estrictamente espiar tu panel de control
    },
    sitemap: `${urlBase}/sitemap.xml`, // Le dice a Google dónde está tu mapa del sitio
  };
}