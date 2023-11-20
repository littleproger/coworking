import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // ... other theme customizations
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'rgb(255, 155, 0)',
          borderColor: 'rgb(255, 155, 0)',
          fill: 'rgb(255, 155, 0)',
          '&:hover':{
            backgroundColor: 'rgba(252, 162, 17, 0.1)',
            borderColor: 'rgb(215, 145, 0)',
          },
        },
        contained:{
          backgroundColor: '#fca311ff',
          color: 'white',
          fill: 'white',
          '&:hover':{
            backgroundColor: 'rgb(221, 136, 0)',
          },
        },
      },
    },
  },
});
