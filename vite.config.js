import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
    // optimizeDeps: {
    //     exclude: ['js-big-decimal']
    // },
    plugins: [
        AutoImport({
            // targets to transform
            include: [
              /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
              /\.vue$/, /\.vue\?vue/, // .vue
              /\.md$/, // .md
            ],
          
            // global imports to register
            imports: [
              // presets
              'vue',
              'pinia',
              'vue-router',
              // custom
              {
                '@vueuse/core': [
                  // named imports
                  'useMouse', // import { useMouse } from '@vueuse/core',
                  // alias
                  ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
                ]
              },
              // example type import
              {
                from: 'vue-router',
                imports: ['RouteLocationRaw'],
                type: true,
              },
            ],
            // Enable auto import by filename for default module exports under directories
            defaultExportByFilename: false,
          
            // Auto import for module exports under directories
            // by default it only scan one level of modules under the directory
            dirs: [
              './resources/js/stores/**',
              './resources/js/composables/**'
            ],
          
            // Filepath to generate corresponding .d.ts file.
            // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
            // Set `false` to disable.
            dts: './auto-imports.d.ts',
          
            // Auto import inside Vue template
            // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
            vueTemplate: false,
          
            // Custom resolvers, compatible with `unplugin-vue-components`
            // see https://github.com/antfu/unplugin-auto-import/pull/23/
            resolvers: [
              /* ... */
            ],
          
            // Inject the imports at the end of other imports
            injectAtEnd: true,
          
            // Generate corresponding .eslintrc-auto-import.json file.
            // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
            eslintrc: {
              enabled: false, // Default `false`
              filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
              globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
          }),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue(),
    ],
});