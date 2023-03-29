import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import Pages from 'vite-plugin-pages'
import eslint from 'vite-plugin-eslint';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

//! NOTES : ABOUT POLYFILL fs, process, buffer for orbit-db and ipfs
//* - nodePolyfills from "vite-plugin-node-stdlib-browser" works well for development, but not for build
//* - nodePolyfills from "vite-plugin-node-polyfills"  seems to work well for both development and build
//* - it looks like is not needed to set up the esbuildOptions for optimizeDeps
//* - it looks like is {protocolImports: true} is not needed.
//* - More complex polyfills using optimizeDeps, build, rollup, etc. did not work for me when it comes to build for production.

//! https://vitejs.dev/config/

export default defineConfig({ 
  resolve: {
    alias: {
      '~/': path.resolve(__dirname, './src/*'),
    }
  },
  plugins: [
    react({
      include: "**/*.tsx"
    }),
    Pages({ dirs: 'src/pages' }),
    eslint(),
    tsconfigPaths(),
    nodePolyfills(),
  ],
});
