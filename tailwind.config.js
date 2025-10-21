// tailwind.config.js (Example Structure)

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... other config (content, theme) ...
  
  plugins: [
    import('tw-animate-css'),
    // Assuming the correct package name for 'tailwindcss-intersect' is the common one:
    import('tailwindcss-intersect'), 
  ],
};