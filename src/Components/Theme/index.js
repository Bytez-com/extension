import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = responsiveFontSizes(
  createMuiTheme({
    props: {
      MuiUseMediaQuery: { noSsr: true }
    },
    palette: {
      type: "light",
      primary: {
        main: "#6200EE"
      },
      secondary: {
        main: "#03DAC5"
      }
    }
  })
);

theme.palette.colors = {
  primary: {
    900: "#23036A",
    800: "#30009C",
    700: "#3700B3",
    600: "#5600E8",
    500: "#6200EE",
    400: "#7F39FB",
    300: "#985EFF",
    200: "#BB86FC",
    100: "#DBB2FF",
    50: "#F2E7FE"
  },
  secondary: {
    900: "#005457",
    800: "#017374",
    700: "#018786",
    600: "#019592",
    500: "#01A299",
    400: "#00B3A6",
    300: "#00C4B4",
    200: "#03DAC5",
    100: "#70EFDE",
    50: "#C8FFF4"
  },
  textLight: "rgba(255,255,255,.74) !important",
  surfaceGray: "#FAFAFA"
};

export default theme;
