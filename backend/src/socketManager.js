const { verifyToken } = require('./_utils');
const socketio = require('socket.io');
const logger = require('./logger');

const pool = {};

const getSocket = (teacherId) => pool[teacherId];
const setSocket = (teacherId, socket) => (pool[teacherId] = socket);

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('No token provided'));
  }
  verifyToken(token)
    .catch((err) => next(err))
    .then(({ teacherId }) => {
      socket.teacherId = teacherId;
      next();
    });
};

const init = (server) => {
  const io = socketio(server);
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    setSocket(socket.teacherId, socket);
    setTimeout(() => {
      emitEvent(socket.teacherId, 'ping', { message: 'Hello World!' });
    }, 3000);
  });
};

const isConnected = (teacherId) => !!getSocket(teacherId)?.connected;

const emitEvent = (teacherId, eventName, data = {}) => {
  const socket = getSocket(teacherId);
  if (!socket) {
    logger.error('Attempt to emit to socket but socket was not found in pool');
    socket.emit('error', 'Connection error occurred. Please refresh the page.');
    return;
  }
  socket.emit(eventName, data);
};

const broadcast = (eventName, data = {}) => {
  Object.values(pool).forEach((socket) => {
    socket.emit(eventName, data);
  });
};

module.exports = { init, emitEvent, isConnected, broadcast };
