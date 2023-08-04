// vite.config.js
import { defineConfig } from "file:///home/todoo/Todoo/emd/node_modules/vite/dist/node/index.js";
import laravel from "file:///home/todoo/Todoo/emd/node_modules/laravel-vite-plugin/dist/index.mjs";
import vue from "file:///home/todoo/Todoo/emd/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///home/todoo/Todoo/emd/node_modules/unplugin-auto-import/dist/vite.js";
var vite_config_default = defineConfig({
  plugins: [
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/,
        // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/,
        // .vue
        /\.md$/
        // .md
      ],
      // global imports to register
      imports: [
        // presets
        "vue",
        "pinia",
        "vue-router",
        // custom
        {
          "@vueuse/core": [
            // named imports
            "useMouse",
            // import { useMouse } from '@vueuse/core',
            // alias
            ["useFetch", "useMyFetch"]
            // import { useFetch as useMyFetch } from '@vueuse/core',
          ]
        },
        // example type import
        {
          from: "vue-router",
          imports: ["RouteLocationRaw"],
          type: true
        }
      ],
      // Enable auto import by filename for default module exports under directories
      defaultExportByFilename: false,
      // Auto import for module exports under directories
      // by default it only scan one level of modules under the directory
      dirs: ["./resources/js/stores/**", "./resources/js/composables/**"],
      // Filepath to generate corresponding .d.ts file.
      // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
      // Set `false` to disable.
      dts: "./auto-imports.d.ts",
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
        enabled: false,
        // Default `false`
        filepath: "./.eslintrc-auto-import.json",
        // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true
        // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    }),
    laravel({
      input: ["resources/css/app.css", "resources/js/app.js"],
      refresh: true
    }),
    vue()
  ],
  server: {
    host: "0.0.0.0",
    hmr: {
      host: "localhost"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS90b2Rvby9Ub2Rvby9lbWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3RvZG9vL1RvZG9vL2VtZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS90b2Rvby9Ub2Rvby9lbWQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGxhcmF2ZWwgZnJvbSBcImxhcmF2ZWwtdml0ZS1wbHVnaW5cIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICAgICAgLy8gdGFyZ2V0cyB0byB0cmFuc2Zvcm1cbiAgICAgICAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgICAgICAgICAvXFwuW3RqXXN4PyQvLCAvLyAudHMsIC50c3gsIC5qcywgLmpzeFxuICAgICAgICAgICAgICAgIC9cXC52dWUkLyxcbiAgICAgICAgICAgICAgICAvXFwudnVlXFw/dnVlLywgLy8gLnZ1ZVxuICAgICAgICAgICAgICAgIC9cXC5tZCQvLCAvLyAubWRcbiAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgIC8vIGdsb2JhbCBpbXBvcnRzIHRvIHJlZ2lzdGVyXG4gICAgICAgICAgICBpbXBvcnRzOiBbXG4gICAgICAgICAgICAgICAgLy8gcHJlc2V0c1xuICAgICAgICAgICAgICAgIFwidnVlXCIsXG4gICAgICAgICAgICAgICAgXCJwaW5pYVwiLFxuICAgICAgICAgICAgICAgIFwidnVlLXJvdXRlclwiLFxuICAgICAgICAgICAgICAgIC8vIGN1c3RvbVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJAdnVldXNlL2NvcmVcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmFtZWQgaW1wb3J0c1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2VNb3VzZVwiLCAvLyBpbXBvcnQgeyB1c2VNb3VzZSB9IGZyb20gJ0B2dWV1c2UvY29yZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGlhc1xuICAgICAgICAgICAgICAgICAgICAgICAgW1widXNlRmV0Y2hcIiwgXCJ1c2VNeUZldGNoXCJdLCAvLyBpbXBvcnQgeyB1c2VGZXRjaCBhcyB1c2VNeUZldGNoIH0gZnJvbSAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIGV4YW1wbGUgdHlwZSBpbXBvcnRcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGZyb206IFwidnVlLXJvdXRlclwiLFxuICAgICAgICAgICAgICAgICAgICBpbXBvcnRzOiBbXCJSb3V0ZUxvY2F0aW9uUmF3XCJdLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgLy8gRW5hYmxlIGF1dG8gaW1wb3J0IGJ5IGZpbGVuYW1lIGZvciBkZWZhdWx0IG1vZHVsZSBleHBvcnRzIHVuZGVyIGRpcmVjdG9yaWVzXG4gICAgICAgICAgICBkZWZhdWx0RXhwb3J0QnlGaWxlbmFtZTogZmFsc2UsXG5cbiAgICAgICAgICAgIC8vIEF1dG8gaW1wb3J0IGZvciBtb2R1bGUgZXhwb3J0cyB1bmRlciBkaXJlY3Rvcmllc1xuICAgICAgICAgICAgLy8gYnkgZGVmYXVsdCBpdCBvbmx5IHNjYW4gb25lIGxldmVsIG9mIG1vZHVsZXMgdW5kZXIgdGhlIGRpcmVjdG9yeVxuICAgICAgICAgICAgZGlyczogW1wiLi9yZXNvdXJjZXMvanMvc3RvcmVzLyoqXCIsIFwiLi9yZXNvdXJjZXMvanMvY29tcG9zYWJsZXMvKipcIl0sXG5cbiAgICAgICAgICAgIC8vIEZpbGVwYXRoIHRvIGdlbmVyYXRlIGNvcnJlc3BvbmRpbmcgLmQudHMgZmlsZS5cbiAgICAgICAgICAgIC8vIERlZmF1bHRzIHRvICcuL2F1dG8taW1wb3J0cy5kLnRzJyB3aGVuIGB0eXBlc2NyaXB0YCBpcyBpbnN0YWxsZWQgbG9jYWxseS5cbiAgICAgICAgICAgIC8vIFNldCBgZmFsc2VgIHRvIGRpc2FibGUuXG4gICAgICAgICAgICBkdHM6IFwiLi9hdXRvLWltcG9ydHMuZC50c1wiLFxuXG4gICAgICAgICAgICAvLyBBdXRvIGltcG9ydCBpbnNpZGUgVnVlIHRlbXBsYXRlXG4gICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3VuanMvdW5pbXBvcnQvcHVsbC8xNSBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3VuanMvdW5pbXBvcnQvcHVsbC83MlxuICAgICAgICAgICAgdnVlVGVtcGxhdGU6IGZhbHNlLFxuXG4gICAgICAgICAgICAvLyBDdXN0b20gcmVzb2x2ZXJzLCBjb21wYXRpYmxlIHdpdGggYHVucGx1Z2luLXZ1ZS1jb21wb25lbnRzYFxuICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydC9wdWxsLzIzL1xuICAgICAgICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgICAgICAgICAgLyogLi4uICovXG4gICAgICAgICAgICBdLFxuXG4gICAgICAgICAgICAvLyBJbmplY3QgdGhlIGltcG9ydHMgYXQgdGhlIGVuZCBvZiBvdGhlciBpbXBvcnRzXG4gICAgICAgICAgICBpbmplY3RBdEVuZDogdHJ1ZSxcblxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgY29ycmVzcG9uZGluZyAuZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbiBmaWxlLlxuICAgICAgICAgICAgLy8gZXNsaW50IGdsb2JhbHMgRG9jcyAtIGh0dHBzOi8vZXNsaW50Lm9yZy9kb2NzL3VzZXItZ3VpZGUvY29uZmlndXJpbmcvbGFuZ3VhZ2Utb3B0aW9ucyNzcGVjaWZ5aW5nLWdsb2JhbHNcbiAgICAgICAgICAgIGVzbGludHJjOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsIC8vIERlZmF1bHQgYGZhbHNlYFxuICAgICAgICAgICAgICAgIGZpbGVwYXRoOiBcIi4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25cIiwgLy8gRGVmYXVsdCBgLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbmBcbiAgICAgICAgICAgICAgICBnbG9iYWxzUHJvcFZhbHVlOiB0cnVlLCAvLyBEZWZhdWx0IGB0cnVlYCwgKHRydWUgfCBmYWxzZSB8ICdyZWFkb25seScgfCAncmVhZGFibGUnIHwgJ3dyaXRhYmxlJyB8ICd3cml0ZWFibGUnKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6IFtcInJlc291cmNlcy9jc3MvYXBwLmNzc1wiLCBcInJlc291cmNlcy9qcy9hcHAuanNcIl0sXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgdnVlKCksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgICAgIGhtcjoge1xuICAgICAgICAgICAgaG9zdDogXCJsb2NhbGhvc3RcIixcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlQLFNBQVMsb0JBQW9CO0FBQzlRLE9BQU8sYUFBYTtBQUNwQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFFdkIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsV0FBVztBQUFBO0FBQUEsTUFFUCxTQUFTO0FBQUEsUUFDTDtBQUFBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLE1BQ0o7QUFBQTtBQUFBLE1BR0EsU0FBUztBQUFBO0FBQUEsUUFFTDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUVBO0FBQUEsVUFDSSxnQkFBZ0I7QUFBQTtBQUFBLFlBRVo7QUFBQTtBQUFBO0FBQUEsWUFFQSxDQUFDLFlBQVksWUFBWTtBQUFBO0FBQUEsVUFDN0I7QUFBQSxRQUNKO0FBQUE7QUFBQSxRQUVBO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixTQUFTLENBQUMsa0JBQWtCO0FBQUEsVUFDNUIsTUFBTTtBQUFBLFFBQ1Y7QUFBQSxNQUNKO0FBQUE7QUFBQSxNQUVBLHlCQUF5QjtBQUFBO0FBQUE7QUFBQSxNQUl6QixNQUFNLENBQUMsNEJBQTRCLCtCQUErQjtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS2xFLEtBQUs7QUFBQTtBQUFBO0FBQUEsTUFJTCxhQUFhO0FBQUE7QUFBQTtBQUFBLE1BSWIsV0FBVztBQUFBO0FBQUEsTUFFWDtBQUFBO0FBQUEsTUFHQSxhQUFhO0FBQUE7QUFBQTtBQUFBLE1BSWIsVUFBVTtBQUFBLFFBQ04sU0FBUztBQUFBO0FBQUEsUUFDVCxVQUFVO0FBQUE7QUFBQSxRQUNWLGtCQUFrQjtBQUFBO0FBQUEsTUFDdEI7QUFBQSxJQUNKLENBQUM7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNKLE9BQU8sQ0FBQyx5QkFBeUIscUJBQXFCO0FBQUEsTUFDdEQsU0FBUztBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNELE1BQU07QUFBQSxJQUNWO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
