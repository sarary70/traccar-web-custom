import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';
import components from './components';

// Add Tajawal font import
const tajawalFont = {
  fontFamily: 'Tajawal, Roboto, Segoe UI, Helvetica Neue, Arial, sans-serif',
  '@import': 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap',
};

export default (server, darkMode, direction) => useMemo(() => {
  const isRTL = direction === 'rtl';
  
  return createTheme({
    direction,
    typography: {
      fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Segoe UI, Helvetica Neue, Arial, sans-serif',
      h1: {
        fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
        fontWeight: 600,
      },
      h3: {
        fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
        fontWeight: 500,
      },
      h5: {
        fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
        fontWeight: 500,
      },
      h6: {
        fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
        fontWeight: 500,
      },
      button: {
        fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
        textTransform: 'none',
      },
    },
    components: {
      ...components,
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            '@font-face': [tajawalFont],
            html: {
              direction,
            },
            body: {
              fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
              '& a': {
                textDecoration: 'none',
              },
            },
          },
        },
      },
    },
    palette: palette(server, darkMode),
    dimensions,
    shape: {
      borderRadius: 8,
    },
  });
}, [server, darkMode, direction]);
