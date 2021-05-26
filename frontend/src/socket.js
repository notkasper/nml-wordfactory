import { io } from 'socket.io-client';
import jscookie from 'js-cookie';

let socket;

const onDisconnect = () => console.info('Socket disconnected');
const onConnect = () => console.info('Socket connected');
const onReconnect = () => console.info('Socket reconnected');

const init = () => {
  socket = io({
    auth: {
      token: jscookie.get('token'),
    },
  });
  subscribe('connect', onConnect);
  subscribe('reconnect', onReconnect);
  subscribe('disconnect', onDisconnect);
};

const subscribe = (eventName, callback) => {
  socket.on(eventName, callback);
  console.info(`Socket started listening to ${eventName}`);
};

const unsubscribe = (eventName) => {
  socket.off(eventName);
  console.info(`Socket stopped listening to ${eventName}`);
};

const disconnect = () => {
  socket.disconnect();
};

const obj = { init, subscribe, unsubscribe, disconnect };

export default obj;
