import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^react(?:\/.*)?$/,
        /^react-dom(?:\/.*)?$/,
        /^@manti-ui\//,
        /^@zag-js\//,
        /^@tanstack\//,
      ],
    },
  },
});
