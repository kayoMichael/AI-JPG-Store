const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        accent: colors.purple[600],
        'accent-foreground': colors.white,
      },
    },
  },
  plugins: [],
};
