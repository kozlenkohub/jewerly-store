import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#560c56',
        secondaryColor: '#560c56',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
