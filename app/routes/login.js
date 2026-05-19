import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'frontend-loket/config/environment';

export default class LoginRoute extends Route {
  @service() session;

  beforeModel() {
    if (this.session.prohibitAuthentication('index')) {
      const { loginPageRedirectUrl } = config;
      if (!loginPageRedirectUrl.startsWith('{{')) {
        window.location = loginPageRedirectUrl;
      }
    }
  }
}
