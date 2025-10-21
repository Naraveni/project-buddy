// postcss.config.js - Use standard CommonJS module format
module.exports = {
  plugins: {
    // 1. Core Tailwind plugin: Use the name 'tailwindcss'
    '@tailwindcss/postcss': {},
    
    // 2. Autoprefixer is standard and highly recommended
    'autoprefixer': {},
  },
};