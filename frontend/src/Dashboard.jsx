import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import 'chartjs-plugin-colorschemes';
import routes from './routes';
import Menu from './Menu';
import AppBar from './AppBar';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

const Dashboard = (props) => {
  const { authStore, lessonStore, questionStore } = props;
  const classes = useStyles();

  return (
    <Switch>
      {routes.map(({ exact, path, name, Component }) => (
        <Route
          key={path}
          exact={exact}
          path={path}
          render={(props) => {
            const crumbs = routes
              // Get all routes that contain the current one.
              .filter(({ path }) => props.match.path.includes(path))
              // Swap out any dynamic routes with their param values.
              // E.g. "/pizza/:pizzaId" will become "/pizza/1"
              .map(({ path, ...rest }) => ({
                path: Object.keys(props.match.params).length
                  ? Object.keys(props.match.params).reduce(
                      (path, param) =>
                        path.replace(`:${param}`, props.match.params[param]),
                      path
                    )
                  : path,
                ...rest,
              }));

            return (
              <>
                <AppBar />
                <Menu authStore={authStore} />
                <main className={classes.content}>
                  <div className={classes.appBarSpacer} />
                  <Component
                    authStore={authStore}
                    lessonStore={lessonStore}
                    questionStore={questionStore}
                    crumbs={crumbs}
                    {...props}
                  />
                </main>
              </>
            );
          }}
          name={name}
        />
      ))}
    </Switch>
  );
};

export default Dashboard;
