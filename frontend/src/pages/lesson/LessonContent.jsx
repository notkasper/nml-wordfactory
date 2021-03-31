import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { observer } from 'mobx-react-lite';
import IconButton from '@material-ui/core/IconButton';
import PageContainer from '../_shared/PageContainer';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  {
    field: 'name',
    headerName: 'Naam',
    width: 300,
  },
  {
    field: 'questionGroups',
    headerName: 'Vragen',
    width: 130,
    valueGetter: (data) => data.getValue('questions').length,
    type: 'number',
  },
  {
    field: 'createdAt',
    headerName: 'Gemiddelde correctheid (%)',
    width: 230,
    valueGetter: (data) => 50,
    type: 'number',
  },
  {
    field: 'updatedAt',
    headerName: 'Statistieken',
    width: 150,
    renderCell: (data) => <StatIcon id={data.getValue('id')} />,
  },
];

const StatIcon = (props) => {
  const { id } = props;
  const history = useHistory();
  const goToStats = () => history.push(`/dashboard/questionGroups/${id}/stats`);
  return (
    <IconButton onClick={goToStats}>
      <EqualizerIcon color="primary" />
    </IconButton>
  );
};

const LessonContent = (props) => {
  const { lessonStore } = props;
  const params = useParams();

  useEffect(() => {
    lessonStore.loadLesson(params.lessonId);
  }, []);

  if (lessonStore.isLoading || !lessonStore.lesson) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <DataGrid
        autoHeight
        rows={lessonStore.lesson.questionGroups}
        columns={columns}
        pageSize={12}
      />
    </PageContainer>
  );
};

export default observer(LessonContent);
