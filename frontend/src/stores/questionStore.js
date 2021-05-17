import { action, makeObservable, observable, computed } from 'mobx';
import service from '../service';
import utils from './_utils';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class QuestionStore {
  constructor() {
    makeObservable(this, {
      questionGroup: observable,
      questionAttempts: observable,
      loading: observable,
      popLoad: action,
      pushLoad: action,
      isLoading: computed,
    });
  }

  questionGroup = null;
  questionAttempts = null;
  loading = 0;

  popLoad = () => (this.loading -= 1);
  pushLoad = () => (this.loading += 1);

  loadQuestionGroupWithAttempts = async (questionGroupId) => {
    this.pushLoad();
    const response = await service.loadQuestionGroup(questionGroupId);
    if (response) {
      let questionGroup = response.body.data;
      questionGroup = utils.addQuestionGroupAttemptStats(questionGroup);
      questionGroup = utils.addQuestionAttemptInformation(questionGroup);
      this.questionGroup = questionGroup;
    }

    this.popLoad();
  };

  loadQuestionAttemptsWithInfo = async (studentId, lessonId) => {
    this.pushLoad();
    const response = await service.loadQuestionAttempts({
      studentId: studentId,
      lessonId: lessonId,
    });

    if (response) {
      let questionAttempts = response.body.data;
      questionAttempts = utils.addInformation(questionAttempts);
      console.log(questionAttempts);
      this.questionAttempts = questionAttempts;
    }
    this.popLoad();
  };

  get isLoading() {
    return this.loading > 0;
  }
}

export default new QuestionStore();
