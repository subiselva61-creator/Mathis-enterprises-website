/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // Avoid conflicting with existing global CSS resets and dark theme
  corePlugins: {
    preflight: false,
  },
};
