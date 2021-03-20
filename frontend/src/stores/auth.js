import { action, makeObservable, observable } from 'mobx';
import cookie from 'js-cookie';
import service from '../service';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class AuthStore {
  constructor() {
    makeObservable(this, {
      error: observable,
      login: action,
      logout: action,
      setError: action,
    });
  }

  error = null;

  setError = (error) => {
    this.error = error;
    setTimeout(() => {
      this.error = null;
    }, 2000);
  };

  login = async (email, password) => {
    const response = await service.login(email, password);
    if (!response) {
      return false;
    }
    return true;
  };

  logout = () => {
    cookie.remove('token');
  };
}

export default new AuthStore();
