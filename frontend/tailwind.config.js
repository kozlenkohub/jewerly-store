import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#1F3A63',
        secondaryColor: '#1F3A63',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
