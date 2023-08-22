/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        "source-code": ["'Source Code Pro', monospace"],
      },
    },
  },

  plugins: [],
};

module.exports = config;
