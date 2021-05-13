import { action, makeObservable, observable, computed } from 'mobx';

class NotificationStore {
  constructor() {
    makeObservable(this, {
      notificationDisplay: observable,
      isNotificationDisplay: computed,
      accumulator: observable,
      pushAccumulator: action,
      setNotificationDisplay: action,
    });
  }

  notificationDisplay = 'none';
  accumulator = 0;

  setNotificationDisplay = (notificationDisplay) =>
    (this.notificationDisplay = notificationDisplay);

  pushAccumulator = () => (this.accumulator += 1);

  get isNotificationDisplay() {
    return this.notificationDisplay;
  }
}

export default new NotificationStore();
