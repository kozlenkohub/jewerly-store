import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#6a176a',
        secondaryColor: '#6a176a',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
