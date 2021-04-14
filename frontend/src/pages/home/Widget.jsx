import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';

const useStyles = makeStyles((theme) => ({
  widget: {
    height: 150,
    padding: theme.spacing(3),
    color: 'white',
    display: 'flex',
    flexDirection: "column",
    justifyContent: "center",
  },
  widgetLeft: {
    textAlign: 'right',
    fontWeight: 400
  },
  widgetRight: {
    textAlign: 'left',
    fontWeight: 100
  }
}));

export default function Widget(props) {
	const classes = useStyles();

  return (
    <Grid item xs={12} md={4}>
			<Card style={{ backgroundColor: props.color }}>
				<CardActionArea>
					<CardContent>
						<Grid container spacing={3} className={classes.widget}>
							<Grid item xs={6}>
								<Typography variant="h2" className={classes.widgetLeft}>{props.left}</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h5" className={classes.widgetRight}>{props.right}</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</CardActionArea>
			</Card>
  	</Grid>
  );
}

Widget.propTypes = {
  children: PropTypes.node,
};
