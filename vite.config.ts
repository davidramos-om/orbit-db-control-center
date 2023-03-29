import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import Pages from 'vite-plugin-pages'
import eslint from 'vite-plugin-eslint';
import Inject from '@rollup/plugin-inject';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
// import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'


//! NOTES : ABOUT POLYFILL fs, process, buffer for orbit-db and ipfs
//* - nodePolyfills from "vite-plugin-node-stdlib-browser" works well for development, but not for build
//* - nodePolyfills from "vite-plugin-node-polyfills"  seems to work well for both development and build
//* - it looks like is not needed to set up the esbuildOptions for optimizeDeps
//* - it looks like is {protocolImports: true} is not needed.



//! https://vitejs.dev/config/

export default defineConfig({ 
  // build: {
  //   target: 'es2020',
  //   minify: false,
  //   commonjsOptions: {
  //     include: []
  //   },
  //   rollupOptions: {
  //     plugins: [ rollupNodePolyFill() ],
  //   }
  // },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     // Node.js global to browser globalThis
  //     define: {
  //       global: 'globalThis'
  //     },
  //     // Enable esbuild polyfill plugins
  //     plugins: [
  //       NodeGlobalsPolyfillPlugin({
  //         process: true,
  //         buffer: true
  //       }),
  //     ]
  //   }
  // },
  resolve: {
    alias: {
      '~/': path.resolve(__dirname, './src/*'),
      // fs: 'fs-browserify',
      // stream: "stream-browserify",
      // path: 'rollup-plugin-node-polyfills/polyfills/path',
    }
  },
  // define: {
  //   'process.env.NODE_DEBUG': 'false',
  //   'global': 'globalThis',
  //   'Buffer': 'globalThis.Buffer',
  // },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     // Node.js global to browser globalThis
  //     define: {
  //       'process.env.NODE_DEBUG': 'false',
  //       global: 'globalThis',
  //     },
  //     // Enable esbuild polyfill plugins
  //     plugins: [
  //       NodeGlobalsPolyfillPlugin({
  //         buffer: true,
  //         process: true,
  //       }),
  //       // NodeModulesPolyfillPlugin(),
  //     ],
  //   },
  // },
  plugins: [
    react({
      include: "**/*.tsx"
    }),
    eslint(),
    tsconfigPaths(),
    Pages({ dirs: 'src/pages' }),
    nodePolyfills(),
  ],
});
