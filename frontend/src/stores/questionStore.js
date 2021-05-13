import { convertGridRowsPropToState } from '@material-ui/data-grid';
import { action, makeObservable, observable, computed } from 'mobx';
//import { ObservableObjectAdministration } from 'mobx/dist/internal';
//import { ObservableValue } from 'mobx/dist/internal';
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
      this.questionGroup = response.body.data;
    }
    this.popLoad();
    console.log(this.questionGroup);
  };

  get isLoading() {
    return this.loading > 0;
  }
}

export default new QuestionStore();
