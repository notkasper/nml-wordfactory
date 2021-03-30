import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MultipleChoice from '../_shared/questionTypes/MultipleChoice';
import Button from '@material-ui/core/Button';
import EqualizerIcon from '@material-ui/icons/Equalizer';

const useStyles = makeStyles((theme) => ({}));

const Question = (props) => {
  const { type } = props;
  switch (type) {
    case 'multipleChoice':
      return <MultipleChoice {...props} />;
    default:
      return (
        <p>{`Er is iets fout gegaan, ${type} wordt niet herkend als vraag type`}</p>
      );
  }
};

const QuestionGroup = (props) => {
  const { questions, name } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const onChange = () => setExpanded(!expanded);
  const history = useHistory();

  const goToQuestionStats = (questionId) =>
    history.push(`/dashboard/questions/${questionId}/stats`);

  return (
    <Accordion
      className={classes.fullWidth}
      TransitionProps={{ unmountOnExit: true }}
      expanded={expanded}
      onChange={onChange}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List subheader={questions[0].instruction}>
          {questions.map((question, index) => (
            <>
              <ListItem>
                <Question {...question} index={index} />
              </ListItem>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<EqualizerIcon />}
                onClick={() => goToQuestionStats(question.id)}
              >
                Bekijk statistieken
              </Button>
            </>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default QuestionGroup;
