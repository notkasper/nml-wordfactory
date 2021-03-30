import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Open from '../_shared/questionTypes/Open';

const useStyles = makeStyles((theme) => ({}));

const Question = (props) => {
  const { type } = props;
  switch (type) {
    case 'open':
      return <Open {...props} />;
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
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Lessen
            </ListSubheader>
          }
          style={{ width: '100%' }}
        >
          {questions.map((question) => (
            <ListItem>
              <Question {...question} />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default QuestionGroup;
