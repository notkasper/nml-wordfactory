import { io } from 'socket.io-client';
import jscookie from 'js-cookie';

let socket;

const init = () => {
  socket = io({
    auth: {
      token: jscookie.get('token'),
    },
  });
};

const subscribe = (eventName, callback) => {
  if (!socket) {
    console.error(
      'Attempt to subscribe to socket event, but socket is not available'
    );
    return;
  }
  socket.on(eventName, callback);
};

const disconnect = () => {
  socket.disconnect();
};

export default { init, subscribe, disconnect };
