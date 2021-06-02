import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import utils from '../../stores/_utils';

const useStyles = makeStyles((theme) => ({
  card: {
    height: 180,
    display: 'flex',
    width: 600,
  },
  widget: {
    height: '100%',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',

    padding: theme.spacing(2),
  },
  widgetTop: {
    fontWeight: 400,
    padding: theme.spacing(2),
  },
  widgetBottom: {
    fontWeight: 100,
    padding: theme.spacing(2),
  },
}));

const Tile = (props) => {
  const { questionGroup, title, number, color } = props;
  const classes = useStyles();
  const amountLessons = questionGroup.questions.length;
  const averageElapsedTime = utils.convertToMinutes(
    questionGroup.averageElapsedTime
  );
  const value = number === 1 ? amountLessons : averageElapsedTime;

  return (
    <Card style={{ backgroundColor: color }} className={classes.card}>
      <CardActionArea onClick={props.onClick}>
        <CardContent>
          <Grid container spacing={1} className={classes.widget}>
            <Typography variant="h5" className={classes.widgetTop}>
              {title}
            </Typography>
            <Typography variant="h5" className={classes.widgetBottom}>
              {value}
            </Typography>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

Tile.propTypes = {
  children: PropTypes.node,
};

export default Tile;
