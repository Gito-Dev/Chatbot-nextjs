/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'typing-bounce1': {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.2'
          },
          '50%': {
            transform: 'translateY(-4px)',
            opacity: '1'
          }
        },
        'typing-bounce2': {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.2'
          },
          '50%': {
            transform: 'translateY(-4px)',
            opacity: '1'
          }
        },
        'typing-bounce3': {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.2'
          },
          '50%': {
            transform: 'translateY(-4px)',
            opacity: '1'
          }
        }
      },
      animation: {
        'typing-bounce1': 'typing-bounce1 1s infinite ease-in-out',
        'typing-bounce2': 'typing-bounce2 1s infinite ease-in-out .2s',
        'typing-bounce3': 'typing-bounce3 1s infinite ease-in-out .4s'
      }
    },
  },
  plugins: [],
}