import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#4a0d47',
        secondaryColor: '#4a0d47',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
