import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import 'chartjs-plugin-colorschemes';
// PAGES
import LessonView from './pages/home';
import Profile from './pages/profile';
import Class from './pages/class';
import Lesson from './pages/lesson';
import Student from './pages/student';
import StudentLesson from './pages/studentLesson';
import QuestionGroup from './pages/questionGroup';
import Students from './pages/students';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

const ContentRouter = (props) => {
  const { authStore, lessonStore } = props;
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Switch>
        <Route
          exact
          path="/dashboard/home"
          render={(props) => <LessonView {...props} authStore={authStore} />}
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
          render={(props) => <StudentLesson {...props} authStore={authStore} />}
        />
        <Route
          exact
          path="/dashboard/questionGroups/:questionGroupId/:tab"
          render={(props) => <QuestionGroup {...props} authStore={authStore} />}
        />
        <Route
          exact
          path="/dashboard/students"
          render={(props) => <Students {...props} authStore={authStore} />}
        />
      </Switch>
    </main>
  );
};

export default ContentRouter;
