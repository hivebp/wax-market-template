module.exports = {
  purge: ['src/pages/**/*.{js,ts,jsx,tsx}', 'src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#f78e1e',
        secondary: '#0a0a0a',
        neutral: '#ffffff',
        invert: '#ff0000',
        page: '#0a0a0a',
        paper: '#3A3A3A',
      },
      fontFamily: {
        'main': 'Roboto',
        'sans': ['Rubik', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs-asset': '0.6rem',
        'sm-asset': '0.8rem'
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          lg: '0',
          xl: '0',
          '2xl': '1rem',
        },
      },
      minWidth: {
        'img-small': '2rem',
      },
      maxWidth: {
        'img-small': '2rem',
        'td': '6rem',
        'popup-lg': '36rem',
        'popup': '26rem',
        'filter': '26rem',
      },
      maxHeight: {
        'img-small': '2rem',
        'img-collection': '25rem',
        'img-asset': '37.5rem',
      },
      inset: {
        '22': '5.5rem'
      },
      width: {
        'asset': '14rem',
        'popup': '30rem',
        'popup-lg': '40rem',
      },
      height: {
        '6.5':'1.625rem',
        'asset': '23rem',
      },
      lineHeight: {
        'tab': '1.625rem',
      },
      zIndex: {
        '-10': '-10',
        '100': '100',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backgroundImage: theme => ({
        'collection-card': "url('/collection_card/Main.svg')"
      })
    }
  },
  variants: {
    extend: {
      textTransform: ['hover', 'focus'],
      fontFamily: ['hover', 'focus']
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}
