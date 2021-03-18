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

const Lesson = (props) => {
  const { title, prefix, createdAt, groupId } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>{prefix}</Title>
      <Typography component="p" variant="h4">
        {title}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`gemaakt op: ${createdAt.substring(0, 10)}`}
      </Typography>
      <div>
        <Link color="primary" href={`course/${groupId}`}>
          Les bekijken
        </Link>
      </div>
    </React.Fragment>
  );
};

export default Lesson;
