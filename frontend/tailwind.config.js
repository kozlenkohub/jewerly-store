import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#4D9F7C',
        secondaryColor: '#2E3A3A',
      },
    },
  },
  plugins: [forms],
};
