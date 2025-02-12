import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#621b59',
        secondaryColor: '#621b59',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
