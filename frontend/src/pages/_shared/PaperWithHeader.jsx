import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
	paperheader: {
		textAlign: 'center',
		color: 'white',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
	},
	papercontent: {
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
}));

const PaperWithHeader = (props) => {
	const classes = useStyles();

  return (
    <Grid item xs={12} md={6}>
			<Paper className={classes.paperheader} style={{ backgroundColor: props.headercolor }}>
					<Typography>{props.headertitle}</Typography>
			</Paper>
			<Paper className={classes.papercontent}>
					{props.children}
			</Paper>
    </Grid>
  );
}

PaperWithHeader.propTypes = {
  children: PropTypes.node,
};

export default PaperWithHeader;