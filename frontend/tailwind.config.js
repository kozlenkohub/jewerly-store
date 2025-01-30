import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#002B5B',
        secondaryColor: '#002B5B',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
