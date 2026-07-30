import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./packages/react/src/test/setup.ts'],
    include: ['packages/react/src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
