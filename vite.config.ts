import { defineConfig } from 'vite';
import { inlineIcons } from './scripts/icons.js';

export default defineConfig({
  plugins: [
    {
      name: 'inline-icons',
      transformIndexHtml: (html) => inlineIcons(html),
    },
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        privacidade: 'politica-de-privacidade.html',
      },
    },
  },
});
