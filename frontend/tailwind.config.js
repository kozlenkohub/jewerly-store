import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#8c2d60',
        secondaryColor: '#8c2d60',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
