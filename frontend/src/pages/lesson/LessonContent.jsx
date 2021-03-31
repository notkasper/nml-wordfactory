import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { observer } from 'mobx-react-lite';
import IconButton from '@material-ui/core/IconButton';
import PageContainer from '../_shared/PageContainer';
import { DataGrid } from '@material-ui/data-grid';
import VisibilityIcon from '@material-ui/icons/Visibility';

const typeLabels = {
  open: 'Open',
  clickTheRightWords: 'Selecteer het correcte antwoord',
  multipleChoice: 'Meerkeuze',
  divideTheWord: 'Verdeel het woord',
  combineAndFillInTheBlanks: 'Combineer en vul in',
};

const columns = [
  {
    field: 'name',
    headerName: 'Naam',
    width: 300,
  },
  {
    field: 'index',
    headerName: 'Nummer',
    width: 110,
    type: 'number',
    valueGetter: (data) => data.value + 1,
  },
  {
    field: 'questionGroups',
    headerName: 'Vragen',
    width: 130,
    valueGetter: (data) => data.getValue('questions').length,
    type: 'number',
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 200,
    valueGetter: (data) => {
      const type = data.getValue('questions')[0].type;
      const label = typeLabels[type] || type;
      return label;
    },
  },
  {
    field: 'createdAt',
    headerName: 'Gem. score (%)',
    width: 150,
    valueGetter: (data) => 50,
    type: 'number',
  },
  {
    field: 'Bekijken',
    headerName: '',
    width: 150,
    renderCell: (data) => <ViewIcon id={data.getValue('id')} />,
  },
];

const ViewIcon = (props) => {
  const { id } = props;
  const history = useHistory();
  const goToStats = () =>
    history.push(`/dashboard/questionGroups/${id}/question`);
  return (
    <IconButton onClick={goToStats}>
      <VisibilityIcon color="primary" />
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
