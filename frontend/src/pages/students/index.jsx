import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react-lite';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import PageContainer from '../_shared/PageContainer';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import service from '../../service';

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

const Students = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const loadStudents = async () => {
    setLoading(true);
    const response = await service.loadStudents();
    setLoading(false);
    if (!response) {
      return;
    }
    setStudents(response.body.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <DataGrid
              autoHeight
              rows={students}
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
