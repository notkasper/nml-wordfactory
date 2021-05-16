import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
const computeProgress = (questionAttempts) => {};
const Progress = (props) => {
  const { courses } = props;
  console.log(courses);
  const theme = useTheme();
  return <Paper></Paper>;
};

export default Progress;
