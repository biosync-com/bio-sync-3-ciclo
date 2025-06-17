module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    colors: {
      // Cores base do seu tema
      'black': { 1: '#000000' },
      'green': { 1: '#50E18A' },
      'gray': { 1: '#D9D9D9' },
      'white': { 1: '#EEEEEE' },
      
      // Cores para modos de acessibilidade
      'protanopia': {
        light: '#FFD6D6',
        dark: '#A50000'
      },
      'deuteranopia': {
        light: '#D6FFD6',
        dark: '#00A500'
      },
      'tritanopia': {
        light: '#D6F3FF',
        dark: '#0052A5'
      },
    },
    extend: {
      // Variáveis CSS para temas de daltonismo
      backgroundColor: {
        'protanopia': 'var(--protanopia-bg)',
        'deuteranopia': 'var(--deuteranopia-bg)',
        'tritanopia': 'var(--tritanopia-bg)',
      },
      textColor: {
        'protanopia': 'var(--protanopia-text)',
        'deuteranopia': 'var(--deuteranopia-text)',
        'tritanopia': 'var(--tritanopia-text)',
      },
      // Configurações de acessibilidade
      fontSize: {
        'accessibility-sm': ['0.875rem', { lineHeight: '1.5' }],
        'accessibility-base': ['1rem', { lineHeight: '1.5' }],
        'accessibility-lg': ['1.125rem', { lineHeight: '1.5' }],
      },
      // Efeitos de filtro para daltonismo
      filter: {
        'protanopia': 'url(#protanopia)',
        'deuteranopia': 'url(#deuteranopia)',
        'tritanopia': 'url(#tritanopia)',
      },
    },
  },
  plugins: [
    require('tailwindcss-accessibility')({
      target: 'wcag-aaa',
      textSubtle: false,
      backgroundSubtle: false,
    }),
    // Plugin para high contrast
    function({ addUtilities }) {
      const newUtilities = {
        '.high-contrast': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgb(0 0 0 / var(--tw-bg-opacity))',
          color: 'rgb(255 255 255 / var(--tw-text-opacity))',
          '--tw-text-opacity': '1',
        },
        '.protanopia-filter': {
          filter: 'url(#protanopia)',
        },
        '.deuteranopia-filter': {
          filter: 'url(#deuteranopia)',
        },
        '.tritanopia-filter': {
          filter: 'url(#tritanopia)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  // Variantes específicas para acessibilidade
  variants: {
    extend: {
      backgroundColor: ['high-contrast'],
      textColor: ['high-contrast'],
      filter: ['responsive'],
    },
  }
}