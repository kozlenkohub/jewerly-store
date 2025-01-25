import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainColor: '#50A5C4',
        secondaryColor: '#50A5C4',
        textColor: '#383838',
      },
    },
  },
  plugins: [forms],
};
