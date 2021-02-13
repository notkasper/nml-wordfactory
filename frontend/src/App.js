import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import Analyzer from './Analyzer';

const theme = createMuiTheme({
  status: {
    danger: orange[500],
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Analyzer />
    </ThemeProvider>
  );
};

export default App;
