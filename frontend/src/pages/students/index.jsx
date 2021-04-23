import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import PageContainer from '../_shared/PageContainer';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import service from '../../service';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Pagination from '@material-ui/lab/Pagination';


const PAGE_SIZE = 20;

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
  {
    field: 'Leerling bekijken',
    headerName: '',
    width: 200,
    renderCell: (data) => <ViewIcon id={data.getValue('id')} />,
  },
];

const ViewIcon = (props) => {
  const { id } = props;
  const history = useHistory();
  const goToStats = () => history.push(`/dashboard/students/${id}`);
  return (
    <IconButton onClick={goToStats}>
      <VisibilityIcon color="primary" />
    </IconButton>
  );
};

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: '1rem',
  },
  marginBottom: {
    marginBottom: '1rem',
  },
}));



const Students = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = useState(0);
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

  const onChangePage = (event, value) => {
    setPage(value);
  };

  const start = page * PAGE_SIZE;

  const shownStudents = studentFilterValue
  ? [studentFilterValue]
  : students.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    loadStudents();
  }, []);

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
              autoHeight
              rows={shownStudents} // students
              columns={columns}
              pageSize={24}
              components={{
                ColumnMenuIcon: () => null, // We dont want to show anything for now
              }}
            />
          </Paper>
          
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default observer(Students);
