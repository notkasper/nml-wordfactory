import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/login';
import LessonView from './pages/home';
import Profile from './pages/profile';
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
            render={(props) => <LessonView {...props} authStore={authStore} />}
          />
          <Route
            path="/profile"
            exact
            render={(props) => <Profile {...props} authStore={authStore} />}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
