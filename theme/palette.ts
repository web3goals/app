import { PaletteOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    green: string;
    blue: string;
    red: string;
    orange: string;
    purpleLight: string;
    purpleDark: string;
    greyDark: string;
  }
}

export const palette: PaletteOptions = {
  primary: {
    main: "#2B6EFD",
  },
  success: {
    main: "#1DB954",
  },
  error: {
    main: "#FF4400",
  },
  divider: "#DDDDDD",
  green: "#1DB954",
  blue: "#2B6EFD",
  red: "#FF4400",
  orange: "#E97E27",
  purpleLight: "#9747FF",
  purpleDark: "#410C92",
  greyDark: "#333333",
};
