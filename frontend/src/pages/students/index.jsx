import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react-lite';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import PageContainer from '../_shared/PageContainer';
import service from '../../service';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const columns = [
  {
    field: 'name',
    headerName: 'Naam',
    width: 300,
  },
  {
    field: 'classes',
    headerName: 'Klas',
    width: 200,
    valueGetter: (params) => params.row.classes[0].name, // TODO: Make this column not hardcoded to the first class
  },
];

const useStyles = makeStyles((theme) => ({
  datagrid: {
    marginTop: '1rem',
    '& .MuiDataGrid-row:hover': {
      cursor: 'pointer',
    },
  },
}));

const Students = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentFilterValue, setStudentFilterValue] = useState(null);
  const [studentFilterInputValue, setStudentFilterInputValue] = useState('');

  const loadStudents = async () => {
    setLoading(true);
    const response = await service.loadStudents();
    setLoading(false);
    if (!response) {
      return;
    }
    setStudents(response.body.data);
  };

  const onStudentFilterInputChange = (event, newInputValue) => {
    setStudentFilterInputValue(newInputValue);
  };

  const onStudentFilterChange = (event, newValue) => {
    setStudentFilterValue(newValue);
  };

  const shownStudents = studentFilterValue ? [studentFilterValue] : students;

  useEffect(() => {
    loadStudents();
  }, []);

  const onClickStudent = (event) =>
    history.push(`/dashboard/students/${event.row.id}`);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Autocomplete
        value={studentFilterValue}
        onChange={onStudentFilterChange}
        inputValue={studentFilterInputValue}
        onInputChange={onStudentFilterInputChange}
        id="combo-box-demo"
        options={students}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Leerling zoeken" variant="outlined" />
        )}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <DataGrid
              className={classes.datagrid}
              autoHeight
              rows={shownStudents}
              columns={columns}
              pageSize={24}
              components={{
                ColumnMenuIcon: () => null, // We dont want to show anything for now
              }}
              onRowClick={onClickStudent}
            />
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default observer(Students);
