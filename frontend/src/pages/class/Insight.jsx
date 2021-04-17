import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';

import ProgressBar from './ProgressBar';

const useStyles = makeStyles((theme) => ({
	widget: {
    height: 230,
    padding: theme.spacing(3),
		marginBottom: theme.spacing(12),
  },
	paper: {
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		height: 230,
		padding: theme.spacing(3),
	},
	table: {
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
	paperheader: {
		textAlign: 'center',
		color: 'white',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
	}
}));

const columns = [
  {
    field: 'student',
    headerName: 'Naam',
    width: 200,
    valueGetter: (params) => params.row.name
  },
  {
		field: 'correctness',
		headerName: 'Gem. correctheid (%)',
		width: 200,
		valueGetter: (params) => params.row.correctness
	}
];

const Insight = () => {
	const classes = useStyles();
	const theme = useTheme();

  return (
		<div>
			<Grid container spacing={3} className={classes.widget}>
				<Grid item xs={12} md={6}>
					<Paper className={classes.paperheader} style={{ backgroundColor: theme.widget.primary.main }}>
						<Typography>Leerlingen die aandacht nodig hebben</Typography>
					</Paper>
					<Paper className={classes.table}>
						<DataGrid
							autoHeight
							rows={[
								{ id: 1, name: 'Naam 1', correctness: 29 }, 
								{ id: 2, name: 'Naam 2', correctness: 33 }, 
								{ id: 3, name: 'Naam 3', correctness: 34 }
							]}
							columns={columns}
							hideFooterPagination={true}
						/>
					</Paper>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper className={classes.paperheader} style={{ backgroundColor: theme.widget.primary.main }}>
						<Typography>Top 3 leerlingen</Typography>
					</Paper>
					<Paper className={classes.table}>
						<DataGrid
							autoHeight
							rows={[
								{ id: 4, name: 'Naam 1', correctness: 89 }, 
								{ id: 5, name: 'Naam 2', correctness: 84 }, 
								{ id: 6, name: 'Naam 3', correctness: 79 }
							]}
							columns={columns}
							hideFooterPagination={true}
						/>
					</Paper>
				</Grid>
			</Grid>
			<Grid container spacing={3} className={classes.widget}>
				<Grid item xs={12} md={6}>
					<Paper className={classes.paperheader} style={{ backgroundColor: theme.widget.secondary.main }}>
						<Typography>Probleem categorieën</Typography>
					</Paper>
					<Paper className={classes.paper}>
						<ProgressBar title="1. Herken morfemen in woorden" value={38}/>
						<ProgressBar title="2. Herken morfemen in een zin" value={48}/>
						<ProgressBar title="3. Verwisselen morfemen" value={55}/>
					</Paper>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper className={classes.paperheader} style={{ backgroundColor: theme.widget.secondary.main }}>
						<Typography>Top categorieën</Typography>
					</Paper>
					<Paper className={classes.paper}>
						<ProgressBar title="1. Betekenis morfemen" value={97}/>
						<ProgressBar title="2. Splits morfemen" value={83}/>
						<ProgressBar title="3. Alternatieve betekenis morfemen" value={74}/>
					</Paper>
				</Grid>
			</Grid>
		</div>
  );
};

export default Insight;
