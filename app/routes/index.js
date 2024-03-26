import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service currentSession;
  // @service impersonation;
  @service router;
  @service session;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    // TODO: Do we always want to redirect admins to the impersonate route if they aren't impersonating?
    // if (this.currentSession.isAdmin && !this.impersonation.isImpersonating) {
    //   this.router.replaceWith('impersonate');
    // }
  }
}
