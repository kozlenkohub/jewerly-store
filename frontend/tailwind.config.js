import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#490d47',
        secondaryColor: '#490d47',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
