export default {
  root: './public/',
  base: './',
  publicDir: './public/',
  build: {
    outDir: './compiled/',
    entry: './src/services/app/new-app.ts',
    sourcemap: true,
    rollupOptions: {
      external: [
        'handlebars.min.js',
        './src/services/app/new-app.ts',
        './src/scripts/constprograms/handlebars/handlebars.min.js',
      ],
    },
  },
  server: {
    port: 3000,
    watch: ['src', 'server'],
  },
};