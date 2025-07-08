import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { defineConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), visualizer({ open: true })],

   server: {
      open: true,
      port: 3000,
   },

   resolve: {
      alias: {
         '@': path.resolve(__dirname, 'src'),
      },
   },

   test: {
      root: import.meta.dirname,
      name: packageJson.name,
      environment: 'jsdom',

      typecheck: {
         enabled: true,
         tsconfig: path.join(import.meta.dirname, 'tsconfig.json'),
      },

      globals: true,
      watch: false,
      setupFiles: ['./src/setupTests.ts'],
   },

   build: {
      sourcemap: true,
   },
});
