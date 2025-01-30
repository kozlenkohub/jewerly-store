import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#820a52',
        secondaryColor: '#820a52',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
