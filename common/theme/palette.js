import { grey } from '@mui/material/colors';

const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',
  background: {
    default: darkMode ? '#1a1a2e' : '#f8f9fa',
    paper: darkMode ? '#16213e' : '#ffffff',
  },
  primary: {
    main: validatedColor(server?.attributes?.colorPrimary) || (darkMode ? '#4cc9f0' : '#1a73e8'),
    light: darkMode ? '#83c9f4' : '#63a4ff',
    dark: darkMode ? '#0095c7' : '#004ba0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary) || (darkMode ? '#f72585' : '#e91e63'),
    light: darkMode ? '#ff5c9f' : '#ff6090',
    dark: darkMode ? '#bf004f' : '#b0003a',
    contrastText: '#ffffff',
  },
  neutral: {
    main: grey[500],
  },
  geometry: {
    main: '#4cc9f0',
  },
  alwaysDark: {
    main: '#1a1a2e',
  },
  text: {
    primary: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
    secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    disabled: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
  },
  divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
});
