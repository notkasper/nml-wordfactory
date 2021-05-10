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

const Answers = (props) => {
  const useStyles = makeStyles((theme) => ({
    questionName: {
      //padding: theme.spacing(),
      display: 'fles',
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
  const theme = useTheme();
  const params = useParams();
  const color = theme.widget.secondary.main;
  const [loading, setLoading] = useState(true);
  //const [loading2, setLoading2] = useState(true);
  const typeLabels = {
    open: 'Open',
    clickTheRightWords: 'Selecteer het correcte antwoord',
    multipleChoice: 'Meerkeuze',
    divideTheWord: 'Verdeel het woord',
    combineAndFillInTheBlanks: 'Combineer en vul in',
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    const promises = [
      questionStore.loadQuestionGroupAttempts(params.questionGroupId),
      questionStore.loadQuestionGroup(params.questionGroupId),
      //questionStore.loadQuestionAttemptsGroupId(params.questionGroupId),
    ];
    await Promise.all(promises);
    setLoading(false);
  }, [params.questionGroupId, params.questionGroupId]); //params.questionGroupId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // if (!loading1) {
  //   const questionIds = questionStore.questionGroup.questionIds;
  //   const loadAllQA = useCallback((async) => {
  //     setLoading(false);
  //     questionIds.map(
  //       (id, index) => {
  //         const { promises } = promises.push(
  //           questionStore.loadQuestionGroup(id)
  //         );
  //       },
  //       {
  //         promises: [],
  //       }
  //     );
  //   });
  //   useEffect(() => {
  //     loadAllQA();
  //   }, [loadAllQA]);
  // }

  if (loading) {
    return <CircularProgress />;
  }

  //console.log(questionStore.questionGroup.questionIds);
  console.log(questionStore.questionGroup);
  // console.log(questionIds);
  const categoryQuestions = questionStore.questionGroup.questions[0].type;
  const nameQuestionGroup = questionStore.questionGroup.name;
  const label = typeLabels[categoryQuestions] || categoryQuestions;
  let questionNames = questionStore.questionGroup.questionTitles;
  //let questions =questionStore.questionGroup.questions;

  const columns = [
    {
      field: 'type',
      headerName: 'Naam',
      flex: 0.5,
      valueGetter: (params) => params.row.type,
    },
    {
      field: 'instruction',
      headerName: 'Instructie',
      flex: 0.5,
      valueGetter: (params) => params.row.instruction, // calculateProgress(params.row.questionGroupAttempts),
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <CustomTitle name={nameQuestionGroup} label={label} />
      </Grid>

      <Grid item xs={12} md={12}>
        {questionStore.questionGroup.questions.map((item, index) => {
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
                      {item.data.options.map((item, index) => {
                        return (
                          <ListItem>
                            <ListItemIcon>
                              <FiberManualRecordOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText
                              key={index}
                              primary={<Typography>{item.value}</Typography>}
                            />
                            <ListItemSecondaryAction>
                              <Typography style={{ color: 'grey' }}>
                                20%
                              </Typography>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Grid item xs={6} md={6}>
                      <DataGrid
                        style={{ width: '50%' }}
                        autoHeight
                        rows={questionStore.questionGroup.questions}
                        columns={columns}
                        pageSize={12}
                      />
                    </Grid>
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
//}
export default Answers;
