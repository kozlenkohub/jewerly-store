import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#320C30',
        secondaryColor: '#320C30',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
