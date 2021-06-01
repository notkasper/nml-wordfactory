import { action, makeObservable, observable, computed } from 'mobx';
import service from '../service';
import utils from './_utils';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class QuestionStore {
  constructor() {
    makeObservable(this, {
      questionAttempts: observable,
      questionGroups: observable,
      loading: observable,
      popLoad: action,
      pushLoad: action,
      isLoading: computed,
    });
  }

  questionAttempts = [];
  questionGroups = null;
  loading = 0;

  popLoad = () => (this.loading -= 1);
  pushLoad = () => (this.loading += 1);

  loadQuestionGroupsWithAttempts = async (questionGroupIds) => {
    this.pushLoad();
    const response = await service.loadQuestionGroups(questionGroupIds);
    if (response) {
      let questionGroups = response.body.data;
      questionGroups.forEach((qg) => {
        utils.addQuestionGroupAttemptStats(qg);
        this.questionGroups = questionGroups;
      });
    }
    this.popLoad();
  };

  loadQuestionGroupsByLessonId = async (lessonId) => {
    this.pushLoad();

    const response = await service.loadQuestionGroupsByLessonId(lessonId);
    if (response) {
      let questionGroups = response.body.data;
      questionGroups.forEach((qg) => {
        utils.addQuestionGroupAttemptStats(qg);
        utils.addQuestionAttemptInformation(qg);
        this.questionGroups = questionGroups;
      });
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
      this.questionAttempts = questionAttempts;
    }
    this.popLoad();
  };

  get isLoading() {
    return this.loading > 0;
  }
}

export default new QuestionStore();
