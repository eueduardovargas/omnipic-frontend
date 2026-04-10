import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        card: '#141414',
        border: '#1F1F1F',
        muted: '#A0A0A0',
        accent: {
          violet: '#7C3AED',
          blue: '#2563EB',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #7C3AED, #2563EB)',
        'gradient-rose': 'linear-gradient(135deg, #F43F5E, #7C3AED)',
      },
    },
  },
  plugins: [],
};

export default config;
