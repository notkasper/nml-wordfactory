import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const calculateRGB = (percentage) => {
  const shade = 0.8;
  const color = Math.floor(
    (percentage <= 50 ? percentage / 50 : (100 - percentage) / 50) * 255
  );
  const rgb = (percentage <= 50
    ? [255, color, 0]
    : [color, 255, 0]
  ).map((color) => Math.round(color * shade));
  return `rgb(${rgb.join(',')})`;
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: 20,
    borderRadius: 5,
    margin: theme.spacing(1),
  },
  bar: (props) => ({
    borderRadius: 5,
    backgroundColor: calculateRGB(props.value),
  }),
  colorPrimary: {
    backgroundColor: '#DDDDDD',
  },
}));

const ProgessBar = (props) => {
  const classes = useStyles(props);

  return (
    <Box>
      <Typography>{props.title}</Typography>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress
            variant="determinate"
            classes={{
              root: classes.root,
              colorPrimary: classes.colorPrimary,
              bar: classes.bar,
            }}
            {...props}
          />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

ProgessBar.propTypes = {
  value: PropTypes.number.isRequired,
};

export default ProgessBar;
