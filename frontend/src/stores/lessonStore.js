import { action, makeObservable, observable, computed } from 'mobx';
import service from '../service';
import utils from './_utils';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class LessonStore {
  constructor() {
    makeObservable(this, {
      lesson: observable,
      lessonAttempts: observable,
      loading: observable,
      loadLesson: action,
      loadLessonAttempts: action,
      refreshLessonAttempts: action,
      questionGroup: observable,
      popLoad: action,
      pushLoad: action,
      setlesson: action,
      setlessonAttempts: action,
      clearLesson: action,
      isLoading: computed,
    });
  }

  lesson = null;
  lessonAttempts = [];
  questionGroup = [];
  loading = 0;

  popLoad = () => (this.loading -= 1);
  pushLoad = () => (this.loading += 1);

  setlesson = (lesson) => (this.lesson = lesson);
  clearLesson = () => (this.lesson = null);

  setlessonAttempts = (lessonAttempts) =>
    (this.lessonAttempts = lessonAttempts);
  clearLessonAttempts = () => (this.lessonAttempts = null);

  loadLesson = async (lessonId) => {
    if (this.lesson?.id === lessonId) {
      return;
    }
    this.pushLoad();
    const response = await service.loadLesson(lessonId);
    if (!response) {
      return;
    }
    // Calculate average score... not pretty. Do this in the backend query at some point
    const lesson = utils.addQuestionGroupAverages(
      response.body.data,
      this.questionGroup
    );
    this.setlesson(lesson);
    this.popLoad();
  };

  refreshLessonAttempts = async () => {
    console.log('GONNA REFRESH');
    if (!this.lessonAttempts.length) {
      console.log('no lesson attempts, returning');
      return;
    }
    const lessonIdToRefresh = this.lessonAttempts[0]?.lessonId;
    if (!lessonIdToRefresh) {
      console.log('no lesson id to refresh, returning');
      return;
    }
    console.log('refreshing', lessonIdToRefresh);
    await this.loadLessonAttempts(lessonIdToRefresh, true);
  };

  loadLessonAttempts = async (lessonId, isRefresh = false) => {
    if (
      this.lessonAttempts?.length &&
      this.lessonAttempts[0]?.lessonId === lessonId &&
      !isRefresh
    ) {
      return;
    }
    this.pushLoad();
    const response = await service.loadLessonAttempts(lessonId);
    if (!response) {
      return;
    }
    let loadedLessonAttempts = response.body.data;
    loadedLessonAttempts = utils.addDuration(loadedLessonAttempts);
    loadedLessonAttempts = utils.addPerformance(loadedLessonAttempts);
    this.setlessonAttempts(loadedLessonAttempts);
    this.popLoad();
  };

  onNewQuestionAttempts = (data) => {
    console.log('NEW', data);
  };

  get isLoading() {
    return this.loading > 0;
  }
}

export default new LessonStore();
