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

// TODO: this is duplicate code! Make sure to create store for this and then call shared _utils.js
const convertCategoryToString = (category) => {
  const conversion = {
    learning_process: 'Leerproces',
    recognizing_morphemes_sentence: 'Herkennen morfemen in een zin',
    meaning_morphemes: 'Betekenis morfemen',
    splitsing_morphemes: 'Splits morfemen',
    create_morphemes_prefix: 'Creëren morfemen (voorvoegsel)',
    background_morphemes: 'Alternatieve betekenis morfemen',
    recognizing_morphemes_text: 'Herkennen morfemen in een tekst',
    intuition: 'Intuïtie',
    create_alternative_morphemes: 'Creëren alternatieve morfemen',
    create_morphemes_suffix: 'Creëren morfemen (achtervoegsel)',
    create_new_morphemes: 'Creëren nieuwe morfemen',
  };

  return conversion[category];
};

const Insights = (props) => {
  const { topResults, bottomResults, categories } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <PageContainer>
      <Grid container spacing={2} className={classes.widget}>
        <PaperWithHeader
          headercolor={theme.widget.primary.main}
          headertitle="Ondergemiddelde prestaties"
          height={370}
        >
          <DataGrid
            pageSize={5}
            rows={bottomResults}
            columns={columns}
            sortModel={[
              {
                field: 'correctness',
                sort: 'asc',
              },
            ]}
          />
        </PaperWithHeader>
        <PaperWithHeader
          headercolor={theme.widget.primary.main}
          headertitle="Bovengemiddelde prestaties"
          height={370}
        >
          <DataGrid
            rows={topResults}
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
          headertitle="Probleemcategorieën"
        >
          <Paper className={classes.paper}>
            {categories.slice(0, 3).map((category, index) => (
              <ProgressBar
                key={category.key}
                title={`${index + 1}. ${convertCategoryToString(category.key)}`}
                value={category.correctness}
              />
            ))}
          </Paper>
        </PaperWithHeader>
        <PaperWithHeader
          headercolor={theme.widget.secondary.main}
          headertitle="Topcategorieën"
        >
          <Paper className={classes.paper}>
            {categories.slice(-3).map((category, index) => (
              <ProgressBar
                key={category.key}
                title={`${index + 1}. ${convertCategoryToString(category.key)}`}
                value={category.correctness}
              />
            ))}
          </Paper>
        </PaperWithHeader>
      </Grid>
    </PageContainer>
  );
};

export default Insights;
