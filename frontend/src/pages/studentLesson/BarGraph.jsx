import React from 'react';
import Paper from '@material-ui/core/Paper';
import Title from '../_shared/Title';

// import { makeStyles } from '@material-ui/core/styles';
// import { Bar } from 'react-chartjs-2';

// const useStyles = makeStyles((theme) => ({
//   histogram: {
//     display: 'flex',
//     justifyContent: 'center',
//     component: 'h2',
//     variant: 'h6',
//     textAlign: 'center',
//   },
// }));

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

// TODO (working on this): IF we want to implement all question types
// const calculateDistribution = (
//   questionGroupAttempts,
//   questionGroupIds,
//   amoutnQuestions
// ) => {
//   const correctPerQuestion = Array(amountQuestions).fill(0);
//   const incorrectPerQuestion = Array(amountQuestions).fill(0);

//   const missedPerQuestion = Array(amountQuestions).fill(0);

//   questionGroupAttempts.forEach((questionGroupAttempt) => {
//     if (questionGroupAttempt.isCompleted) {
//       questionGroupAttempt.questionAttempts.forEach((questionAttempt) => {
//         const indexCorrect = questionIds.findIndex(
//           (el) => el === questionAttempt.questionId && questionAttempt.correct
//         );
//         correctPerQuestion[indexCorrect] += 1;
//         const indexIncorrect = questionIds.findIndex(
//           (el) => el === questionAttempt.questionId && questionAttempt.incorrect
//         );
//         incorrectPerQuestion[indexIncorrect] += 1;
//         const indexMissed = questionIds.findIndex(
//           (el) => el === questionAttempt.questionId && questionAttempt.missed
//         );
//         missedPerQuestion[indexMissed] += 1;
//       });
//     }
//   });
//   return [correctPerQuestion, incorrectPerQuestion, missedPerQuestion];
// };

// TODO (working on this): IF we want to implement all question types
// const getLabels = (amountQuestions) => {
//   const labels = [];
//   for (let i = 0; i < amountQuestions; i++) {
//     labels.push('Vraaggroep ' + parseInt(i + 1));
//   }
//   return labels;
// };

const BarGraph = (props) => {
  const { questionAttempts, title } = props;

  let questionGroupInfo = [];
  questionAttempts.forEach((qa) => {
    const groupId = qa.question.questionGroupId;
    const amountQuestions = qa.question.questions.length;
    questionGroupInfo.push({
      groupId: groupId,
      amountQuestions: amountQuestions,
    });
  });

  questionGroupInfo = questionGroupInfo.filter(onlyUnique);

  // TODO (working on this): IF we want to implement all question types
  //   const questionIds = [];
  //   questionGroup.questions.forEach((question) => {
  //     questionIds.push(question.id);
  //   });

  // const distributions = calculateDistribution(
  //   questionAttempts,
  //   questionGroupIds,

  // );
  //   const data = {
  //     datasets: [
  //       {
  //         label: 'Aantal juiste antwoorden',
  //         data: distributions[0],
  //       },

  //     ],
  //     labels: getLabels(amountQuestions),
  //   };

  return (
    <Paper>
      <Title>{title}</Title>
      {/* <Bar data={data} /> */}
    </Paper>
  );
};

export default BarGraph;
