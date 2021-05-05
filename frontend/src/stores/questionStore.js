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
      loadQuestionAttempts: action,
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

  loadQuestionGroupAttempts = async (questiongroupId) => {
    if (this.questionGroupAttempts?.id === questiongroupId) {
      return;
    }
    const response = await service.loadQuestionGroupAttempts(questiongroupId);
    if (!response) {
      return;
    }
    this.setQuestionGroupAttempts(response.body.data);
  };

  loadQuestionAttempts = async (questionId) => {
    if (this.questionAttempts?.id === questionId) {
      return;
    }
    const response = await service.loadQuestionAttempts(questionId);
    if (!response) {
      return;
    }
    this.questionAttempts = response.body.data;
  };

  loadQuestionGroup = async (questionGroupId) => {
    if (this.questionGroup?.id === questionGroupId) {
      return;
    }
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
