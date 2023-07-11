import { createTheme } from '@mui/material/styles';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

export const mainTheme = createTheme({
  typography: {
    fontFamily: 'Montserrat', // default Material-UI font
    color: 'black',
    // body1: {
    //   fontFamily: 'Open Sans, sans-serif', // your chosen Google Font
    // },
    // You can also set the font family for other typography variants, like body2, h1, h2, etc.
  },
  palette: {
    primary: {
      main: '#88C1A7',
    },
    secondary: {
      main: '#FFFFFF',
    },
    whiteButton: createColor('#FFFFFF'),
    grayButton: createColor('#e6e6e6'),
  },
});
