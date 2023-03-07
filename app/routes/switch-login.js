import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

// This route is only needed because ACM/IDM is configured to redirect to it when switching users.
// We would need to change the configuration before we can remove it, otherwise we see a "bad request" error message.
export default class SwitchLoginRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    if (this.session.prohibitAuthentication('index')) {
      this.router.replaceWith('auth.login');
    }
  }
}
