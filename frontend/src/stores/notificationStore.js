import { action, makeObservable, observable } from 'mobx';

class NotificationStore {
  constructor() {
    makeObservable(this, {
      accumulator: observable,
      pushAccumulator: action,
      amountNotifications: observable,
      pushNotification: action,
      notifications: observable,
      setNotifications: action,
      setAmountNotifications: action,
      pushAmountNotifications: action,
      popAmountNotifications: action,
      deleteNotification: action,
    });
  }

  accumulator = 0;
  amountNotifications = 0;
  notifications = [];

  pushAmountNotifications = () => (this.amountNotifications += 1);

  popAmountNotifications = () => (this.amountNotifications -= 1);

  pushAccumulator = () => (this.accumulator += 1);

  pushNotification = (notification) => this.notifications.push(notification);

  setAmountNotifications = (amountNotifications) =>
    (this.amountNotifications = amountNotifications);

  setNotifications = (notifications) => (this.notifications = notifications);

  deleteNotification = (notificationIndex) => {
    this.notifications.splice(notificationIndex, 1);
    this.restoreIndices();
  };

  restoreIndices = () => {
    let restoredNotifications = this.notifications;
    for (let i = 0; i < this.notifications.length; i++) {
      restoredNotifications[i].index = i;
    }
    this.setNotifications(restoredNotifications);
  };
}

export default new NotificationStore();
