// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import Pages from 'vite-plugin-pages'

// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
// import ReactPlugin from 'vite-preset-react';
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills'


// // https://vitejs.dev/config/
// export default defineConfig({
//   resolve: {
//     alias: {
//       // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
//       // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
//       // process and buffer are excluded because already managed
//       // by node-globals-polyfill
//       util: 'rollup-plugin-node-polyfills/polyfills/util',
//       sys: 'util',
//       events: 'rollup-plugin-node-polyfills/polyfills/events',
//       stream: 'rollup-plugin-node-polyfills/polyfills/stream',
//       path: 'rollup-plugin-node-polyfills/polyfills/path',
//       querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
//       punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
//       url: 'rollup-plugin-node-polyfills/polyfills/url',
//       string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
//       http: 'rollup-plugin-node-polyfills/polyfills/http',
//       https: 'rollup-plugin-node-polyfills/polyfills/http',
//       os: 'rollup-plugin-node-polyfills/polyfills/os',
//       assert: 'rollup-plugin-node-polyfills/polyfills/assert',
//       constants: 'rollup-plugin-node-polyfills/polyfills/constants',
//       _stream_duplex:
//         'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
//       _stream_passthrough:
//         'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
//       _stream_readable:
//         'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
//       _stream_writable:
//         'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
//       _stream_transform:
//         'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
//       timers: 'rollup-plugin-node-polyfills/polyfills/timers',
//       console: 'rollup-plugin-node-polyfills/polyfills/console',
//       vm: 'rollup-plugin-node-polyfills/polyfills/vm',
//       zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
//       tty: 'rollup-plugin-node-polyfills/polyfills/tty',
//       domain: 'rollup-plugin-node-polyfills/polyfills/domain',
//     },
//   },
//   optimizeDeps: {
//     // include: [ 'esm-dep > cjs-dep' ],
//     // disabled: "dev",
//     esbuildOptions: {
//       // Node.js global to browser globalThis
//       define: {
//         // 'process.env.NODE_DEBUG': 'false',
//         global: 'globalThis',
//       },
//       // Enable esbuild polyfill plugins
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           process: true,
//           buffer: true,
//         }),
//         NodeModulesPolyfillPlugin(),
//       ],
//     },
//   },
//   plugins: [
//     // ReactPlugin({ injectReact: false }),
//     react(),
//     tsconfigPaths(),
//     Pages({
//       dirs: 'src/pages',
//     }),
//     rollupNodePolyFill(),
//   ],
//   server: {
//     watch: {
//       usePolling: true,
//     },
//   },
// })


// import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import Pages from 'vite-plugin-pages'
// import { defineConfig } from 'vite'
// import nodePolyfills from 'rollup-plugin-polyfill-node';

// export default defineConfig({
//   build: {
//     target: 'es2020',
//     minify: false,
//     // disable @rollup/plugin-commonjs https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
//     // should be removable with vite 4 https://vitejs.dev/blog/announcing-vite3.html#esbuild-deps-optimization-at-build-time-experimental
//     commonjsOptions: {
//       include: []
//     }
//   },
//   define: {
//     'process.env.NODE_DEBUG': 'false',
//     'global': 'globalThis',
//   },
//   optimizeDeps: {
//     // include: [ 'esm-dep > cjs-dep' ],
//     // disabled: "dev",

//     esbuildOptions: {
//       target: 'es2020',
//       // Node.js global to browser globalThis
//       define: {
//         // 'process.env.NODE_DEBUG': 'false',
//         global: 'globalThis',
//       },
//       // Enable esbuild polyfill plugins
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           process: true,
//           buffer: true,
//         }),
//         NodeModulesPolyfillPlugin(),
//       ],
//     },
//   },
//   plugins: [
//     react(),
//     tsconfigPaths(),
//     Pages({ dirs: 'src/pages' }),
//     nodePolyfills(),
//   ],
// })






//* SIMPLEST CONFIG - v1
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tsconfigPaths from 'vite-tsconfig-paths';
// import Pages from 'vite-plugin-pages'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tsconfigPaths(),
//     Pages({ dirs: 'src/pages' }),
//   ],
//   base: '/clipify/',
//   build: {
//     outDir: './build'
//   }
// })



//* SIMPLEST CONFIG - #2
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import Pages from 'vite-plugin-pages'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import path from 'path';
import inject from '@rollup/plugin-inject';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import eslint from 'vite-plugin-eslint';


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2020',
    minify: false,
    // disable @rollup/plugin-commonjs https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
    // should be removable with vite 4 https://vitejs.dev/blog/announcing-vite3.html#esbuild-deps-optimization-at-build-time-experimental
    commonjsOptions: {
      include: []
    },
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
        inject({
          include: [ 'node_modules/**' ],
          modules: {
            Buffer: [ 'buffer', 'Buffer' ],
          }
        })
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/*'),
      stream: "stream-browserify",
      path: 'rollup-plugin-node-polyfills/polyfills/path',
    }
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': 'globalThis',
    'Buffer': 'globalThis.Buffer',
  },
  // optimizeDeps: {
  //   // enable esbuild dep optimization during build https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
  //   // should be removable with vite 4 https://vitejs.dev/blog/announcing-vite3.html#esbuild-deps-optimization-at-build-time-experimental
  //   disabled: false,

  //   // target: es2020 added as workaround to make big ints work
  //   // - should be removable with vite 4
  //   // https://github.com/vitejs/vite/issues/9062#issuecomment-1182818044
  //   esbuildOptions: {
  //     target: 'es2020'
  //   }
  //},
  plugins: [
    react({
      include: "**/*.tsx"
    }),
    eslint(),
    tsconfigPaths(),
    Pages({ dirs: 'src/pages' }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        'process.env.NODE_DEBUG': 'false',
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: false,
          buffer: true,
        }),
        // NodeModulesPolyfillPlugin(),
      ],
    },
  },
})

// //fix error  : Buffer is not defined in React-vite
// //
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tsconfigPaths from 'vite-tsconfig-paths';
// import Pages from 'vite-plugin-pages'
// import nodePolyfills from 'rollup-plugin-polyfill-node';

// // https://vitejs.dev/config/
// export default defineConfig({
//   define: {
//     'process.env.NODE_DEBUG': 'false',
//     'global': 'globalThis'
//   },
//   plugins: [
//     react(),
//     tsconfigPaths(),
//     Pages({ dirs: 'src/pages' }),
//     nodePolyfills(),
//   ],
// })


