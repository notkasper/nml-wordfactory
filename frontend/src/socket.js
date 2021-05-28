import { io } from 'socket.io-client';
import jscookie from 'js-cookie';
import lessonStore from '../src/stores/lessonStore';
import notificationStore from '../src/stores/notificationStore';

const socket = io({
  auth: {
    token: jscookie.get('token'),
  },
});

const onDisconnect = () => console.info('Socket disconnected');
const onConnect = () => console.info('Socket connected');
const onReconnect = () => console.info('Socket reconnected');
const subscribe = (eventName, callback) => {
  socket.on(eventName, callback);
  console.info(`Socket started listening to ${eventName}`);
};

const unsubscribe = (eventName) => {
  socket.off(eventName);
  console.info(`Socket stopped listening to ${eventName}`);
};

const isConnected = () => socket.connected;

const connect = () => {
  socket.connect();
  console.log('Socket connected');
};

const disconnect = () => {
  socket.disconnect();
  console.log('Socket disconnected');
};

subscribe('connect', onConnect);
subscribe('reconnect', onReconnect);
subscribe('disconnect', onDisconnect);
subscribe('newQuestionAttempts', lessonStore.refreshLessonAttempts);
subscribe('notification', (data) => {
  notificationStore.pushNotification({
    id: data.message,
    classId: 'none',
    category: 'classes',
    value: data.message,
    index: notificationStore.notifications.length,
  });
});

const obj = { subscribe, unsubscribe, disconnect, connect, isConnected };

export default obj;
