import React, { useState } from 'react';
import { Prompt } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import MultipleChoice from '../_shared/questionTypes/MultipleChoice';
import Open from '../_shared/questionTypes/Open';
import ClickTheRightWords from '../_shared/questionTypes/clickTheRightWords';

const Question = (props) => {
  const { type } = props;
  switch (type) {
    case 'multipleChoice':
      return <MultipleChoice {...props} />;
    case 'open':
      return <Open {...props} />;
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
  const [isBlocking, setIsBlocking] = useState(false);

  questions.sort((el1, el2) => {
    if (el1.index > el2.index) {
      return 1;
    } else {
      return -1;
    }
  });

  const saveQuestion = async (id, newData) => {
    save(id, newData);
  };

  return (
    <>
      <Prompt
        when={isBlocking}
        message={(location) =>
          'Je hebt je aanpassingen niet opgeslagen, weet je zeker dat je deze pagina wilt verlaten? (Uw aanpassingen zullen NIET opgeslagen worden!)'
        }
      />
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
              <Question
                {...question}
                setIsBlocking={setIsBlocking}
                index={index}
                save={(newData) => saveQuestion(question.id, newData)}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
};

export default QuestionGroup;
