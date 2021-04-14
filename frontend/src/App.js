import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { observer } from 'mobx-react-lite';
import { defaults } from 'react-chartjs-2';
import { Classic10 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau';
import Menu from './Menu';
import AppBar from './AppBar';
import 'chartjs-plugin-colorschemes';
// PAGES
import Login from './pages/login';
import LessonView from './pages/home';
import Profile from './pages/profile';
import Class from './pages/class';
import Lesson from './pages/lesson';
import Student from './pages/student';
import StudentLesson from './pages/studentLesson';
import QuestionGroup from './pages/questionGroup';
// STORES
import authStore from './stores/auth';
import lessonStore from './stores/lessonStore';

defaults.global.plugins.colorschemes.scheme = Classic10;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
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

export default function Dashboard() {
  const classes = useStyles();

  const Dashboard = () => {
    return (
      <>
        <AppBar />
        <Menu authStore={authStore} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {/* ACTUAL INNER COMPONENT */}
          <Switch>
            <Route
              exact
              path="/dashboard/home"
              render={(props) => (
                <LessonView {...props} authStore={authStore} />
              )}
            />
            <Route
              exact
              path="/dashboard/profile"
              render={(props) => <Profile {...props} authStore={authStore} />}
            />
            <Route
              exact
              path="/dashboard/classes/:classId"
              render={(props) => <Class {...props} authStore={authStore} />}
            />
            <Route
              exact
              path="/dashboard/lessons/:lessonId/:tab"
              render={(props) => (
                <Lesson
                  {...props}
                  authStore={authStore}
                  lessonStore={lessonStore}
                />
              )}
            />
            <Route
              exact
              path="/dashboard/students/:studentId"
              render={(props) => <Student {...props} authStore={authStore} />}
            />
            <Route
              exact
              path="/dashboard/students/:studentId/lessons/:lessonId"
              render={(props) => (
                <StudentLesson {...props} authStore={authStore} />
              )}
            />
            <Route
              exact
              path="/dashboard/questionGroups/:questionGroupId/:tab"
              render={(props) => (
                <QuestionGroup {...props} authStore={authStore} />
              )}
            />
          </Switch>
        </main>
      </>
    );
  };

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        {/* Two main 'routes', the login screen, and the actual dashboard. The dashboard has its own sub-routes */}
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => <Login {...props} authStore={authStore} />}
          />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
      <ErrorPopup authStore={authStore} />
    </div>
  );
}
