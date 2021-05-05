import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';

const Answers = (props) => {
  const { questionStore } = props;
  const theme = useTheme();
  const params = useParams();
  const color = theme.widget.secondary.main;
  const [loading, setLoading] = useState(true);
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
      questionStore.loadQuestionAttempts(params.questionGroupId),
      questionStore.loadQuestionGroup(params.questionGroupId),
    ];
    await Promise.all(promises);
    setLoading(false);
  }, [params.questionGroupId, params.questionGroupId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading) {
    return <CircularProgress />;
  }
  const categoryQuestions = questionStore.questionGroup.questions[0].type;
  const nameQuestionGroup = questionStore.questionGroup.name;
  const label = typeLabels[categoryQuestions] || categoryQuestions;
  let questionNames = questionStore.questionGroup.questionTitles;
  //let questions =questionStore.questionGroup.questions;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <CustomTitle name={nameQuestionGroup} label={label} />
      </Grid>
      <Grid item xs={12} md={12}>
        {questionStore.questionGroup.questions.map((item, index) => {
          return (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography key={index}>{questionNames[index]}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container style={{ direction: 'column' }} xs={12} md={12}>
                  <Grid item xs={6} md={12}>
                    <Typography key={index}>{item.instruction}</Typography>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <List>
                      {item.data.options.map((item, index) => {
                        return (
                          <ListItem>
                            <ListItemIcon>
                              <FiberManualRecordOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText
                              key={index}
                              primary={item.value}
                              secondary={
                                <Typography style={{ color: 'grey' }}>
                                  {' '}
                                  20%
                                </Typography>
                              }
                            />
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
//}
export default Answers;
