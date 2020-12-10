import { createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#e64a19',
        main: "#fafafa",
        dark: "#9fa8da",
        contrastText: '#fff',
        backgroundColor:"#9fa8da"
      },
      secondary: {
        light: "#80d6ff",
        main: '#42a5f5',
        dark:  "#0077c2",
        contrastText: '#fff',
        backgroundColor:"#9fa8da"
      },
      warning:{
        light: "#ff5f52",
        main: '#c62828',
        dark:  "#8e0000",
        contrastText: '#fff',
        backgroundColor:"#c62828"
      },
    },
    typography: {
      h1: {
        color: '#0077c2',
        fontSize: 50,
        fontFamily:"Roboto"
      },
      h2: {
        color: '#0077c2',
        fontSize: 40,
        fontFamily:"Roboto"
      },
      h3: {
        color: '#62757f',
        fontSize: 15,
      },

    },
  });
  

  export default theme