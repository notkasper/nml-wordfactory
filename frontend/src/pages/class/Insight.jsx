import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { DataGrid } from '@material-ui/data-grid';

import PaperWithHeader from '../_shared/PaperWithHeader';
import ProgressBar from '../_shared/ProgressBar';

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
}));

const columns = [
  {
    field: 'student',
    headerName: 'Naam',
    flex: 0.65,
    valueGetter: (params) => params.row.name,
  },
  {
    field: 'correctness',
    headerName: 'Gem. correctheid (%)',
    flex: 0.35,
    valueGetter: (params) => params.row.correctness,
  },
];

const Insight = () => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div>
      <Grid container spacing={3} className={classes.widget}>
        <PaperWithHeader
          headercolor={theme.widget.primary.main}
          headertitle="Onderste 25%"
        >
          <DataGrid
            autoHeight
            rows={[
              { id: 1, name: 'Soledad Considine', correctness: 29 },
              { id: 2, name: 'Arvid Macejkovic', correctness: 33 },
              { id: 3, name: 'Allen Kunze', correctness: 34 },
            ]}
            columns={columns}
            hideFooterPagination={true}
          />
        </PaperWithHeader>
        <PaperWithHeader
          headercolor={theme.widget.primary.main}
          headertitle="Top 25%"
        >
          <DataGrid
            autoHeight
            rows={[
              { id: 4, name: 'Cleveland Smitham', correctness: 89 },
              { id: 5, name: 'Dejah Morissette', correctness: 84 },
              { id: 6, name: 'Maxine Zboncak', correctness: 79 },
            ]}
            columns={columns}
            hideFooterPagination={true}
          />
        </PaperWithHeader>
      </Grid>
      <Grid container spacing={3} className={classes.widget}>
        <PaperWithHeader
          headercolor={theme.widget.secondary.main}
          headertitle="Probleem categorieën"
        >
          <Paper className={classes.paper}>
            <ProgressBar title="1. Herken morfemen in woorden" value={38} />
            <ProgressBar title="2. Herken morfemen in een zin" value={48} />
            <ProgressBar title="3. Verwisselen morfemen" value={55} />
          </Paper>
        </PaperWithHeader>
        <PaperWithHeader
          headercolor={theme.widget.secondary.main}
          headertitle="Top categorieën"
        >
          <Paper className={classes.paper}>
            <ProgressBar title="1. Betekenis morfemen" value={97} />
            <ProgressBar title="2. Splits morfemen" value={83} />
            <ProgressBar
              title="3. Alternatieve betekenis morfemen"
              value={74}
            />
          </Paper>
        </PaperWithHeader>
      </Grid>
    </div>
  );
};

export default Insight;
