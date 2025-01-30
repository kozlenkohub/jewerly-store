import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#335D8B',
        secondaryColor: '#335D8B',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
