import { action, makeObservable, observable, computed } from 'mobx';
import service from '../service';
import utils from './_utils';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class QuestionStore {
  constructor() {
    makeObservable(this, {
      questionGroup: observable,
      loading: observable,
      popLoad: action,
      pushLoad: action,
      isLoading: computed,
    });
  }

  questionGroup = null;
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

  get isLoading() {
    return this.loading > 0;
  }
}

export default new QuestionStore();
