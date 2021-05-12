import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CustomTitle from './CustomTitle';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import { ListItemSecondaryAction } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
//import question from '../../../../backend/src/models/question';

const Answers = (props) => {
  const useStyles = makeStyles((theme) => ({
    questionName: {
      //padding: theme.spacing(),
      display: 'flex',
      flexGrow: 0,
      backgroundColor: theme.widget.primary.main,
      color: 'white',
    },
    grid: {
      display: 'flex',

      direction: 'column',
      wrap: 'nowrap',
      flexGrow: 1,
    },
  }));

  const classes = useStyles();
  const { questionStore } = props;
  questionStore.setLoading(0);
  const theme = useTheme();
  const params = useParams();
  const typeLabels = {
    open: 'Open',
    clickTheRightWords: 'Selecteer het correcte antwoord',
    multipleChoice: 'Meerkeuze',
    divideTheWord: 'Verdeel het woord',
    combineAndFillInTheBlanks: 'Combineer en vul in',
  };

  const loadAll = useCallback(async () => {
    const promises = [
      questionStore.loadQuestionGroupWithAttempts(
        params.questionGroupId,
        params.lessonId,
        params.classId
      ),
    ];
    await Promise.all(promises);
  }, [params.questionGroupId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (
    questionStore.isLoading ||
    !questionStore.questionGroupWithAttempts ||
    !questionStore.questionGroupWithAttempts.questionAttempts
  ) {
    return <CircularProgress />;
  }

  const questionIds = questionStore.questionGroupWithAttempts.questionids;
  const calculateProgress = (item, index) => {
    let correct = 0;
    for (var i = 0; i < item.answers.length; i++) {
      if (item.answers[i] == index) {
        correct += 1;
      }
    }
    return (correct / item.answers.length) * 100;
  };

  const categoryQuestions =
    questionStore.questionGroupWithAttempts.questions[0].type;
  const nameQuestionGroup = questionStore.questionGroupWithAttempts.name;
  const label = typeLabels[categoryQuestions] || categoryQuestions;
  let questionNames = questionStore.questionGroupWithAttempts.questionTitles;

  const columns = [
    {
      field: 'studentName',
      headerName: 'Naam',
      flex: 1.0,
      valueGetter: (params) => params.row.studentName,
    },

    {
      field: 'answer',
      headerName: 'Antwoord',
      flex: 1.0, // 0.5
      valueGetter: (params) => params.row.answer, //value, // Adding.value doesn't work?
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <CustomTitle name={nameQuestionGroup} label={label} />
      </Grid>

      <Grid item xs={12} md={12}>
        {questionStore.questionGroupWithAttempts.questions.map(
          (item, index) => {
            return (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={classes.questionName}
                >
                  <Typography key={index} style={{ marginLeft: '45%' }}>
                    {questionNames[index]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container xs={12} md={12}>
                    <Grid item xs={12} md={12}>
                      <Typography key={index}>{item.instruction}</Typography>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <List>
                        {item.data.options.map((item2, index) => {
                          return (
                            <ListItem>
                              <ListItemIcon>
                                <FiberManualRecordOutlinedIcon />
                              </ListItemIcon>
                              <ListItemText
                                key={index}
                                primary={<Typography>{item2.value}</Typography>}
                              />
                              <ListItemSecondaryAction>
                                <Typography style={{ color: 'grey' }}>
                                  {calculateProgress(item, index)}%
                                </Typography>
                              </ListItemSecondaryAction>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Grid item xs={12} md={12}>
                        <DataGrid
                          autoHeight
                          rows={questionStore.questionGroupWithAttempts.questionAttempts.filter(
                            (qa) => qa.question.id == item.id
                          )}
                          columns={columns}
                          pageSize={12}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          }
        )}
      </Grid>
    </Grid>
  );
};
//}
export default observer(Answers);
