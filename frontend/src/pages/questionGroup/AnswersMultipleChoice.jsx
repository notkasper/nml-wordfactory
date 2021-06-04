import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import CustomTitle from './CustomTitle';
import AnswerHighlight from './AnswerHighlight';
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
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  questionName: {
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
  title: {
    backgroundColor: theme.widget.tertiary.main,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'fontWeightBold',
  },

  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

const Answers = (props) => {
  const classes = useStyles();
  const { questionStore } = props;

  const typeLabels = {
    open: 'Open',
    clickTheRightWords: 'Selecteer het correcte antwoord',
    multipleChoice: 'Meerkeuze',
    divideTheWord: 'Verdeel het woord',
    combineAndFillInTheBlanks: 'Combineer en vul in',
  };

  if (questionStore.isLoading || !questionStore.questionGroups) {
    return <CircularProgress />;
  }

  const calculateDistribution = (questionId, index) => {
    let acc = 0;
    questionStore.questionGroups[0].questionGroupAttempts.forEach((qga) => {
      if (qga.isCompleted) {
        qga.questionAttempts.forEach((qa) => {
          if (qa.questionId === questionId) {
            qa.content.forEach((attempt) => {
              if (attempt === index) {
                acc += 1;
              }
            });
          }
        });
      }
    });

    return acc;
  };

  const getRowsAnswer = (questionId, answer) => {
    const studentNames = [];
    questionStore.questionGroups[0].questionGroupAttempts.forEach((qga) => {
      const studentName = qga.lessonAttempt.student.name;
      qga.questionAttempts.forEach((qa) => {
        if (qa.questionId === questionId && qa.answer === answer) {
          studentNames.push(studentName);
        }
      });
    });

    return (
      <React.Fragment>
        {studentNames.map((name, index) => {
          return <Typography key={index}>{name}</Typography>;
        })}
      </React.Fragment>
    );
  };

  const categoryQuestions = questionStore.questionGroups[0].questions[0].type;
  const nameQuestionGroup = questionStore.questionGroups[0].name;
  const label = typeLabels[categoryQuestions] || categoryQuestions;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <CustomTitle name={nameQuestionGroup} label={label} />
      </Grid>

      <Grid item xs={12} md={12}>
        {questionStore.questionGroups[0].questions.map((item, index) => {
          return (
            <Accordion defaultExpanded key={item.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={classes.questionName}
              >
                <Typography key={index} style={{ marginLeft: '45%' }}>
                  {'Vraag ' + parseInt(index + 1)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}>
                    <Typography key={index}>{item.instruction}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <List>
                      {item.data.options.map((item2, index2) => {
                        return (
                          <ListItem key={index2}>
                            <ListItemIcon>
                              <FiberManualRecordOutlinedIcon />
                            </ListItemIcon>

                            <Tooltip
                              title={getRowsAnswer(item.id, item2.value)}
                              aria-label="add"
                            >
                              <ListItemText
                                key={index}
                                primary={
                                  <AnswerHighlight
                                    answer={item2.value}
                                    correct={item2.isCorrect}
                                  />
                                }
                              />
                            </Tooltip>
                            <ListItemSecondaryAction>
                              <Typography style={{ color: 'grey' }}>
                                {calculateDistribution(item.id, index2)}
                              </Typography>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default observer(Answers);
