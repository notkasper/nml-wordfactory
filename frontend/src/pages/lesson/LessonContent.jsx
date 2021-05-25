import React, { useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { observer } from 'mobx-react-lite';
import { DataGrid, getThemePaletteMode } from '@material-ui/data-grid';
import { createMuiTheme, darken, lighten } from '@material-ui/core/styles';

const defaultTheme = createMuiTheme();

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

    flex: 0.2,
  },
  {
    field: 'index',
    headerName: 'Opdrachtnummer',
    flex: 0.1,
    type: 'number',
    valueGetter: (params) => params.value + 1,
  },
  {
    field: 'questionGroups',
    headerName: 'Vragen',
    flex: 0.1,
    valueGetter: (params) => params.row.questions.length,
    type: 'number',
  },
  {
    field: 'type',
    headerName: 'Type',
    flex: 0.2,
    valueGetter: (params) => {
      const type = params.row.questions[0].type;
      const label = typeLabels[type] || type;
      return label;
    },
  },
  {
    field: 'averageScore',
    headerName: 'Gem. score (%)',
    flex: 0.1,
    type: 'number',
  },
  {
    field: 'averageElapsedTime',
    headerName: 'Gem. tijdsduur (sec)',
    flex: 0.1,
    type: 'number',
  },
  {
    field: 'completions',
    headerName: 'Klaar',
    flex: 0.1,
    type: 'number',
  },
];

const useStyles = makeStyles(
  (
    theme //({
  ) => {
    return {
      root: {
        datagrid: {
          marginTop: '1rem',
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        },

        '& .lowScore': {
          color: 'red',
          background: 'red',
        },
      },
    };
  }
); //);

const LessonContent = (props) => {
  const { lessonStore } = props;
  const location = useLocation();
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();

  const onClickStudent = (event) =>
    history.push(
      `${location.pathname}/questionGroups/${event.row.id}/question_group_insights`
    );

  const getColor = (row) => {
    console.log(row);
    // const type = row.getValue('type');
    // console.log(type);
    // if (type === 'meerkeuze') {
    //   return 'lowScore';
    // }
  };

  const getRows = (questionGroups) => {
    const rows = [];
    let questionGroupNo = 1;
    questionGroups.forEach((qg) => {
      const type = qg.questions[0].type;
      const label = typeLabels[type] || type;
      rows.push({
        id: qg.id,
        name: qg.name,
        index: questionGroupNo,
        questionGroups: qg.questions.length,
        type: label,
        averageScore: qg.averageScore,
        averageElapsedTime: qg.averageElapsedTime,
        completions: qg.completions,
      });
      questionGroupNo += 1;
    });
    // const rows = [
    //   {
    //     id: 'id1',
    //     name: 'Joe',
    //     index: 2,
    //     questionGroups: 3,
    //     type: 'Meerkeuze',
    //     averageScore: 6.5,
    //     averageElapsedTime: 7.5,
    //     completions: 80,
    //   },
    //   {
    //     id: 'id2',
    //     name: 'Joe2',
    //     index: 1,
    //     questionGroups: 4,
    //     type: 'Niet Meerkeuze',
    //     averageScore: 8,
    //     averageElapsedTime: 17.5,
    //     completions: 0,
    //   },
    // ];
    console.log(rows);
    return rows;
  };
  useEffect(() => {
    lessonStore.loadLesson(params.lessonId);
  }, [lessonStore, params.lessonId]);

  if (lessonStore.isLoading || !lessonStore.lesson) {
    return <CircularProgress />;
  }
  //https://material-ui.com/components/data-grid/style/

  return (
    <DataGrid
      className={classes.datagrid}
      autoHeight
      rows={lessonStore.lesson.questionGroups} //{getRows(lessonStore.lesson.questionGroups)}
      columns={columns}
      pageSize={12}
      getRowClassName={`lowScore`}
      // console.log(params);
      // if (params.row.averageScore <= 5) {
      //   return `lowScore`;
      // }
      onRowClick={onClickStudent}
      sortModel={[
        {
          field: 'index',
          sort: 'asc',
        },
      ]}
    />
  );
};

export default observer(LessonContent);
