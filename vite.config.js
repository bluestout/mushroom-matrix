import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
import tailwindcss from '@tailwindcss/vite';
import cleanup from '@by-association-only/vite-plugin-shopify-clean';
import pageReload from 'vite-plugin-page-reload';

export default defineConfig({
  plugins: [shopify(), tailwindcss(), cleanup(), pageReload('/tmp/theme.update')],
  build: {
    emptyOutDir: false,
  },
});
