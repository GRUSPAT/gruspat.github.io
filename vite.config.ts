import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';

interface VendorRule {
  name: string;
  match: RegExp;
}

const VENDOR_RULES: VendorRule[] = [
  { name: 'vendor-physics', match: /rapier/ },
  { name: 'vendor-three', match: /three|@react-three/ },
  { name: 'vendor-gsap', match: /gsap/ },
  { name: 'vendor-react', match: /react|zustand/ },
];

export default defineConfig({
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  plugins: [
    react(),
    imagetools(),
  ],
  build: {
    chunkSizeWarningLimit: 2600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          const matched = VENDOR_RULES.find((rule) => rule.match.test(id));
          return matched ? matched.name : 'vendor-misc';
        },
      },
    },
  },
});
