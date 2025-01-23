import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#2b50aa',
        secondaryColor: '#2b50aa',
        textColor: '#333333',
      },
    },
  },
  plugins: [forms],
};
