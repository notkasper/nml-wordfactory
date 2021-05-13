import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4, 12, 4, 12),
  },
}));

const PageContainer = (props) => {
  const { children } = props;
  const classes = useStyles();

  return <div className={classes.container}>{children}</div>;
};

export default PageContainer;
