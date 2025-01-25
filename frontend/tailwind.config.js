import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#27A8E9',
        secondaryColor: '#27A8E9',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
