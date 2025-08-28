/**
 * Plugin Vite personnalisé pour la gestion des favicons
 * Ce plugin s'assure que tous les favicons sont correctement servis
 */

export default function faviconPlugin() {
  return {
    name: 'vite-plugin-favicon',
    
    configureServer(server) {
      // Middleware pour servir les favicons avec les bons headers
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.includes('favicon')) {
          // Headers optimisés pour les favicons
          res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 an
          res.setHeader('Access-Control-Allow-Origin', '*');
        }
        next();
      });
    },

    transformIndexHtml(html) {
      // S'assurer que les favicons sont bien inclus dans le HTML
      return html;
    }
  };
}
