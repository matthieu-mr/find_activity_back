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
    },
  });
  

  export default theme