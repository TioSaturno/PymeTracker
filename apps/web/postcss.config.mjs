// apps/web/postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- El nuevo nombre del plugin
    autoprefixer: {},
  },
};