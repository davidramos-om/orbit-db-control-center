import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import Pages from 'vite-plugin-pages'
import eslint from 'vite-plugin-eslint';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

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
  resolve: {
    alias: {
      '~/': path.resolve(__dirname, './src/*'),
      stream: "stream-browserify",
      path: 'rollup-plugin-node-polyfills/polyfills/path',
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
    nodePolyfills()
  ],
});
