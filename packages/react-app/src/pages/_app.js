import { ThemeProvider, theme, CSSReset } from '@chakra-ui/core';

import '../styles/globals.css'

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    purple: {
      50: '#f5e9ff',
      100: '#dac1f3',
      200: '#c098e7',
      300: '#a571dc',
      400: '#8c48d0',
      500: '#722fb7',
      600: '#59238f',
      700: '#3f1968',
      800: '#260f40',
      900: '#10031a',
    },
    spacejelly: '#692ba8'
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp