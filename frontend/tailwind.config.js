import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#3d113b',
        secondaryColor: '#3d113b',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
