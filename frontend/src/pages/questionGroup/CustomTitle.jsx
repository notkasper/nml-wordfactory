import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    textAlign: 'center',
    overflow: 'auto',
    justifyContent: 'center',
    backgroundColor: theme.widget.secondary.main,
    color: 'white',
    alignItems: 'baseline',
  },
  fixedHeight: {
    height: 400,
  },
}));

const CustomTitle = (props) => {
  const { name, label } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">{name} </Typography>
      <Box paddingLeft={2}>
        <Typography variant="subtitle1">({label})</Typography>
      </Box>
    </Paper>
  );
};

export default CustomTitle;
