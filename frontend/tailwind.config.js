import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#592e83',
        secondaryColor: '#592e83',
        textColor: '#333333',
      },
    },
  },
  plugins: [forms],
};
