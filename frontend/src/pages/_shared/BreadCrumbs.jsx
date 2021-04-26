import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Route } from 'react-router-dom';

const breadcrumbNameMap = {
  '/home': 'Overzicht',
  '/home/classes': 'Klassen',
  '/home/classes/:id': 'Rrreee',
};

const useStyles = makeStyles(() => ({
  root: {
    color: 'white',
  },
  text: {
    color: 'white',
  },
}));

const BreadCrumbs = () => {
  const classes = useStyles();

  return (
    <Route>
      {({ match, location }) => {
        console.log(match);
        const pathnames = location.pathname
          .split('/')
          .filter((x) => x)
          .map((x) => (x === 'dashboard' ? 'home' : x));

        console.log(pathnames);

        return (
          <Breadcrumbs aria-label="Breadcrumb" className={classes.root}>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;

              return last ? (
                <Typography className={classes.text} key={to}>
                  {breadcrumbNameMap[to]}
                </Typography>
              ) : (
                <RouterLink
                  className={classes.text}
                  to={`/dashboard${to}`}
                  key={to}
                >
                  {breadcrumbNameMap[to]}
                </RouterLink>
              );
            })}
          </Breadcrumbs>
        );
      }}
    </Route>
  );
};

export default BreadCrumbs;
