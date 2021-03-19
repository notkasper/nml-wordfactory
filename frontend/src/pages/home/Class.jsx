import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const Class = (props) => {
  const { name, createdAt, id } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>{name}</Title>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`gemaakt op: ${createdAt.substring(0, 10)}`}
      </Typography>
      <div>
        <Link color="primary" href={`classes/${id}`}>
          Klas bekijken
        </Link>
      </div>
    </React.Fragment>
  );
};

export default Class;
