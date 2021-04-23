import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    headerName: 'Opdrachtnummer',
    width: 110,
    type: 'number',
    valueGetter: (params) => params.value + 1,
  },
  {
    field: 'questionGroups',
    headerName: 'Vragen',
    width: 130,
    valueGetter: (params) => params.row.questions.length,
    type: 'number',
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 175,
    valueGetter: (params) => {
      const type = params.row.questions[0].type;
      const label = typeLabels[type] || type;
      return label;
    },
  },
  {
    field: 'averageScore',
    headerName: 'Gem. score (%)',
    width: 150,
    type: 'number',
  },
  {
    field: 'completions',
    headerName: 'Klaar',
    width: 100,
    type: 'number',
  },
  {
    field: 'Bekijken',
    headerName: '',
    width: 150,
    renderCell: (params) => <ViewIcon id={params.row.id} />,
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
  }, [lessonStore, params.lessonId]);

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
