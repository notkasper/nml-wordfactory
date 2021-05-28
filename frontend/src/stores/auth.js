import { action, makeObservable, observable } from 'mobx';
import cookie from 'js-cookie';
import service from '../service';
import socket from '../socket';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class AuthStore {
  constructor() {
    makeObservable(this, {
      error: observable,
      success: observable,
      login: action,
      logout: action,
      setError: action,
    });
  }

  error = null;
  success = null;

  setError = (error) => {
    this.error = error;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  };

  setSuccess = (success) => {
    this.success = success;
    setTimeout(() => {
      this.success = null;
    }, 4000);
  };

  login = async (email, password) => {
    const response = await service.login(email, password);
    if (!response) {
      return false;
    }
    socket.connect();
    return true;
  };

  logout = () => {
    cookie.remove('token');
    socket.disconnect();
  };
}

export default new AuthStore();
