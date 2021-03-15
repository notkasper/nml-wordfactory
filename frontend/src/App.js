import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/login';
import AuthStore from './stores/auth';

const theme = createMuiTheme({
  status: {
    danger: orange[500],
  },
});

// define stores
const authStore = new AuthStore();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => <Login {...props} authStore={authStore} />}
          />
          <Route
            path="/home"
            exact
            render={(props) => (
              <div>
                <p>Logged in!</p>
              </div>
            )}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
