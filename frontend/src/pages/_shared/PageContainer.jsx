import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const PageContainer = (props) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      {children}
    </Container>
  );
};

export default PageContainer;
