import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Cambia esta URL por el dominio real
  const urlBase = 'https://www.proyectopina.com';

  return [
    {
      url: `${urlBase}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1, // Prioridad máxima para la página principal
    },
    {
      url: `${urlBase}/cursos`, // Si tienes una página para ver todos los cursos
      lastModified: new Date(),
      changeFrequency: 'daily', // Le decimos que esta se actualiza diario
      priority: 0.8,
    },
    {
      url: `${urlBase}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5, // Prioridad baja porque es solo para iniciar sesión
    },
  ];
}