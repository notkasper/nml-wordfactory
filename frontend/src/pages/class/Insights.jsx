import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { DataGrid } from '@material-ui/data-grid';
import PaperWithHeader from '../_shared/PaperWithHeader';
import ProgressBar from '../_shared/ProgressBar';
import PageContainer from '../_shared/PageContainer';

const useStyles = makeStyles((theme) => ({
  widget: {
    padding: theme.spacing(3),
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
    headerName: 'Gem. correctheid',
    flex: 0.5,
    valueGetter: (params) => params.row.correctness,
  },
];

const getRows = (studentResults) => {
  if (studentResults && studentResults.length) {
    const distribution = studentResults;
    const rows = [];

    distribution.forEach((row, index) => {
      rows.push({
        id: row.id,
        name: row.name,
        correctness: row.correctness,
      });
    });

    return rows;
  }

  return [];
};

const Insights = (props) => {
  const { topResults, bottomResults } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <PageContainer>
      <Grid container spacing={2} className={classes.widget}>
        <PaperWithHeader
          headercolor={theme.widget.primary.main}
          headertitle="Onderste 25%"
        >
          <DataGrid
            autoHeight
            pageSize={5}
            pagination
            rows={getRows(bottomResults)}
            columns={columns}
            sortModel={[
              {
                field: 'correctness',
                sort: 'desc',
              },
            ]}
          />
        </PaperWithHeader>
        <PaperWithHeader
          headercolor={theme.widget.primary.main}
          headertitle="Top 25%"
        >
          <DataGrid
            autoHeight
            rows={getRows(topResults)}
            pagination
            pageSize={5}
            sortModel={[
              {
                field: 'correctness',
                sort: 'desc',
              },
            ]}
            columns={columns}
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
    </PageContainer>
  );
};

export default Insights;
