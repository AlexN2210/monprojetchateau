import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import faviconPlugin from './vite-plugin-favicon';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), faviconPlugin()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Garder les favicons dans le dossier public
          if (assetInfo.name && assetInfo.name.includes('favicon')) {
            return 'assets/[name].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
