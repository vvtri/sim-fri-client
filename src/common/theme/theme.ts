import { createTheme } from '@mui/material';
import { fontFamily } from '../constants/index.constant';
import './theme.d';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: string) =>
  augmentColor({ color: { main: mainColor } });

export const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: fontFamily,
    },
  },

  palette: {
    primary: createColor('#1877f2'),
    secondary: createColor('#2b9217'),
    primaryText: createColor('#E4E6EB'),
    secondaryText: createColor('#B0B3B8'),
    primaryIcon: createColor('#616466'),
    darkAccent: createColor('#242526'),
    secondaryButton: {
      ...createColor('rgba(255,255,255,.1)'),
      contrastText: 'white',
    },
    divider: '#3E4042',
    hoverColor: createColor('#4e4f50'),
    comment: createColor('#3A3B3C'),
    _white: {
      main: '#fff',
      contrastText: '#fff',
      dark: '#fff',
      light: '#fff',
    },
    homeBg: createColor('#18191A'),
    secondaryBlue: {
      main: '#263951',
      dark: '#3C4D63',
      contrastText: '#2D88FF',
      light: '#263951',
    },
  },

  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: { fontSize: '14px' },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: { margin: 0, fontSize: 'inherit', color: 'inherit' },
      },
    },
    MuiSvgIcon: { styleOverrides: { root: { display: 'block' } } },
    MuiCard: {
      styleOverrides: { root: { backgroundColor: '#242526', color: 'white' } },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'inherit' } },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'inherit' } },
    },
  },
});
