import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#0fa3b1',
        secondaryColor: '#592e83',
        textColor: '#333333',
      },
    },
  },
  plugins: [forms],
};
