import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    // extra plugins here
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
  server: {
    proxy: {
      // Proxy ALL other requests (like Ember's --proxy)
      '^/': {
        target: process.env.PROXY,
        changeOrigin: true,
        // Optional: Rewrite the path if needed
        // rewrite: (path) => path,
      },
    },
  },
});
