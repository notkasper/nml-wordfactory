import { action, makeObservable, observable, computed } from 'mobx';
import service from '../service';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class LessonStore {
  constructor() {
    makeObservable(this, {
      lesson: observable,
      loadLesson: action,
      isLoading: computed,
      loading: observable,
      popLoad: action,
      pushLoad: action,
      setlesson: action,
      clearLesson: action,
    });
  }

  lesson = null;
  loading = 0;

  popLoad = () => (this.loading -= 1);
  pushLoad = () => (this.loading += 1);

  setlesson = (lesson) => (this.lesson = lesson);
  clearLesson = () => (this.lesson = null);

  loadLesson = async (lessonId) => {
    if (this.lesson?.id === lessonId) {
      return;
    }
    this.pushLoad();
    const response = await service.loadLesson(lessonId);
    if (!response) {
      return;
    }
    this.setlesson(response.body.data);
    this.popLoad();
  };

  get isLoading() {
    return this.loading > 0;
  }
}

export default new LessonStore();
