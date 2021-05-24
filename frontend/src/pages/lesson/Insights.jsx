import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { observer } from 'mobx-react-lite';
import Doughnut from './Doughnut';
import Histogram from './Histogram';
import InsightsAfter from './InsightsAfter';
import InsightsDuring from './InsightsDuring';
import Button from '@material-ui/core/Button';

const calculateProgress = (questionGroupAttempts = []) => {
  const total = questionGroupAttempts.length;
  const completed = questionGroupAttempts.reduce((acc, curr) => {
    if (curr.isCompleted) {
      acc += 1;
    }

    return acc;
  }, 0);

  return total !== 0 ? Math.floor((completed / total) * 100) : 100;
};

const useStyles = makeStyles((theme) => ({
  datagrid: {
    marginTop: '1rem',
    '& .MuiDataGrid-row:hover': {
      cursor: 'pointer',
    },
  },
}));

const Lesson = (props) => {
  const [showCategory, setShowCategory] = useState('after');
  //  const [page, setPage] = useState(0);

  const changeCategory = () => {
    setShowCategory(showCategory === 'during' ? 'after' : 'during');
  };

  const getContent = () => {
    return showCategory === 'after' ? (
      <InsightsAfter {...props} />
    ) : (
      <InsightsDuring {...props} />
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid
        container
        spacing={2}
        style={{ justifyContent: 'center', display: 'flex' }}
      >
        <Grid
          item
          xs={4}
          md={4}
          style={{
            display: 'flex',
            direction: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '2rem',
            paddingTop: '2rem',
          }}
        >
          <Grid item style={{ paddingRight: '1rem' }}>
            <Button
              variant="contained"
              color={showCategory === 'during' ? 'primary' : 'default'}
              onClick={changeCategory}
            >
              Tijdens de les
            </Button>
          </Grid>
          <Grid item style={{ paddingLeft: '1rem' }}>
            <Button
              variant="contained"
              color={showCategory === 'after' ? 'primary' : 'default'}
              onClick={changeCategory}
            >
              Achteraf
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        {getContent()}
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <Doughnut
          lessonAttempts={lessonStore.lessonAttempts}
          title="Algemene voortgang"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Histogram
          lessonAttempts={lessonStore.lessonAttempts}
          title="Cijfer verdeling"
        />
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <DataGrid
            className={classes.datagrid}
            autoHeight
            rows={lessonStore.lessonAttempts}
            columns={columns}
            pageSize={12}
            onRowClick={onClickStudent}
          />
        </Paper>
      </Grid> */}
    </Grid>
  );
};

export default observer(Lesson);
