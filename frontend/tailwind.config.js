import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#006747',
        secondaryColor: '#4D9F7C',
      },
    },
  },
  plugins: [forms],
};
