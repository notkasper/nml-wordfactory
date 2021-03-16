import { action, makeObservable } from 'mobx';
import request from 'superagent';
import cookie from 'js-cookie';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class AuthStore {
  constructor() {
    makeObservable(this, {
      login: action,
      logout: action,
    });
  }

  login = async (email, password) => {
    await request.post('/api/v1/auth/login').send({
      email,
      password,
    });
  };

  logout = () => {
    cookie.remove('token');
  };
}

export default AuthStore;
