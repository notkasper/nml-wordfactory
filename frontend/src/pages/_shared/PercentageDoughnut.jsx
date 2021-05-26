import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Doughnut } from 'react-chartjs-2';

import Title from './Title';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const PercentageDoughnut = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const { title, data, options, titleColor } = props;
  const color = titleColor ? titleColor : theme.widget.primary.main;

  return (
    <Grid item xs={12} md={4}>
      <Paper className={classes.paper}>
        <Title color={color}>{title}</Title>
        <Doughnut data={data} options={options} />
      </Paper>
    </Grid>
  );
};

PercentageDoughnut.propTypes = {
  children: PropTypes.node,
};

export default PercentageDoughnut;
