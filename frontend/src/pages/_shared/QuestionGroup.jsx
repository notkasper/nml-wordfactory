import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import MultipleChoice from '../_shared/questionTypes/MultipleChoice';
import ClickTheRightWords from '../_shared/questionTypes/clickTheRightWords';

const Question = (props) => {
  const { type } = props;
  switch (type) {
    case 'multipleChoice':
      return <MultipleChoice {...props} />;
    case 'clickTheRightWords':
      return <ClickTheRightWords {...props} />;
    default:
      return (
        <p>{`Er is iets fout gegaan, ${type} wordt niet herkend als vraag type`}</p>
      );
  }
};

const QuestionGroup = (props) => {
  const { questions, save } = props;

  return (
    <Paper>
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Instructie
          </ListSubheader>
        }
      >
        {questions.map((question, index) => (
          <ListItem key={question.id}>
            <Question {...question} index={index} save={save} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default QuestionGroup;
