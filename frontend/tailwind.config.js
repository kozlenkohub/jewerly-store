import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#4a0c4a',
        secondaryColor: '#4a0c4a',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
