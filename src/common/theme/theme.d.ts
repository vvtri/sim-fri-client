import type { Palette } from '@mui/material';

type Temp = Palette; // for import not removed

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    darkAccent: Palette['primary'];
    secondaryButton: Palette['primary'];
    hoverColor: Palette['primary'];
    primaryText: Palette['primary'];
    secondaryText: Palette['primary'];
    primaryIcon: Palette['primary'];
    comment: Palette['primary'];
    _white: Palette['primary'];
    homeBg: Palette['primary'];
    secondaryBlue: Palette['primary'];
  }
  interface PaletteOptions {
    darkAccent?: PaletteOptions['primary'];
    secondaryButton?: PaletteOptions['primary'];
    hoverColor?: PaletteOptions['primary'];
    primaryText: Palette['primary'];
    secondaryText: Palette['primary'];
    primaryIcon: Palette['primary'];
    comment: Palette['primary'];
    _white: Palette['primary'];
    homeBg: Palette['primary'];
    secondaryBlue: Palette['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    darkAccent: true;
    secondaryButton: true;
    hoverColor: true;
    comment: true;
    primaryText: true;
    secondaryText: true;
    primaryIcon: true;
    _white: true;
    homeBg: true;
    secondaryBlue: true;
  }
}
declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    darkAccent: true;
    secondaryButton: true;
    hoverColor: true;
    comment: true;
    primaryText: true;
    secondaryText: true;
    primaryIcon: true;
    _white: true;
    homeBg: true;
    secondaryBlue: true;
  }
}
declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    darkAccent: true;
    secondaryButton: true;
    hoverColor: true;
    comment: true;
    primaryText: true;
    secondaryText: true;
    primaryIcon: true;
    _white: true;
    homeBg: true;
    secondaryBlue: true;
  }
}
declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    darkAccent: true;
    secondaryButton: true;
    hoverColor: true;
    comment: true;
    primaryText: true;
    secondaryText: true;
    primaryIcon: true;
    _white: true;
    homeBg: true;
    secondaryBlue: true;
  }
}
declare module '@mui/material/FormControl' {
  interface FormControlPropsColorOverrides {
    darkAccent: true;
    secondaryButton: true;
    hoverColor: true;
    comment: true;
    primaryText: true;
    secondaryText: true;
    primaryIcon: true;
    _white: true;
    homeBg: true;
    secondaryBlue: true;
  }
}
declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides {
    darkAccent: true;
    secondaryButton: true;
    hoverColor: true;
    comment: true;
    primaryText: true;
    secondaryText: true;
    primaryIcon: true;
    _white: true;
    homeBg: true;
    secondaryBlue: true;
  }
}
