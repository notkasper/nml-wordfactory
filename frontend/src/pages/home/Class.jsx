import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import Title from './Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const Class = (props) => {
  const { name, createdAt, id } = props;
  const history = useHistory();
  const classes = useStyles();
  const goToClass = () => {
    history.push(`classes/${id}`);
  };
  return (
    <React.Fragment>
      <Title>{name}</Title>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`gemaakt op: ${createdAt.substring(0, 10)}`}
      </Typography>
      <div>
        <Link color="primary" onClick={goToClass} href="#">
          Klas bekijken
        </Link>
      </div>
    </React.Fragment>
  );
};

export default Class;
