import { action, makeObservable, observable } from 'mobx';
import service from '../service';
import utils from './_utils';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class QuestionStore {
  constructor() {
    makeObservable(this, {
      questionGroup: observable,
      questionAttempts: observable,
      questionGroupAttempts: observable,
      loadQuestionGroup: action,
      loadQuestionAttemptsGroupId: action,
      loadQuestionGroupAttempts: action,
      setQuestionGroup: action,
      setNumber: action,
      setQuestionAttempts: action,
      setQuestionGroupAttempts: action,
    });
  }

  questionGroup = null;
  questionAttempts = [];
  questionGroupAttempts = [];

  setNumber = (number) => (this.number = number);
  setQuestionGroup = (questionGroup) => (this.questionGroup = questionGroup);
  setQuestionAttempts = (questionAttempts) =>
    (this.questionAttempts = questionAttempts);
  setQuestionGroupAttempts = (questionGroupAttempts) =>
    (this.questionGroupAttempts = questionGroupAttempts);

  loadQuestionGroupAttempts = async (questionId) => {
    if (this.questionGroupAttempts?.id === questionId) {
      return;
    }
    const response = await service.loadQuestionGroupAttempts(questionId);
    if (!response) {
      return;
    }
    // console.log(response.body.data);
    this.setQuestionGroupAttempts(response.body.data);
  };

  loadQuestionAttemptsGroupId = async (questionGroupId) => {
    console.log(questionGroupId);
    // if (this.questionAttempts?.id === questionGroupId) {
    //   return;
    // }

    // const responseQG = await service.loadQuestionGroup(questionGroupId);

    // if (!responseQG) {
    //   return;
    // }
    // const questionGroup = responseQG.body.data;
    // console.log(questionGroup);
    // let questionIds = [];
    // questionGroup.questions.map((question) => {
    //   questionIds.push(question.id);
    // });
    // console.log(questionIds);
    // let questionAttempts = [];
    // questionIds = ['8fa3c647-a4bf-4ebb-a2db-1546b9e56afd'];
    // let qid = '8fa3c647-a4bf-4ebb-a2db-1546b9e56afd';
    // // const getQA = async (id) => {
    // //   return service.loadQuestionAttempts(id);
    // // };
    // // const testData = async () => {
    // //   return Promise.all(questionIds.map((id) => getQA(id)));
    // // };
    // // let res = testData().then((data) => {
    // //   console.log(data);
    // //   return data;
    // // });

    // const getQA = await service.loadQuestionAttemptsID(qid);

    // console.log(getQA.body.data);
    // console.log('YAAAAAAAAAAAAAS');
    // questionIds.map((id) => {
    //   const response =
    //     await service.loadQuestionAttempts(id);

    //   if (!response) {
    //     return;
    //   }
    //   questionAttempts.push(response.body.data);
    // });

    //console.log(response.body.data);
    // let questionAttempts = utils.addQuestionGroupAttemptStats(
    //   responseQG.body.data,
    //   responseQA.body.data
    // );
    // questionGroup = utils.addQuestionGroupStats(responseQG.body.data);
    // this.setQuestionGroup(questionGroup);
    //this.questionAttempts = response.body.data;
    //this.setQuestionAttempts(questionAttempts);
  };

  loadQuestionGroup = async (questionGroupId) => {
    if (this.questionGroup?.id === questionGroupId) {
      return;
    }
    console.log(questionGroupId);
    const responseQA = await service.loadQuestionGroupAttempts(questionGroupId);
    if (!responseQA) {
      return;
    }
    const responseQG = await service.loadQuestionGroup(questionGroupId);
    if (!responseQG) {
      return;
    }
    let questionGroup = utils.addQuestionGroupAttemptStats(
      responseQG.body.data,
      responseQA.body.data
    );
    questionGroup = utils.addQuestionGroupStats(responseQG.body.data);
    console.log(questionGroup);
    this.setQuestionGroup(questionGroup);
  };
}

export default new QuestionStore();
