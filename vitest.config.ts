import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    alias: {
      // @dnd-kit uses React hooks internally — mock the entire dnd-kit in tests
      // to avoid React/Preact context conflicts in jsdom
      '@dnd-kit/core': '/src/__mocks__/@dnd-kit/core.tsx',
      '@dnd-kit/sortable': '/src/__mocks__/@dnd-kit/sortable.tsx',
      '@dnd-kit/utilities': '/src/__mocks__/@dnd-kit/utilities.ts',
    },
  },
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
});
