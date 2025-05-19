import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    hmr: true,
  },
  build: {
    outDir: 'dist/playground',
    rollupOptions: {
      input: {
        main: 'playground/index.html',
      },
    },
  },
});
