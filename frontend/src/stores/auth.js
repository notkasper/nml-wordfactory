import {
  action,
  computed,
  makeObservable,
  observable,
  autorun,
  runInAction,
} from 'mobx';
import request from 'superagent';
import cookie from 'js-cookie';

// Tutorial on mobx state management: https://blog.logrocket.com/introduction-to-mobx-with-react/
class AuthStore {
  constructor() {
    makeObservable(this, {
      login: action,
    });
  }

  login = async (email, password) => {
    await request.post('/api/v1/auth/login').send({
      email,
      password,
    });
    this.test();
  };

  getToken = () => {
    const token = cookie.get('token');
    const bearer = `bearer ${token}`;
    return bearer;
  };

  test = async () => {
    // test if teacher auth works
    const res = await request
      .get('/api/v1/auth/teacherTest')
      .set('Authorization', this.getToken());

    console.log(res.body.message);
  };
}

export default AuthStore;
