import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import CustomTitle from './CustomTitle';
import AnswerHighlight from './AnswerHighlight';
import Accordion from '@material-ui/core/Accordion';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import { ListItemSecondaryAction } from '@material-ui/core';
import { observer } from 'mobx-react-lite';

import { useHistory } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';

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
}));

const Answers = (props) => {
  const history = useHistory();
  const { questionStore } = props;
  const [filterValue, setFilterValue] = useState(null);
  const [filterInputValue, setFilterInputValue] = useState('');
  const classes = useStyles();
  const params = useParams();
  const typeLabels = {
    open: 'Open',
    clickTheRightWords: 'Selecteer het correcte antwoord',
    multipleChoice: 'Meerkeuze',
    divideTheWord: 'Verdeel het woord',
    combineAndFillInTheBlanks: 'Combineer en vul in',
  };

  const loadAll = useCallback(async () => {
    await questionStore.loadQuestionGroupWithAttempts(params.questionGroupId);
  }, [questionStore, params.questionGroupId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (questionStore.isLoading || !questionStore.questionGroup) {
    return <CircularProgress />;
  }

  const calculateDistribution = (questionId, index) => {
    let acc = 0;
    let total = 0;
    questionStore.questionGroup.questionGroupAttempts.forEach((qga) => {
      qga.questionAttempts.forEach((qa) => {
        if (qa.questionId === questionId) {
          total += 1;
          if (qa.content === index) {
            acc += 1;
          }
        }
      });
    });

    return Math.round((acc / total) * 100);
  };

  const getRows = (questionId) => {
    let rows = [];
    questionStore.questionGroup.questionGroupAttempts.forEach((qga) => {
      qga.questionAttempts.forEach((qa) => {
        if (qa.questionId === questionId) {
          rows.push({
            id: qa.id,
            studentName: qa.studentName,
            answer: qa.answer,
            studentId: qa.studentId,
          });
        }
      });
    });
    return rows;
  };

  const getRowsFilter = (questionId, filterValue) => {
    let rows = [];
    questionStore.questionGroup.questionGroupAttempts.forEach((qga) => {
      qga.questionAttempts.forEach((qa) => {
        if (qa.questionId === questionId && qa.answer === filterValue.answer) {
          rows.push({
            id: qa.id,
            studentName: qa.studentName,
            answer: qa.answer,
            studentId: qa.studentId,
          });
        }
      });
    });
    return rows;
  };

  const getOptions = (questionId) => {
    let options = [];
    questionStore.questionGroup.questions.forEach((q) => {
      if (q.id === questionId) {
        q.data.options.forEach((option) => {
          options.push({ answer: option.value });
        });
      }
    });
    return options;
  };

  const onClickStudent = (event) =>
    history.push(`/dashboard/students/${event.row.studentId}`);

  const onFilterInputChange = (event, newInputValue) => {
    setFilterInputValue(newInputValue);
  };

  const onFilterChange = (event, newValue) => {
    setFilterValue(newValue);
  };

  const categoryQuestions = questionStore.questionGroup.questions[0].type;
  const nameQuestionGroup = questionStore.questionGroup.name;
  const label = typeLabels[categoryQuestions] || categoryQuestions;

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
      flex: 1.0,
      valueGetter: (params) => params.row.answer,
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
                  {'Vraag ' + parseInt(index + 1)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container xs={12} md={12} spacing={1}>
                  <Grid item xs={12} md={12}>
                    <Typography key={index}>{item.instruction}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <List>
                      {item.data.options.map((item2, index2) => {
                        return (
                          <ListItem>
                            <ListItemIcon>
                              <FiberManualRecordOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText
                              key={index}
                              primary={
                                <AnswerHighlight
                                  answer={item2.value}
                                  correct={item2.isCorrect}
                                />
                              }
                            />
                            <ListItemSecondaryAction>
                              <Typography style={{ color: 'grey' }}>
                                {calculateDistribution(item.id, index2)}%
                              </Typography>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                  <Divider style={{ margin: '1rem 0', width: '100%' }} />
                  <Grid item xs={12} md={12}>
                    <Grid item xs={12} md={12}>
                      <Typography className={classes.title}>
                        Filter op antoord :
                      </Typography>
                      <Autocomplete
                        value={filterValue}
                        onChange={onFilterChange}
                        inputValue={filterInputValue}
                        onInputChange={onFilterInputChange}
                        id="combo-box-demo"
                        options={getOptions(item.id)}
                        getOptionLabel={(option) => option.answer}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <DataGrid
                      autoHeight
                      rows={
                        filterValue
                          ? getRowsFilter(item.id, filterValue)
                          : getRows(item.id)
                      }
                      columns={columns}
                      pageSize={12}
                      onRowClick={onClickStudent}
                    />
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
