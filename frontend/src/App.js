import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { observer } from 'mobx-react-lite';
import { Chart, defaults } from 'react-chartjs-2';
import { Classic10 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau';
import Menu from './Menu';
import AppBar from './AppBar';
import Content from './Content';
import Login from './pages/login';
import 'chartjs-plugin-colorschemes';

// STORES
import authStore from './stores/auth';
import lessonStore from './stores/lessonStore';

defaults.global.plugins.colorschemes.scheme = Classic10;

const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw: function () {
    originalDoughnutDraw.apply(this, arguments);

    if (this.chart.config.options.elements.center) {
      const chart = this.chart.chart;
      const { text, color } = this.chart.config.options.elements.center;
      const { ctx, width, height } = chart;
      const fontSize = (height / 114).toFixed(2);
      ctx.font = fontSize + 'em Verdana';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;

      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
    }
  },
});

const theme = createMuiTheme({
  widget: {
    primary: {
      main: '#729ece',
    },
    secondary: {
      main: '#ff9e4a',
    },
    tertiary: {
      main: '#67bf5c',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const ErrorPopup = observer((props) => {
  const { authStore } = props;
  return (
    <Snackbar open={!!authStore.error}>
      <Alert severity="warning">{authStore.error}</Alert>
    </Snackbar>
  );
});

const LoginPage = () => <Login authStore={authStore} />;

const Dashboard = () => {
  return (
    <>
      <AppBar />
      <Menu authStore={authStore} />
      <Content authStore={authStore} lessonStore={lessonStore} />
    </>
  );
};

const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Router>
          <CssBaseline />
          {/* Two main routers, this top router checks if the user is logged in;
        If logged in -> Delegate routing to the dashboard component.
        Else -> Show login page */}
          <Switch>
            <Route path="/" exact component={LoginPage} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
        <ErrorPopup authStore={authStore} />
      </div>
    </ThemeProvider>
  );
};

export default App;
