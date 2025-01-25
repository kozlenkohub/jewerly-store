import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#67d7ff',
        secondaryColor: '#67d7ff',
        textColor: '#4C4C4C',
      },
    },
  },
  plugins: [forms],
};
