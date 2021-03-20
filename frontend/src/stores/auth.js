import { action, makeObservable } from 'mobx';
import request from 'superagent';
import cookie from 'js-cookie';
import service from '../service';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class AuthStore {
  constructor() {
    makeObservable(this, {
      login: action,
      logout: action,
    });
  }

  login = async (email, password) => {
    await service.login(email, password);
  };

  logout = () => {
    cookie.remove('token');
  };
}

export default AuthStore;
